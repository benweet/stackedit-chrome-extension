/* global chrome */
import Stackedit from 'stackedit-js';
import '../img/icon.svg';
import presets from './presets';
import settings from './settings';

const buttonSize = 24;
const buttonMargin = 7;

const styleContent = `
.stackedit-open-button {
  display: block;
  position: absolute;
  width: ${buttonSize}px;
  height: ${buttonSize}px;
  background: no-repeat url("${chrome.runtime.getURL('icon.svg')}");
  background-size: ${buttonSize}px ${buttonSize}px;
  z-index: 9999;
  opacity: 0.5;
  transition: opacity 0.5s;
}

.stackedit-open-button:focus,
.stackedit-open-button:hover {
  opacity: 1;
}
`;

settings.getSites()
  .then((sites) => {
    const styleEl = document.createElement('style');
    styleEl.type = 'text/css';
    styleEl.innerHTML = styleContent;
    document.head.appendChild(styleEl);

    function decorateTextarea(el, preset) {
      if (!el.$moveStackeditButton) {
        const buttonEl = document.createElement('a');
        buttonEl.href = 'javascript:void(0)'; // eslint-disable-line no-script-url
        buttonEl.className = 'stackedit-open-button';
        buttonEl.title = 'Edit with StackEdit';
        el.parentNode.insertBefore(buttonEl, el);
        buttonEl.addEventListener('click', () => {
          const stackedit = new Stackedit({
            url: chrome.runtime.getURL('frame.html'),
          });
          stackedit.on('fileChange', (file) => {
            el.value = file.content.text;
          });
          stackedit.openFile({
            name: location.hostname,
            content: {
              text: el.value,
              properties: preset,
            },
          });
        });
        el.$moveStackeditButton = () => {
          const rect = el.getBoundingClientRect();
          const left = `${((el.offsetLeft + rect.width) - buttonSize) - buttonMargin}px`;
          if (buttonEl.style.left !== left) {
            buttonEl.style.left = left;
          }
          const top = `${((el.offsetTop + rect.height) - buttonSize) - buttonMargin}px`;
          if (buttonEl.style.top !== top) {
            buttonEl.style.top = top;
          }
        };
      }
      el.$moveStackeditButton();
    }

    function decorateAll(preset) {
      const textareaEls = document.getElementsByTagName('textarea');
      for (let i = 0; i < textareaEls.length; i += 1) {
        decorateTextarea(textareaEls[i], preset);
      }
    }

    sites.some((site) => {
      if (!location.href.match(site.regex)) {
        return false;
      }
      const preset = presets[site.preset];
      const observer = new MutationObserver(() => decorateAll(preset));
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class'],
      });
      decorateAll(preset);
      return true;
    });
  });
