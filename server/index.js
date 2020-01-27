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
const { createNewAccount, createNewItem, retrieveItemData } = require('../Postgres/index.js')
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
app.post('/get_access_token', checkPasswordMiddleware);

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

		//save items into db after linking item:
		await createNewItem(res.locals.user_id, ACCESS_TOKEN, ITEM_ID)
		//save accounts into db after linking account for the first time.
		await req.body.accounts.map(async (e) => {
			await createNewAccount(res.locals.user_id, e.id, e.name)
		})
	});
});



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

app.post('/income', (req, res, next) => {
	retrieveItemData(req.body.user_id, req.body.itemId, (data) => {
		console.log(data[0]);
		client.getIncome(data[0].access_token, (err, result) => {
			if (err) console.log(err)
			var income = result.income;
			res.json(income)
		});
	})
})

app.post('/test', (req, res) => {
	console.log(req)
})

app.post('/assetReport', (req, res, next) => {
	const daysRequested = 10;

	// ACCESS_TOKENS is an array of Item access tokens.
	// Note that the assets product must be enabled for all Items.
	// All fields on the options object are optional.
	const ACCESS_TOKENS = ['access-sandbox-1ebd7b9a-b842-4fe4-add6-c9c0b800a5d6', 'access-sandbox-5a14d090-9aea-41ce-9025-f2aa218a8e0f'];
	client.createAssetReport(ACCESS_TOKENS, daysRequested,
		(error, createResponse) => {
			if (error != null) {
				console.log(error)
			}

			const assetReportId = createResponse.asset_report_id;
			const assetReportToken = createResponse.asset_report_token;
			//console.log(assetReportToken)
			client.getAssetReport(assetReportToken, false, (error, getResponse) => {
				if (error != null) {
					if (error.status_code === 400 &&
						error.error_code === 'PRODUCT_NOT_READY') {
						// Asset report is not ready yet. Try again later.
						console.log(error)
					} else {
						// Handle error.
						console.log(error)
					}
				}

				// const report = getResponse.report;
				console.log(getResponse)
			});
		});
})

app.post('/checkApplication', (req, res) => {
	// Asume we checked the buyer's income, assets, and accounts and they passed certain threshold that was
	// set up by both DCR and the lenders. We will send a request to FinPac to check what term and amount
	// the buyer can be qualified for.

	axios.post('https://dataimport.finpac.com/st/prequal', {
		"referenceId": req.body.referenceId,
		"dealer": {
			"username": req.body.dealer.username,
			"password": req.body.dealer.password,
			"systemId": req.body.dealer.systemId,
			"contactName": req.body.dealer.contactName,
			"contactPhone": req.body.dealer.contactPhone,
			"contactEmail": [req.body.dealer.contactEmail],
			"subBrokerName": '',
			"splitTransaction": "NO",
			"attachments": "NO",
			"comments": ''
		},

		"customer": {
			"customerName": req.body.customer.customerName,
			"dba": req.body.customer.dba,
			"fedId": req.body.customer.fedId,
			"address1": req.body.customer.address1,
			"address2": "",
			"city": req.body.customer.city,
			"state":req.body.customer.state,
			"zip": req.body.customer.zip,
			"billingAddress1": req.body.customer.billingAddress1,
			"billingAddress2": "",
			"billingCity": req.body.customer.billingCity,
			"billingState": req.body.customer.billingState,
			"billingZip": req.body.customer.billingZip,
			"contactName": req.body.customer.contactName,
			"contactPhone": req.body.customer.contactPhone,
			"contactFax": req.body.customer.contactFax,
			"contactEmail": req.body.customer.contactEmail,
			"typeOfBusiness": req.body.customer.typeOfBusiness,
			"homeBasedBusiness": "YES",
			"businessDescription": "",
			"businessWebsite": "",
			"tibYears": req.body.customer.tibYears,
			"verificationMethod": req.body.customer.verificationMethod,
			"verificationMethodComment": "",
			"sic": req.body.customer.sic
		},

		"guarantors": [
			{
				"firstName": req.body.guarantors[0].firstName,
				"lastName": req.body.guarantors[0].lastName,
				"fedId": req.body.guarantors[0].fedId,
				"title": "",
				"percentOwnership": 100,
				"address1": "100 Musicians Way",
				"address2": "",
				"city": "Beverly Hills",
				"state": "CA",
				"zip": "90210",
				"homePhone": "2123331256",
				"cellPhone": "",
				"contactEmail": ""
			}
		],

		"ownership": {
			"comments": "if sum of guarantor percent ownership less than 100%, pleaseexplain"
		},

		"terms": {
			"requestedAmount": req.body.terms.requestedAmount,
			"residual": req.body.terms.residual,
			"programCode": ""
		},

		"equipmentList": [
			{
				"condition": "REFURBISHED",
				"typeOfTransaction": "VENDOR_SALE",
				"equipCode": "009.012",
				"equipDescription": "Some equipment",
				"equipAddress": "",
				"equipCity": "",
				"equipState": "CA",
				"equipZip": "90210",
				"vendorName": "",
				"vendorAddress": "",
				"vendorCity": "",
				"vendorState": "CA",
				"vendorZip": "90210"
			}
		]
	})
	.then(function (response) {
		res.json(response.data);
	})
	.catch(function (error) {
		console.log(error);
	});
})

app.post('/submitApplication', (req,res) => {
	// Assume the buyer chose the term he wanted and DCR proceed to submit the final application to lender (FinPac).
	axios.post("https://dataimport.finpac.com/st/push-prequal", {
		"dealer": {
			"username": req.body.dealer.username,
			"password": req.body.dealer.password,
			"systemId": req.body.dealer.systemId,
		},
		"application": {
			"submissionId":  req.body.application.submissionId,
			"contractTerm":  req.body.application.contractTerm
		}
	})
	.then(function (response) {
		res.json(response.data);
	})
	.catch(function (error) {
		console.log(error);
	});
})

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));


