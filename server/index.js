const express = require('express');
const app = express();
const axios = require('axios')
const bodyParser = require('body-parser');
const plaid = require('plaid');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const { checkPasswordMiddleware } = require('./middleware.js');
const { createNewAccount } = require('../Postgres/index.js')
dotenv.config();

const PORT = 8000;
//Need to store access token in data store (in production)
let ACCESS_TOKEN = null;
let PUBLIC_TOKEN = null;

const client = new plaid.Client(
	process.env.PLAID_CLIENT_ID,
	process.env.PLAID_SECRET_SANDBOX,
	process.env.PLAID_PUBLIC_KEY,
	plaid.environments.sandbox
);

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname + '/index.html'));
})

// const fake_username = 'huy';
// const fake_password = 'password';

//Check Password and Username before generate and exchange tokens)
app.post('/get_access_token', checkPasswordMiddleware) ;

app.post('/get_access_token', async (req, res, next) => {
	// console.log('===================>', req.body.accounts)
	PUBLIC_TOKEN = req.body.public_token;
	await client.exchangePublicToken(PUBLIC_TOKEN, async (error, tokenResponse) => {
		if (error != null) {
			console.log('Could not exchange public_token!' + '\n' + error);
			return res.json({ error: error.message });
		}
		ACCESS_TOKEN = tokenResponse.access_token;
		ITEM_ID = tokenResponse.item_id;
		console.log('Access Token: ' + ACCESS_TOKEN);
		console.log('Item ID: ' + ITEM_ID);
		res.json({
			'error': false,
			access_token: ACCESS_TOKEN,
			item_id: ITEM_ID,
		});

		await req.body.accounts.map(async (e) => {
			// console.log(e)
			await createNewAccount(res.locals.user_id, ACCESS_TOKEN, ITEM_ID, e.id, e.name)
		})
	});
	// console.log(res.locals.user_id)
	
});

// app.post('/createAccount',  async (req, res, next) => {
// 	await createNewAccount(req.body.user_id, req.body.accessToken, req.body.itemId, req.body.institutionId, req.body.institutionName)
// })

app.post('/auth', function (req, res, next) {
	console.log(req.body.access_token)
	client.getAuth(req.body.access_token, (error, authResponse) => {
		if (error != null) {
			console.log(error);
			return res.json({
				error: error,
			});
		}
		console.log(authResponse);
		res.json({ error: null, auth: authResponse });
	});
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

// axios.post('https://dataimport.finpac.com/st/underwrite', {
//     "referenceId" : '',
//     "dealer": {
//         "username" : "gecap",
//         "password" : "Johncarp751",
//         "systemId" : "010841.0010",
//         "contactName" : "DCR",
//         "contactPhone" : "2532223333",
//         "contactEmail" : ["person1@finpac.com", "person2@finpac.com"],
//         "subBrokerName" : 'null',
//         "splitTransaction" : "NO",
//         "attachments" : "NO",
//         "comments" : ''
//     },

//     "customer": {
//         "customerName" : "Goofy",
//         "dba" : "Goofy's Barn Stormer",
//         "fedId" : "",
//         "address1" : "1234 Somewhere Street",
//         "address2" : "",
//         "city" : "Nowhere",
//         "state" : "CA",
//         "zip" : "12345",
//         "billingAddress1" : "1234 Somewhere Street",
//         "billingAddress2" : "",
//         "billingCity" : "Nowhere",
//         "billingState" : "CA",
//         "billingZip" : "12345",
//         "contactName" : "Goofy",
//         "contactPhone" : "8883332222",
//         "contactFax" : "",
//         "contactEmail" : "",
//         "typeOfBusiness" : "SOLE_PROPRIETORSHIP",
//         "homeBasedBusiness" : "YES",
//         "businessDescription" : "",
//         "businessWebsite" : "",
//         "tibYears" : 10,
//         "verificationMethod" : "SECRETARY_OF_STATE",
//         "verificationMethodComment" : "",
//         "sic" : "4212"
//     },
//     "guarantors": [
//         {
//             "firstName" : "Daisy",
//             "lastName" : "Duck",
//             "fedId" : "444332222",
//             "title" : "",
//             "percentOwnership": 100,
//             "address1" : "100 Musicians Way",
//             "address2" : "",
//             "city" : "Beverly Hills",
//             "state" : "CA",
//             "zip" : "90210",
//             "homePhone" : "2123331256",
//             "cellPhone" : "",
//             "contactEmail" : ""
//         }
//     ],

//     "ownership" : {
//         "comments": "if sum of guarantor percent ownership less than 100%, please explain"
//     },

//     "terms": {
//         "reqedAmount" : 15000,
//         "contractTerm" : "60",
//         "residual" : "EFA",
//         "programCode" : "code"
//     },

//     "equipmentList":[
//         {
//             "condition" : "REFURBISHED",
//             "typeOfTransaction" : "VENDOR_SALE",
//             "equipCode" : "009.012",
//             "equipDescription" : "",
//             "equipAddress" : "",
//             "equipCity" : "",
//             "equipState" : "",
//             "equipZip" : "",
//             "vendorName" : "",
//             "vendorAddress" : "",
//             "vendorCity" : "",
//             "vendorState" : "",
//             "vendorZip" : ""
//         }
//     ]
// })
// .then(function (response) {
//     console.log(response.data);
// })
// .catch(function (error) {
//     console.log(error);
// });

// axios.post('https://dataimport.finpac.com/st/prequal', 
// {
//  "referenceId" : "(optional maxLength: 30) can be used to send your system Id with the application",

// "dealer": {
//  "username" : "(required) username",
//  "password" : "(required) password",
//  "systemId" : "(required) 011111.0010",
//  "contactName" : "(required, maxLength: 30) IS Group",
//  "contactPhone" : "(required, maxLength: 14) 2532223333",
//  "contactEmail" : ["(required, maxLength: 50)person1@finpac.com",
// "person2@finpac.com"],
//  "subBrokerName" : "(maxLength: 30)name of sub broker",
//  "splitTransaction" : "either YES or NO",
//  "attachments" : "either YES or NO",
//  "comments" : "(maxLength: 5000)nice to have if available"
// },
// "customer": {
//  "customerName" : "(required, maxLength: 50) Goofy",
//  "dba" : "(required, maxLength: 30, if typeOfBusiness is sole prop) Goofy's BarnStormer",
//  "fedId" : "(maxLength: 20)",
//  "address1" : "(required, maxLength: 50) 1234 Somewhere Street",
//  "address2" : "(maxLength: 50)",
//  "city" : "(required, maxLength: 30) Nowhere",
//  "state" : "(required) CA",
//  "zip" : "(required, maxLength: 10) 12345",
//  "billingAddress1" : "(maxLength: 50)1234 Somewhere Street",
//  "billingAddress2" : "(maxLength: 50)",
//  "billingCity" : "(maxLength: 30)Nowhere",
//  "billingState" : "CA",
//  "billingZip" : "(maxLength: 10)12345",
//  "contactName" : "(maxLength: 30)Goofy",
//  "contactPhone" : "(required, maxLength: 15) 8883332222",
//  "contactFax" : "(maxLength: 30)",
//  "contactEmail" : "(maxLength: 50)",
//  "typeOfBusiness" : "(required) either SOLE_PROPRIETORSHIP, PARTNERSHIP,
//  "homeBasedBusiness" : "either YES, NO",
//  "businessDescription" : "(maxLength: 5000)",
//  "businessWebsite" : "(maxLength: 50)",
//  "tibYears" : "(required, maximum: 99) 10",
//  "verificationMethod" : "either SECRETARY_OF_STATE, BANK_RATING, D_AND_B,

//  "verificationMethodComment : "(maxLength: 30)if OTHER, explain",
//  "sic" : "(required) i.e. 4212"
// },

// "guarantors": [
// {
//  "firstName" : "(required, maxLength: 25) Daisy",
//  "lastName" : "(required, maxLength: 25) Duck",
//  "fedId" : "(required, maxLength: 20) 444332222",
//  "title" : "(maxLength: 25)",
//  "percentOwnership": "(required, maximum 100) 100",
//  "address1" : "(required, maxLength: 50) 100 Musicians Way",
//  "address2" : "(maxLength: 50)",
//  "city" : "(required, maxLength: 25) Beverly Hills",
//  "state" : "(required) CA",
//  "zip" : "(required, maxLength: 10) 90210",
//  "homePhone" : "(maxLength: 15)2123331256",
//  "cellPhone" : "(maxLength: 15)",
//  "contactEmail" : "(maxLength: 50)"
// }
// ],
// "ownership" : {
//  "comments": "(maxLength: 5000)if sum of guarantor percent ownership less than 100%, pleaseexplain"
// },
//  "terms": {
//  "requestedAmount" : "(required) 15000",
//  "residual" : "either EFA, FMV, 10_PUT, 1.00, 101.00FL, FMV_ONLY_STATE",
//  "programCode" : "(maxLength: 20)code for one of our pricing programs, if app qualifies"
//  },
// "equipmentList":[
//  {
//  "condition" : "(required) either NEW, USED, REFURBISHED",
//  "typeOfTransaction" : "(required) either VENDOR_SALE, PRIVATE_PARTY_SALE,
//  "equipCode" : "(required) use code from list - i.e. 009.012",
//  "equipDescription" : "(maxLength: 5000)",
//  "equipAddress" : "(maxLength: 50)",
//  "equipCity" : "(maxLength: 30)",
//  "equipState" : "CA",
//  "equipZip" : "(maxLength: 10) 90210",
//  "vendorName" : "(maxLength: 40)",
//  "vendorAddress" : "(maxLength: 50)",
//  "vendorCity" : "(maxLength: 30)",
//  "vendorState" : "CA",
//  "vendorZip" : "(maxLength: 10) 90210"
//  }
// ]
// })
// .then(function (response) {
// 	    console.log(response.data);
// 	})
// 	.catch(function (error) {
// 	    console.log(error);
// 	});
// ---------------------------------------------------------------------------
// Prequal Reponse:
// NOTE: not all fields are returned with every request. In addition, either rate or
// yield is returned based on setup. not both.
// {
// submissionId : "displays if status not error, application id -i.e. pk-1a"
// decision : "APPROVED|DECLINED|PASS_ZERO|PASS_VERMONT|PASS_CUTOFF"
// maxTerm : "maximum term allowed for given sic, in months i.e. 24|36|48|60"
// rate : "if approved, rate based on supplied info"
// yield : "if approved, yield based on supplied info"
// description : "short description for decision reason"
// status : "ERROR|REJECTED|OK"
// message : "short description for error"
// }
// ---------------------------------------------------------------------------
// Push-prequal Request, part 2 of 2:
// {
//  "dealer": {
//  "username" : "(required) username",
//  "password" : "(required) password",
//  "systemId" : "(required) 011111.0010"
// },
//  "application": {
//  "submissionId" : "ac-123",
//  "contractTerm" : "(required) either 24, 36, 48, 60"
//  }
// }
// ---------------------------------------------------------------------------
// July 2019
// Copyright Financial Pacific Leasing Inc. pg. 8 July 2019
// Push-prequal Response:
// NOTE: not all fields are returned with every request.
// {
// submissionId : "displays if status not error, application id -i.e. pk-1a"
// status : "ERROR|OK|VALIDATION_FAILED|AUTH_FAILED"
// message : "short description for error"
// }
// ------------------------------------------------------------------------
// Example of the most basic Response:
// The response payload returned from our push-prequal endpoint looks like the following.
// {
// "submissionId": "aa-397a",
// "status": "OK",
// "decision": "APPROVED"
// }
