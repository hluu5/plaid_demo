const express = require('express');
const app = express();
const axios = require('axios')
const bodyParser = require('body-parser');
const plaid = require('plaid');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

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

const fake_username = 'huy';
const fake_password = 'password';



app.post('/get_access_token', (req, res, next) => {
	console.log('===================>', req.body.accounts)
	PUBLIC_TOKEN = req.body.public_token;
	client.exchangePublicToken(PUBLIC_TOKEN, (error, tokenResponse) => {
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
	});
});

app.get('/auth', function (req, res, next) {
	client.getAuth(ACCESS_TOKEN, (error, authResponse) => {
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