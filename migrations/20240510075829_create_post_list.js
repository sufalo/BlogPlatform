exports.up = function(knex) {
    return knex.schema.createTable('posts', table => {
      table.increments('id');
      table.string('title');
      table.string('snippet');
      table.text('content');
      table.date('date').defaultTo(knex.fn.now());
      table.time('time').defaultTo(knex.fn.now());
      table.string('author');
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('posts');
  };