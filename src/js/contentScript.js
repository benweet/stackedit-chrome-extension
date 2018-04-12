/* global chrome */
import Stackedit from 'stackedit-js';
import '../img/icon.svg';
import settings from './settings';

settings.getSites()
  .then((sites) => {
    const presets = {
      default: {},
      gfm: {
        extensions: {
          preset: 'gfm',
        },
      },
      commonmark: {
        extensions: {
          preset: 'commonmark',
        },
      },
      stackexchange: {
        extensions: {
          preset: 'zero',
          katex: {
            enabled: true,
          },
        },
      },
    };

    const buttonStyle = {
      position: 'absolute',
      fontSize: '12px',
      textDecoration: 'underline',
      height: '20px',
      lineHeight: '20px',
      paddingLeft: '25px',
      background: `left no-repeat url("${chrome.runtime.getURL('icon.svg')}")`,
      backgroundSize: '20px 20px',
      margin: '-25px 0 0 5px',
      zIndex: 9999,
    };

    function decorateTextarea(el, preset) {
      if (!el.$seIsDecorated) {
        el.hasStackEditButton = true;
        el.style.paddingBottom = '30px';
        const buttonEl = document.createElement('a');
        buttonEl.href = 'javascript:void(0)'; // eslint-disable-line no-script-url
        buttonEl.textContent = 'Edit with StackEdit';
        Object.keys(buttonStyle).forEach((key) => {
          buttonEl.style[key] = buttonStyle[key];
        });
        el.parentNode.insertBefore(buttonEl, el.nextSibling);
        el.parentNode.insertBefore(document.createElement('div'), buttonEl);
        buttonEl.addEventListener('click', () => {
          const stackedit = new Stackedit({ url: chrome.runtime.getURL('frame.html') });
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
        el.$seIsDecorated = true;
      }
    }

    let debounceTimeoutId;
    function decorateAll(preset) {
      clearTimeout(debounceTimeoutId);
      debounceTimeoutId = setTimeout(() => {
        const textareaEls = document.querySelectorAll('textarea');
        for (let i = 0; i < textareaEls.length; i += 1) {
          decorateTextarea(textareaEls[i], preset);
        }
      }, 100);
    }

    sites.some((site) => {
      if (location.href.indexOf(site.url) !== 0) {
        return false;
      }
      const preset = presets[site.preset];
      const bodyObserver = new MutationObserver(() => decorateAll(preset));
      bodyObserver.observe(document.body, {
        childList: true,
        subtree: true,
      });
      decorateAll(preset);
      return true;
    });
  });
