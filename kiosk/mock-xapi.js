function createMockXapi() {
    var handlers = {};
    const xapi = {
      command: (cmd, args = '') => {
        console.log('cmd', cmd, args);
        notify(cmd + JSON.stringify(args));
        return Promise.resolve(true);
      },
      config: {
        set: (name, value) => {
          var config = "Configuration " + name.trim();
          console.log(config + ":", value);
          notify(config + ': ' + value);
          var handler = handlers[config];
          if (handler !== undefined) {
            var path = config.trim().split(' ');
            var tree = {};
            var current = tree;
            path.slice(0, -1).forEach(name => { current = current[name] = {}; });
            current[path.slice(-1)] = value;
            handler(tree);
          }
          return Promise.resolve(true);
        },
      },
      feedback: {
        on: (path, handler) => {
          handlers[path.trim()] = handler;
        },
      },
    };
  
    return xapi;
  }
  