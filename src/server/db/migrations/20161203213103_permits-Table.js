
exports.up = function(knex, Promise) {
  return knex.schema.createTable('permits', function(table){
    table.integer('_id').notNullable().primary();
    table.text('OriginalCity');
    table.text('OriginalZip');
    table.text('AppliedDate');
    table.text('EstProjectCost');
    table.text('Fee');
    table.text('LAT');
    table.text('LON');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('permits');
};
