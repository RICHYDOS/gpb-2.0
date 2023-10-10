module.exports = {
    routes: [
      { // Path defined with an URL parameter
        method: 'POST',
        path: '/webhooks', 
        handler: 'webhooks.check',
      },
    ]
  }