const { Pool } = require('pg');
const dotenv = require('dotenv');
dotenv.config();

const pool = new Pool({
  //your username for postgres here
  user: 'postgres',
  //host should be ip address of your postgres container, your cloud postgres db or your local postgres db
  host: process.env.POSTGRES_HOST,
  //Connect to PORT that is dedicated to your postgres db. Default is 5432.
  port: 5432,
  //created by running 'npm run createdb'
  database: 'dcr',
  //your password here
  password: process.env.POSTGRES_PASSWORD,
  //max connections of clients
  max: 10,
  idleTimeoutMillis: 3000,
  connectionTimeoutMillis: 10000,
})

// the pool will emit an error on behalf of any idle clients
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err)
  process.exit(-1)
})

pool.connect().then(()=>{
  console.log('connected to Postgres')
}).catch(err=>console.log(err))

const pgQuery = async (q, params, callback) => {
  const start = Date.now();
  try {
    const result = await pool.query(q, params)
    const duration = await Date.now() - start;
    await console.log('executed query', { q, duration: duration +`ms`, params})
    return await callback(result)
  }
  catch(err){ console.log('ERROR QUERYING: ', err) }
};

const getUser = async(username) => {
  const query = "SELECT * FROM dcr.users WHERE username = ($1)"
  return await pgQuery(query,[username],async(data)=>{
    console.log('USER:', data.rows)
    return await data
  })
}

const retrieveAccountData = (user_id, accountId, callback) => {
  const findExistingAccount = "SELECT account_id, user_id, accountId FROM dcr.accounts WHERE user_id = ($1) AND accountId = ($2)"
  pgQuery(findExistingAccount,[user_id, accountId], (res)=> {
    // if (err) console.log(err);
    if (res) callback(res.rows);
  })
}

const createNewAccount = async (user_id, accountId, accountName)=> {
  const query = 'INSERT INTO dcr.accounts(user_id, accountId, accountName) VALUES($1, $2, $3) RETURNING *'
  const values = [user_id, accountId, accountName]
  //Check if entry already exists
  await retrieveAccountData(user_id, accountId, async (res)=> {
    if (res.length > 0) {
      console.error('ERROR: This account already exists')
    }
    if (res.length === 0) {
      await pgQuery(query,values, async (res) => {
        console.log(res.row)
      })
    }
  })
}

const retrieveItemData = (user_id, itemId, callback) => {
  const findExistingItem = "SELECT user_id, itemId, access_token FROM dcr.items WHERE user_id = ($1) AND itemId = ($2)"
  pgQuery(findExistingItem,[user_id, itemId], (res)=> {
    // if (err) console.log(err);
    if (res) callback(res.rows);
  })
}

const createNewItem = async (user_id, access_token, itemId)=> {
  const query = 'INSERT INTO dcr.items(user_id, access_token, itemId) VALUES($1, $2, $3) RETURNING *'
  const values = [user_id, access_token, itemId]
  //Check if entry already exists
  await retrieveAccountData(user_id, itemId, async (res)=> {
    if (res.length > 0) {
      console.error('ERROR: This item already exists')
    }
    if (res.length === 0) {
      await pgQuery(query,values, async (res) => {
        console.log(res.row)
      })
    }
  })
}

module.exports = {
  pool,
  pgQuery,
  getUser,
  retrieveAccountData,
  createNewAccount,
  retrieveItemData,
  createNewItem
}
