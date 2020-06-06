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

    const datetime = new Date;

    return knex.raw(
      `
      SELECT distinct(a.id)
      FROM fact AS a
      JOIN secteurs AS b
      ON ST_WITHIN(a.point_geom, b.wkb_geometry)
      WHERE b.codesm = '${req.body.codesm}'
      `,
    ).then(result => {
      console.log(datetime, result.rows);
      res.json(result.rows);
    });
  },

  avgPrice(req, res) {

    const datetime = new Date;

    return knex.raw(
      `
      WITH UL AS (
        SELECT distinct(a.id), last_price
        FROM fact AS a
        JOIN secteurs AS b
        ON ST_WITHIN(a.point_geom, b.wkb_geometry)
        WHERE b.codesm = '${req.body.codesm}'
      )
      SELECT AVG(last_price)
      FROM UL
      `,
    ).then(result => {
      console.log(datetime, result.rows);
      res.json(result.rows);
    });
  }

}