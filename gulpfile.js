const gulp = require('gulp')
const knex = require('./config/knex');

gulp.task('add_fact_geom', function (done) {
    return knex.raw(
        `
            UPDATE fact SET point_geom = st_SetSrid(st_MakePoint(lng, lat), 4326);
        `
    ).then(done())
})

gulp.task('import_fact', function (done) {
    return knex.raw(
        `\COPY fact FROM '/home/will/webdev/mtlmap/data/centris_fact_utf8.csv' DELIMITER ',' CSV HEADER;
        `
    ).then(done())
})

gulp.task('import_monthlyfact', function (done) {
    return knex.raw(
        `\COPY monthlyfact FROM '/home/will/webdev/mtlmap/data/centris_monthly_fact.csv' DELIMITER ',' CSV HEADER;
        `
    ).then(done())
})

gulp.task('import_yearlyfact', function (done) {
    return knex.raw(
        `\COPY yearlyfact FROM '/home/will/webdev/mtlmap/data/centris_yearly_fact.csv' DELIMITER ',' CSV HEADER;
        `
    ).then(done())
})

gulp.task('import_type_monthlyfact', function (done) {
    return knex.raw(
        `\COPY type_monthlyfact FROM '/home/will/webdev/mtlmap/data/centris_type_monthly_fact.csv' DELIMITER ',' CSV HEADER;
        `
    ).then(done())
})

gulp.task('import_type_yearlyfact', function (done) {
    return knex.raw(
        `\COPY type_yearlyfact FROM '/home/will/webdev/mtlmap/data/centris_type_yearly_fact.csv' DELIMITER ',' CSV HEADER;
        `
    ).then(done())
})

gulp.task('import_all', function (done) {
    return knex.raw(
        `\COPY fact FROM '/home/will/webdev/mtlmap/data/centris_fact_utf8.csv' DELIMITER ',' CSV HEADER;
        \COPY monthlyfact FROM '/home/will/webdev/mtlmap/data/centris_monthly_fact.csv' DELIMITER ',' CSV HEADER;
        \COPY yearlyfact FROM '/home/will/webdev/mtlmap/data/centris_yearly_fact.csv' DELIMITER ',' CSV HEADER;
        \COPY type_monthlyfact FROM '/home/will/webdev/mtlmap/data/centris_type_monthly_fact.csv' DELIMITER ',' CSV HEADER;
        \COPY type_yearlyfact FROM '/home/will/webdev/mtlmap/data/centris_type_yearly_fact.csv' DELIMITER ',' CSV HEADER;
        `
    ).then(done())
})