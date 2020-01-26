const { pool, pgQuery } = require('./index.js');
const bcrypt = require('bcryptjs')

const schemaQuery = `
  CREATE SCHEMA IF NOT EXISTS dcr;
  SET search_path TO dcr
`

const createUserTableQuery = `
  CREATE TABLE IF NOT EXISTS users(
    user_id SERIAL PRIMARY KEY,
    username VARCHAR (50) UNIQUE NOT NULL,
    password VARCHAR NOT NULL
  )
`

const createUserIndexQuery = `
  CREATE INDEX IF NOT EXISTS username ON dcr.users
  USING btree
  ( username ASC )
`

const createAccountTableQuery = `
  CREATE TABLE IF NOT EXISTS accounts(
    account_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    accessToken VARCHAR (150) NOT NULL,
    itemId VARCHAR (150) NOT NULL,
    accountId VARCHAR (150) UNIQUE NOT NULL,
    accountName VARCHAR (150) UNIQUE NOT NULL
  );
`

//index shoes name for faster lookup
const createAccountIndexQuery = `
  CREATE INDEX IF NOT EXISTS account_id ON dcr.accounts
  USING btree
  ( account_id ASC )
`

//create a fake user:
const createFakeUser = async ()=> {
  const query = 'INSERT INTO dcr.users(username, password) VALUES($1, $2) RETURNING *'
  const password = bcrypt.hashSync('password', 10);
  const values = ['huy', password]
  await pgQuery(query,values, (data)=> {
    console.log('Admin User Created In Postgres: ', data.rows)
  })
}

const connect = async ()=> {
  try{
    let client = await pool.connect();
    await client.query(schemaQuery);
    await client.query(createAccountTableQuery);
    await client.query(createAccountIndexQuery);
    await client.query(createUserTableQuery);
    await client.query(createUserIndexQuery);
    await client.release(); 
    await createFakeUser();
  }
  catch(err){
    pool.end();
    console.log('ERROR IN CREATING DB AND RECORD: ', err)
  }
}

connect();
