const knex = require('../config/knex');

module.exports = {

  getAllSecteurs(req, res) {

        return knex.raw(
          `SELECT jsonb_build_object(
                        'type',     'FeatureCollection',
                        'features', jsonb_agg(features.feature)
                    )
                    FROM (
                      SELECT jsonb_build_object(
                        'type',       'Feature',
                        'geometry',   ST_AsGeoJSON(wkb_geometry)::jsonb,
                        'properties', jsonb_build_object(
                                    'id', codesm,
                                    'nom', nomsm)        
                      ) AS feature
                     
                      FROM (SELECT * FROM secteurs) inputs) features;`,
        ).then(result => {
          res.json(result.rows[0].jsonb_build_object)
        });
      }

}