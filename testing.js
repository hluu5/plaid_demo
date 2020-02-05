const { getUser, retrieveAccountData, createNewAccount, pgQuery, retrieveAssetReportData } = require('./Postgres/index.js')
const axios = require("axios");
const bodyParser = require('body-parser');

//### EXAMPLE OF APP FLOW:

/*
1. Buyers log in DCR portal and link their accounts using using Plaid's Link Item system.
If this is the first time buyers do this, then information from this Item sets and accounts will be 
saved to our database. This is done using the Plaid Link's button and send post request to 
our '/get_access_token' api.
- Go to localhost:8000
- Click on 'link account' button and put in the following test credential:
    username: user_good
    password: pass_good
*/


/*2. After the buyer linked the items account. We will extract income and asset reports from Items sets. 
Note I couldn't get a working Asset Report because we need to provide a webhook for async creation of 
asset report. This is can only be done if our server was live with exposed ip address. 
This is done using Post request to '/income' and '/assetReport' API's
*/
/*
axios.post('/income',  {
	    user_id: 1, 
     itemId: 'bkdzDJpRv1talKX535K5twrG1qyyzWUVxoW5y'
}).then(data => console.log(data.data))
.catch(err => console.log(err))
*/

// // /*
// axios.post('http://localhost:8000/assetReport')
// .then(data => console.log(data.data))
// .catch(err=>console.log(err))
// // */

// 3. After we have income and assets reports, we will extract data from these reports. If this passed certain criterias that were predetermined by DCR and lenders (in this case FinPac), we will send another request to FinPac to determine the max term buyer could apply for and its rate. This could be done with multiple lenders for buyers to compare. Once data is sent back, we will display them on front-end to let buyer decide.
//     This is done using POST request to '/checkApplication' API.
/*
axios.post('http://localhost:8000/checkApplication', {
    "referenceId": "",
    "dealer": {
        "username" : "gecap",
        "password" : "Johncarp751",
        "systemId" : "010841.0010",
        "contactName" : "DCR",
        "contactPhone" : "2532223333",
        "contactEmail" : "person1@finpac.com",
        "subBrokerName" : '',
        "splitTransaction" : "NO",
        "attachments" : "NO",
        "comments" : ''
    },

    "customer": {
        "customerName" : "Goofy",
        "dba" : "Goofy's Barn Stormer",
        "fedId" : "2342-24-3429",
        "address1" : "1234 Somewhere Street",
        "address2" : "",
        "city" : "Nowhere",
        "state" : "CA",
        "zip" : "12345",
        "billingAddress1" : "1234 Somewhere Street",
        "billingAddress2" : "",
        "billingCity" : "Nowhere",
        "billingState" : "CA",
        "billingZip" : "12345",
        "contactName" : "Goofy",
        "contactPhone" : "8883332222",
        "contactFax" : "",
        "contactEmail" : "",
        "typeOfBusiness" : "SOLE_PROPRIETORSHIP",
        "homeBasedBusiness" : "YES",
        "businessDescription" : "",
        "businessWebsite" : "",
        "tibYears" : 10,
        "verificationMethod" : "OTHER",
        "verificationMethodComment" : "",
        "sic" : "3843"
},

    "guarantors": [
        {
            "firstName" : "Daisy",
            "lastName" : "Duck",
            "fedId" : "444332222",
            "title" : "",
            "percentOwnership": 100,
            "address1" : "100 Musicians Way",
            "address2" : "",
            "city" : "Beverly Hills",
            "state" : "CA",
            "zip" : "90210",
            "homePhone" : "2123331256",
            "cellPhone" : "",
            "contactEmail" : ""
        }
    ],

    "ownership": {
        "comments": "if sum of guarantor percent ownership less than 100%, pleaseexplain"
    },

    "terms": {
        "requestedAmount": 15000,
        "residual": "EFA",
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
        console.log(response.data);
    })
    .catch(function (error) {
        console.log(error);
    });

*/

//4. Buyer chose the term and rate that he/she wants, clicks on it, and we make another request to the 
// lender to submit our final application. At this point, I assume the buyer already satisfied most of 
// the criteria and is pre-approved.
// This is done using POST request to '/submitApplication' API.
/*
axios.post( "http://localhost:8000/submitApplication", {
    "dealer": {
        "username" : "gecap",
        "password" : "Johncarp751",
        "systemId" : "010841.0010",
       },
        "application": {
            "submissionId" : 'st-3898a',
            "contractTerm" : "48"
        }
})
    .then(function (response) {
        console.log(response.data);
    })
    .catch(function (error) {
        console.log(error);
    });

*/




