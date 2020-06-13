const knex = require('../config/knex');

module.exports = {

  getAllListings(req, res) {

    return knex.raw(
      `SELECT * FROM fact`,
    ).then(result => {
      res.json(result.rows)
    });
  },

  uniqueListingsPrice(req, res) {

    const datetime = new Date;
    const month = datetime.getMonth();

    console.log(req.connection.remoteAddress + ' requested info');

    return knex.raw(
      `
      WITH UL AS(
        SELECT distinct(a.id) as sid, last_price, date
           FROM fact AS a
           JOIN secteurs AS b
           ON ST_WITHIN(a.point_geom, b.wkb_geometry)
           WHERE b.codesm = '${req.body.codesm}'
      ),
      CTE AS (
        SELECT row_number() 
        OVER (
          PARTITION BY sid
            ORDER BY date DESC) AS rn,
          sid,
          last_price,
          date
          FROM UL 
      ) 
      SELECT sid, last_price, date
      FROM cte
      WHERE rn=1
      ORDER BY sid;
      `
    ).then(result => {
      res.json(result.rows);
    });
  }

}