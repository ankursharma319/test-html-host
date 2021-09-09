var xapi;

const $ = sel => document.querySelector(sel);
const $$ = sel => document.querySelectorAll(sel);

const PIN = '1337';
let home = true;
let timer = 0;
let lang = 'en';

function dial(Number) {
  xapi.command('Dial', { Number });
}

function setLanguage(language) {
  xapi.config.set('UserInterface Language', language);
}

function show(el, visible) {
  el.style.display = visible ? 'flex' : 'none';
}

function notify(msg) {
  console.log(msg);
  return;
  // clearTimeout(timer);
  // const a = $('.alert');
  // a.innerText = msg;
  // a.style.display = 'block';
  // timer = setTimeout(() => a.style.display = 'none', 2000);
}

function showHome(isHome) {
  home = isHome;
  show($('.home'), home);
  show($('.dial'), !home);
  showSelfview(!isHome);
}

function showSelfview(show) {
  if (show) {
    xapi.command('Video SelfView Set', { FullScreenMode: 'On' });
    xapi.command('Video SelfView Set', { PIPPosition: 'LowerRight' });
    xapi.command('Video SelfView Set', { Mode: 'On' });
  } else {
    xapi.command('Video Selfview Set', { Mode: 'Off' });
  }
}

function askPin() {
  const pin = prompt('To quit kiosk mode, enter pin code:');
  if (pin === PIN) xapi.command('Standby Deactivate');
  else if (pin) alert('Wrong pin');
}

function onClick(e) {
  const btn = e.target;
  if (btn.classList.contains('dial-button')) {
    const number = btn.dataset.number;
    dial(number);
  }
  else if (btn.classList.contains('flag-button')) {
    setLanguage(btn.dataset.lang);
    e.stopPropagation();
  } else if (btn.classList.contains('quit')) {
    askPin();
  } else
    showHome(!home);
}

getXapi().then(obj => obj).catch(err => { console.log(err); return createMockXapi(); }).then(obj => {
  xapi = obj;
  xapi.feedback.on('Configuration UserInterface Language', feedback => {
    const code = feedback.Configuration.UserInterface.Language.substr(0, 2).toLowerCase();
    const str = strings[code];
    for (let s in str) {
      $('.' + s).innerText = str[s];
    }
  }, true);
});

document.addEventListener("DOMContentLoaded", function() {
  document.body.onclick = onClick;
});
