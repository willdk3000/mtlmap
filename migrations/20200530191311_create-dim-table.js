
exports.up = function(knex) {
  
    return knex.schema.createTable('fact', (table) => {
        table.date('date');
        table.integer('id');
        table.text('type');
        table.float('nb_units');
        table.double('lat');
        table.double('lng');
        table.float('last_price');
        table.float('potential_revenue');
        table.text('borough');
        table.text('city');

    });

};

exports.down = function(knex) {
    return knex.schema.dropTable('fact');
};
