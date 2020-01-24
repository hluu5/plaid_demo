const { pool } = require('./index.js');

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
    user_id VARCHAR (50) UNIQUE NOT NULL,
    accessToken VARCHAR (50) UNIQUE NOT NULL,
    itemId VARCHAR (50) UNIQUE NOT NULL,
    institutionId VARCHAR (50) UNIQUE NOT NULL,
    institutionName VARCHAR (50) UNIQUE NOT NULL
  );
`

//index shoes name for faster lookup
const createAccountIndexQuery = `
  CREATE INDEX IF NOT EXISTS account_id ON dcr.accounts
  USING btree
  ( account_id ASC )
`

const connect = async ()=> {
  try{
    let client = await pool.connect();
    await client.query(schemaQuery);
    await client.query(createAccountTableQuery);
    await client.query(createAccountIndexQuery);
    await client.query(createUserTableQuery);
    await client.query(createUserIndexQuery);
    await client.release();
  }
  catch(err){
    pool.end();
    console.log('ERROR IN CREATING DB AND RECORD: ', err)
  }
}

connect();
