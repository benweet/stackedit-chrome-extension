/* global chrome */
const defaultSites = [{
  url: 'https://github.com/',
  preset: 'gfm',
}, {
  url: 'https://stackoverflow.com/',
  preset: 'stackexchange',
}, {
  url: 'https://*.stackexchange.com/',
  preset: 'stackexchange',
}];

export default {
  defaultSites,
  getSites() {
    return new Promise((resolve) => {
      chrome.storage.sync.get(['sites'], (result) => {
        const sites = result.sites || defaultSites;
        resolve(sites.map(site => Object.assign({
          // Compute site url regex
          regex: new RegExp(site.url
            .replace(/[-[\]/{}()+?.\\^$|]/g, '\\$&') // Escape string
            .replace(/\*/g, '.*')), // Replace `*` with `.*`
        }, site)));
      });
    });
  },
  setSites(sites) {
    return new Promise((resolve) => {
      chrome.storage.sync.set({ sites }, resolve);
    });
  },
};
