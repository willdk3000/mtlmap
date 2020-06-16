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

    // Request in 3 parts
    // Part 1 - WITH UL - Get all unique listings from chosen sector
    // (will contain duplicate ids because same data is scraped every day and date changes)
    // Part 2 - Partition by sector id and add row number for every date
    // Part 3 - Get all ids with row number = 1 (most recent)

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
        SELECT row_number() OVER (
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
  },

  monthlyStats(req, res) {

    // Request in 2 parts
    // Part 1 - Get all monthlyfact info from chosen sector
    // Part 2 - Partition by id and add row number for each month, from latest to oldest

    return knex.raw(
      `
      WITH UL AS(
        SELECT *
           FROM monthlyfact AS a
           WHERE a.od_sector_id = '${req.body.codesm}'
      )
      
      SELECT row_number() OVER (
        PARTITION BY od_sector_id
           ORDER BY month DESC) AS rn,
        month,
        od_sector_id,
        mean_price,
        min_price,
        max_price,
        min_revenue,
        max_revenue,
        mean_revenue,
           nb_listings
      FROM UL 
      `
    ).then(result => {
      res.json(result.rows);
    });
  },

  typeMonthlyStats(req, res) {

    return knex.raw(
      `
      WITH UL AS(
        SELECT *
           FROM type_monthlyfact AS a
           WHERE a.od_sector_id = '${req.body.codesm}'
      )
      
      SELECT row_number() OVER (
        PARTITION BY od_sector_id, type
           ORDER BY month DESC) AS rn,
        month,
        type,
        od_sector_id,
        mean_price,
        min_price,
        max_price,
        min_revenue,
        max_revenue,
        mean_revenue,
        nb_listings
      FROM UL 
      `
    ).then(result => {
      res.json(result.rows);
    });
  }

}