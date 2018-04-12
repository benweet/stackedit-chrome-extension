const iframeEl = document.querySelector('iframe');
let parentOrigin;
const params = (location.hash || '').slice(1).split('&').map((arg) => {
  const split = arg.split('=');
  if (split[0] === 'origin') {
    parentOrigin = decodeURIComponent(split[1]);
    return `origin=${encodeURIComponent(document.origin)}`;
  }
  return arg;
});
const url = `https://stackedit.io/app#${params.join('&')}`;
iframeEl.src = url;

window.addEventListener('message', (event) => {
  if (event.origin === 'https://stackedit.io' && event.source === iframeEl.contentWindow) {
    window.parent.postMessage(event.data, parentOrigin);
  }
});
