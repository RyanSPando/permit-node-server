
exports.up = function(knex, Promise) {
  return knex.schema.createTable('permits', function(table){
    table.integer('_id').notNullable().primary();
    table.text('OriginalCity');
    table.text('OriginalZip');
    table.text('AppliedDate');
    table.decimal('EstProjectCost', 14, 2);
    table.decimal('Fee', 14 , 2);
    table.float('LAT');
    table.float('LON');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('permits');
};
