const listingsHandler = require('../controllers').listingsHandler;
const secteursHandler = require('../controllers').secteursHandler;


module.exports = (app) => {

  // LISTINGS
  app.get('/api/getlistings', listingsHandler.getAllListings);
  app.post('/api/uniqueListings', listingsHandler.uniqueListingsPrice);
  //app.post('/api/avgPrice', listingsHandler.avgPrice);

  // SECTEURS
  app.get('/api/getsecteurs', secteursHandler.getAllSecteurs);


};