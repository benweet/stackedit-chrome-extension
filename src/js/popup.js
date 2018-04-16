import '../img/icon-16.png';
import '../img/icon-32.png';
import '../img/icon-64.png';
import '../img/icon-128.png';
import '../img/icon-256.png';
import '../img/icon-512.png';
import presets from './presets';
import settings from './settings';

const createEl = (parentEl, tag, props = {}) => {
  const el = document.createElement(tag);
  Object.keys(props).forEach((key) => {
    el[key] = props[key];
  });
  parentEl.appendChild(el);
  return el;
};

let rows;
const makeRows = (sites) => {
  const sitesEl = document.querySelector('.sites');
  let addExtraRow;
  const addRow = (site = {}) => {
    const row = {};
    row.divEl = createEl(sitesEl, 'div', { className: 'site' });
    row.inputEl = createEl(row.divEl, 'input', { type: 'text', value: site.url || '' });
    row.inputEl.addEventListener('input', () => addExtraRow());
    row.selectEl = createEl(row.divEl, 'select');
    Object.keys(presets).forEach((key) => {
      createEl(row.selectEl, 'option', { name: key, textContent: key });
    });
    row.selectEl.value = presets[site.preset] ? site.preset : 'default';
    rows.push(row);
  };

  rows = [];
  sitesEl.innerHTML = '';
  sites.forEach(site => addRow(site));

  addExtraRow = () => {
    const lastRow = rows[rows.length - 1];
    if (!lastRow || lastRow.inputEl.value.trim()) {
      addRow();
    }
  };
  addExtraRow();
};

document.getElementById('reset-button').addEventListener('click', () => makeRows(settings.defaultSites));
document.getElementById('cancel-button').addEventListener('click', () => window.close());
document.getElementById('ok-button').addEventListener('click', () => {
  const sites = [];
  rows.forEach((row) => {
    const url = row.inputEl.value.trim();
    if (url) {
      const preset = row.selectEl.value;
      sites.push({
        url,
        preset,
      });
    }
  });
  settings.setSites(sites)
    .then(() => window.close());
});

settings.getSites()
  .then(sites => makeRows(sites));
