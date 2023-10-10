module.exports = {
    routes: [
      { // Path defined with an URL parameter
        method: 'POST',
        path: '/quotes', 
        handler: 'quotes.send',
      },
    ]
  }
