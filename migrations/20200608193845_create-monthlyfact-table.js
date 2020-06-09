
exports.up = function (knex) {

    return knex.schema.createTable('monthlyfact', (table) => {
        table.integer('month');
        table.integer('od_sector_id');
        table.text('od_sector');
        table.float('min_price');
        table.float('max_price');
        table.float('mean_price');
        table.float('min_revenue');
        table.float('max_revenue');
        table.float('mean_revenue');
        table.integer('nb_listings');

    });

};

exports.down = function (knex) {
    return knex.schema.dropTable('monthlyfact');
};
