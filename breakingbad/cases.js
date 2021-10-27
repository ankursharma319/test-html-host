
function createDateObject() {
    return new Date(parseInt(Math.random() * 1E8));
  }
  
  function rand(min, max) {
    return parseInt((max - min) * Math.random()) + min;
  }
  
  function showProgress(text) {
    $('.progress').innerHTML = text;
  }
  
  function exhaustMemory() {
    let list = [];
    setInterval(() => {
      for (let i=0; i<1000; i++) {
        list.push(createDateObject());
      }
      list = list.concat(list);
    }, 1000);
    setInterval(() => {
      showProgress(`Number of random date elements created: <b>${list.length}</b>`);
    }, 1000);
  }
  
  function runTest(symbol) {
    const test = cases.find(t => t.symbol === symbol);
    if (!test) return;
    try {
      test.func();
    } catch (e) {
      console.log(e);
      alert('Test was terminated');
    }
  
  }
  
  function infiniteLoop() {
    while (true) {
      const x = Math.sqrt(Math.random(1E8, 1E9));
    }
  };
  
  function recursiveLoop() {
    const a = Math.sqrt(Math.random(1E8, 1E9));
    recursiveLoop();
  }
  
  function exhaustGpu() {
    const parent = $('.cases');
    const w = window.innerWidth / 2;
    const h = window.innerHeight;
    let total = 0;
  
    setInterval(() => {
      for (let i = 0; i < 100; i++) {
        const x = rand(50, w - 250);
        const y = rand(50, h - 100);
        const bubble = div('bubble');
        bubble.style.top = y;
        bubble.style.left = x;
        parent.appendChild(bubble);
        total += 1;
      }
      showProgress('Bubbles created: ' + total);
    }, 500);
  }
  
  function showLanguage() {
    const lang = navigator.language;
    const strings = {
      no: 'God dag, god dag!',
      de: 'Guten aben!',
      fr: 'Bon jour!',
      en: 'Good morning!',
    };
    const txt = strings[lang] || `(No translation for language: ${lang})`;
    const msg = div('language-test');
    const flag = strings[lang] ? `http://flags.fmcdn.net/data/flags/h80/${lang}.png` : null;
    msg.innerText = txt;
    console.log('flag', flag);
    if (flag) msg.style.backgroundImage = `url(${flag})`;
    $('.info').appendChild(msg);
    const setting = div();
    setting.innerText = `navigator.language: ${lang}`;
    $('.info').appendChild(setting);
  }
  
  function performanceTest() {
    showProgress('Calculating square roots');
  
    const start = new Date().getTime();
    const total = 1E9;
    for (let i = 0; i < total; i++) {
      Math.sqrt(i);
    }
    const elapsed = new Date().getTime() - start;
    showProgress(`Total time: ${elapsed} ms`);
  }
  
  const cases = [
    {
      symbol: 'Pt',
      name: 'Performance test',
      info: 'Simple, pure JS performance test. Calculates the square root a huge amount of increasing integers.<p/>Reference: Macbook Air 2015: <b>~1 sec</b> <p/>Expected time: <b> < 10 seconds</b.',
      func: performanceTest,
      canStop: false,
    },
    {
      symbol: 'Em',
      name: 'Exhaust memory',
      info: 'Use gradually more and more pure JS memory, by creating increasingly heavy data structures.<p/> Success criteria: Web view should either die or stop consuming more memory. User can still use the rest of the system without degradation when exiting the web view. Main UI should not crash or freeze.',
      func: exhaustMemory,
      canStop: true,
    },
    {
      symbol: 'Eg',
      name: 'Exhaust GPU',
      info: 'Use gradually more GPU memory, by creating more and more elements on screen. <p/>Success criteria: Web view should either terminate or stop consuming more memory.',
      func: exhaustGpu,
      canStop: true,
    },
    {
      symbol: 'Il',
      name: 'Infinite loop',
      info: 'Calculate square numbers forever. <p/>Success criteria. User should be able to exit web engine by tapping home button.',
      func: infiniteLoop,
      canStop: false,
    },
    {
      symbol: 'Rl',
      name: 'Recursive loop',
      info: 'Function calls itself recursively without any end condition. <p/>Success criteria: Web engine should detect the stack overflow and terminate the script.',
      func: recursiveLoop,
      canStop: false,
    },
    {
      symbol: 'Lt',
      name: 'Language test',
      info: 'Verify that codec language is propagated to web view and available in the navigator.language property',
      func: showLanguage,
      canStop: false,
    }
  ];
  