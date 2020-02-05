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
const createItemTableQuery = `
  CREATE TABLE IF NOT EXISTS items(
    user_id INTEGER NOT NULL,
    access_token VARCHAR (150) NOT NULL,
    itemId VARCHAR (150) NOT NULL
  )
`

const createItemIndexQuery = `
  CREATE INDEX IF NOT EXISTS itemId ON dcr.items
  USING btree
  ( itemId ASC )
`

const createAccountTableQuery = `
  CREATE TABLE IF NOT EXISTS accounts(
    account_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    accountId VARCHAR (150) UNIQUE NOT NULL,
    accountName VARCHAR (150) UNIQUE NOT NULL
  );
`

//index account_id for faster lookup
const createAccountIndexQuery = `
  CREATE INDEX IF NOT EXISTS account_id ON dcr.accounts
  USING btree
  ( account_id ASC )
`

//create asset report table
const createAssetReportTableQuery = `
  CREATE TABLE IF NOT EXISTS asset_reports(
    id SERIAL PRIMARY KEY,
    asset_report_id VARCHAR (150) UNIQUE NOT NULL,
    asset_report_token VARCHAR (150) UNIQUE NOT NULL,
    request_id VARCHAR (150) UNIQUE NOT NULL
  );
`

//index asset_report_id for faster lookup
const createAssetReportIndexQuery = `
  CREATE INDEX IF NOT EXISTS asset_report_id ON dcr.asset_reports
  USING btree
  ( asset_report_id ASC )
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
    await client.query(createItemTableQuery);
    await client.query(createItemIndexQuery);
    await client.query(createAssetReportTableQuery);
    await client.query(createAssetReportIndexQuery);
    await client.release(); 
    await createFakeUser();
  }
  catch(err){
    pool.end();
    console.log('ERROR IN CREATING DB AND RECORD: ', err)
  }
}

connect();
