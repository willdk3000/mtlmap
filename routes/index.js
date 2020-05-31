const listingsHandler = require('../controllers').listingsHandler;

module.exports = (app) => {

  app.get('/api/getlistings', listingsHandler.getAllListings);
  //app.post('/api/allvehicles', dataHandlerController.allvehicles);



};