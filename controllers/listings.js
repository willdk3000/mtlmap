const knex = require('../config/knex');

module.exports = {

  getAllListings(req, res) {

    return knex.raw(
      `SELECT * FROM fact`,
    ).then(result => {
      res.json(result.rows)
    });
  }

}