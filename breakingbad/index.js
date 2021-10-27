const $ = sel => document.querySelector(sel);

const div = (cls) => {
  const div = document.createElement('div');
  if (cls) div.className = cls;
  return div;
}

function startTest(symbol) {
  const test = cases.find(t => t.symbol === symbol);
  if (!test) return;

  $('.run').style.display = 'none';
  if (test.canStop) $('.stop').style.display = 'block';
  $('.progress').innerText = 'Test started';
  setTimeout(() => runTest(symbol), 10);
}

function select(symbol) {
  const list = Array.from(document.querySelectorAll('.symbol'));
  list.forEach((i) => {
    const mark = i.innerText === symbol;
    i.parentElement.classList.toggle('selected', mark);
  })
}

function load(symbol) {
  const test = cases.find(t => t.symbol === symbol);
  if (!test) return;

  const url = location.origin + '?autorun=' + test.symbol;
  $('.details h1').innerText = test.name;
  $('.details .info').innerHTML = test.info;
  $('.details .info').innerHTML += '<p/>Auto-run: ' + url;
  $('.run').onclick = () => startTest(symbol);
  $('.run').style.display = 'block';
  $('.stop').style.display = 'none';
  $('.progress').innerText = '';
  select(symbol);
}

function addCases() {
  const parent = $('.cases');

  cases.forEach((c, i) => {
    const d = div('case');
    const number = div('number');
    const name = div('name');
    const symbol = div('symbol');
    symbol.innerText = c.symbol;
    number.innerText = i + 1;
    name.innerText = c.name;
    d.appendChild(symbol);
    d.appendChild(number);
    d.appendChild(name);
    d.onclick = () => load(c.symbol);
    parent.appendChild(d);
  });
}

function checkAutoRun() {
  if (location.search.includes('autorun=')) {
    const test = location.search.replace('autorun=', '').replace('?', '');
    load(test);
    setTimeout(() => startTest(test), 500); // dont start immediately
  }
}

function confirmStop() {
  const stop = confirm('Page is still responding. Stop test?');
  if (stop) location.reload();
}

function jumpHat() {
  const hat = $('.hat');
  hat.classList.remove('hat-pulse');
  hat.classList.add('hat-jump');
  setTimeout(() => {
    hat.classList.remove('hat-jump');
    hat.classList.add('hat-pulse');
  }, 500);
}

function init() {
  addCases();
  checkAutoRun();
  $('.stop').onclick = confirmStop;
  $('.hat').onclick = jumpHat;
  $('.useragent').innerText = navigator.userAgent;
}

window.onload = init;
