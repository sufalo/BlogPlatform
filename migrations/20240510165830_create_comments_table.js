exports.up = function(knex) {
    return knex.schema.createTable('comments', table => {
        table.increments('id');
        table.integer('post_id').references('id').inTable('posts').onDelete('CASCADE').notNullable();
        table.string('author');
        table.text('content');
        table.timestamp('created_at').defaultTo(knex.fn.now());
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('comments');
};
