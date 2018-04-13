export default {
  default: {},
  commonmark: {
    extensions: {
      preset: 'commonmark',
    },
  },
  gfm: {
    extensions: {
      preset: 'gfm',
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
