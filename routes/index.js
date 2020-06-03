const listingsHandler = require('../controllers').listingsHandler;
const secteursHandler = require('../controllers').secteursHandler;


module.exports = (app) => {

  // LISTINGS
  app.get('/api/getlistings', listingsHandler.getAllListings);
  //app.post('/api/allvehicles', dataHandlerController.allvehicles);

  // SECTEURS
  app.get('/api/getsecteurs', secteursHandler.getAllSecteurs);


};