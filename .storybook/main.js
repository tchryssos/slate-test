const path = require('path')
const customFunc = require('../webpack.config.js')

module.exports = {
  stories: [
    '../src/stories/*.stories.jsx',
  ],
  addons: [
    '@storybook/addon-actions',
    '@storybook/addon-links',
    '@storybook/addon-viewport/register',
  ],
  webpackFinal: async config => {
    const custom = customFunc(null, { mode: 'staging'})

    return ({
      ...config,
      module: {
        ...config.module,
        rules: [
          ...custom.module.rules,
        ],
      },
      resolve: {
        ...config.resolve,
        ...custom.resolve,
        alias: {
          components: path.join(__dirname, '../src/components'),
          static: path.join(__dirname, '../src/static'),
          pages: path.join(__dirname, '../src/pages'),
          styles: path.join(__dirname, '../src/styles'),
          constants: path.join(__dirname, '../src/constants'),
          util: path.join(__dirname, '../src/util'),
          contexts: path.join(__dirname, '../src/contexts'),
        },
      },
    })
  },
};
