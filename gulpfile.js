const gulp = require('gulp')
const knex = require('./config/knex');

gulp.task('add_fact_geom', function (done) {
    return knex.raw(
        `
            UPDATE fact SET point_geom = st_SetSrid(st_MakePoint(lng, lat), 4326);
        `
    ).then(done())
})
