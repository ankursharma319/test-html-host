window.getXapi = () => new Promise((resolve, reject) => {
    window.getWS().then(ws => {
  
      var pending = {};
      var feedbacks = {};
      var counter = 0;
      var to_array = obj => (typeof obj === "string" ? obj.trim().split(" ") : obj);
      var to_slashed = obj => to_array(obj).join("/");
      var do_call = (method, params) => new Promise((resolve, reject) => {
        counter += 1;
        pending[counter] = {resolve: resolve, reject: reject};
        req = {
          jsonrpc: "2.0",
          id: counter,
          method: method,
        };
        if (params !== undefined)
          req.params = params;
        ws.send(JSON.stringify(req));
      });
      var xapi = {
        feedback: {
          on: (query, handler, current) => new Promise(resolve => {
            do_call("xFeedback/Subscribe", {
              Query: to_array(query),
              NotifyCurrentValue: current === true
            }).then(result => {
              feedbacks[result.Id] = handler;
              resolve(result.Id);
            });
          }),
          off: function(id) {
            delete feedbacks[id];
            return do_call("xFeedback/Unsubscribe", {Id: id});
          },
        },
        status: {
          get: path => do_call("xGet", {Path: ["Status"].concat(to_array(path))}),
        },
        config: {
          get: path => do_call("xGet", {Path: ["Configuration"].concat(to_array(path))}),
          set: (path, value) => do_call("xSet", {Path: ["Configuration"].concat(to_array(path)), Value: value}),
        },
        command: (command, params) => do_call("xCommand/" + to_slashed(command), params),
      };
      ws.onmessage = function(evt) {
        var response = JSON.parse(evt.data);
        if (response.id === undefined) { // is feedback
          if (response.method !== "xFeedback/Event") {
            console.log("Notification with method " + response.method + " was not understood");
            return;
          }
          var id = response.params.Id;
          delete response.params.Id;
          var handler = feedbacks[id];
          handler(response.params, id);
        } else { // is response
          var promise = pending[response.id];
          if (response.error === undefined)
            promise.resolve(response.result);
          else
            promise.reject(new Error(response.error.message));
        }
      };
      ws.onopen = () => resolve(xapi);
      ws.onclose = (evt) => console.log("Closed: " + JSON.stringify(evt));
      ws.onerror = () => reject(new Error("Connection failed unexpectedly"));
  
    }).catch(err => reject(err));
  });

