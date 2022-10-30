module.exports = {
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  browsers: [
    {
      name:'firefox',
      family:'firefox',
      channel:'stable',
      displayName:'Firefox',
      version:'106.0.1',
      path:'firefox',
      profilePath:'/home/ticto/snap/firefox/current',
      minSupportedVersion:86,
      majorVersion:'106',
    },
  ]
};


