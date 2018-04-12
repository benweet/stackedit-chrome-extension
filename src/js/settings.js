const defaultSites = [{
  url: 'https://github.com/',
  preset: 'gfm',
}, {
  url: 'https://stackoverflow.com/',
  preset: 'stackExchange',
}, {
  url: 'https://*stackexchange.com/',
  preset: 'stackExchange',
}];

export default {
  getSites() {
    return Promise.resolve(defaultSites);
  },
};
