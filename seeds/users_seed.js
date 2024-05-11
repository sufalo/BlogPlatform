const bcrypt = require('bcrypt');

exports.seed = async function(knex) {
    await knex('users').del();

    const hashedPassword = await bcrypt.hash('admin', 10);

    await knex('users').insert({
        username: 'admin',
        password: hashedPassword
    });
};