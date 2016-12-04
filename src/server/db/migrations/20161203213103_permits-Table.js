
exports.up = function(knex, Promise) {
  return knex.schema.createTable('permits', function(table){
    table.integer('_id').notNullable().primary();
    table.text('OriginalCity');
    table.text('OriginalZip');
    table.text('AppliedDate');
    table.text('EstProjectCost');
    table.text('LAT');
    table.text('LON');
    table.text('Fee');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('permits');
};
