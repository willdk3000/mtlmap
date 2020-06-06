
exports.up = function (knex) {

    return knex.raw(
        `ALTER TABLE fact ADD COLUMN point_geom geometry(Point,4326);`
    );

};

exports.down = function (knex) {

    return knex.raw(
        `ALTER TABLE fact DROP COLUMN point_geom;`);

};

