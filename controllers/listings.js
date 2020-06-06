const knex = require('../config/knex');

module.exports = {

  getAllListings(req, res) {

    return knex.raw(
      `SELECT * FROM fact`,
    ).then(result => {
      res.json(result.rows)
    });
  },

  uniqueListings(req, res) {

    return knex.raw(
      `
      SELECT distinct(a.id)
      FROM fact AS a
      JOIN secteurs AS b
      ON ST_WITHIN(a.point_geom, b.wkb_geometry)
      WHERE b.codesm = '${req.body.codesm}'
      `,
    ).then(result => {
      console.log(result.rows)
      res.json(result.rows)
    });
  }

}