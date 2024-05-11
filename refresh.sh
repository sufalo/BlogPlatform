#!/bin/bash

rm dev.sqlite3

npx knex migrate:latest

npx knex seed:run