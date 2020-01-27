const { getUser, retrieveAccountData, createNewAccount, pgQuery } = require('./Postgres/index.js')
const axios = require("axios");
const bodyParser = require('body-parser');
// app.use(bodyParser.urlencoded({ extended: false }))
// app.use(bodyParser.json())
//user_id: '2', 
//     accessToken: 'sda', 
//     itemId: 'itemId', 
//     institutionId: 'institutionId', 
//     institutionName: 'dsadas'
// retrieveAccountData(2, 'institutionId', (data) => console.log('THIS IS DATA AAAAAAAAAAA' , data))
// const q = "SELECT account_id, user_id, institutionId FROM dcr.accounts WHERE user_id = ($1) AND institutionId = ($2)"
//   const user_id = 1;
//   const institutionId= '213123123' ;
// pgQuery(q, [user_id, institutionId], (data)=> console.log(data.rows))



//   createNewAccount(1, 'sdadsad', '232131', '23123120', '2312312')
// axios.post('http://localhost:8000/checkApplication', {
//     "referenceId": "",
//     "dealer": {
//         "username" : "gecap",
//         "password" : "Johncarp751",
//         "systemId" : "010841.0010",
//         "contactName" : "DCR",
//         "contactPhone" : "2532223333",
//         "contactEmail" : "person1@finpac.com",
//         "subBrokerName" : '',
//         "splitTransaction" : "NO",
//         "attachments" : "NO",
//         "comments" : ''
//     },

//     "customer": {
//         "customerName" : "Goofy",
//         "dba" : "Goofy's Barn Stormer",
//         "fedId" : "2342-24-3429",
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
//         "verificationMethod" : "OTHER",
//         "verificationMethodComment" : "",
//         "sic" : "3843"
// },

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

//     "ownership": {
//         "comments": "if sum of guarantor percent ownership less than 100%, pleaseexplain"
//     },

//     "terms": {
//         "requestedAmount": 15000,
//         "residual": "EFA",
//         "programCode": ""
//     },

//     "equipmentList": [
//         {
//             "condition": "REFURBISHED",
//             "typeOfTransaction": "VENDOR_SALE",
//             "equipCode": "009.012",
//             "equipDescription": "Some equipment",
//             "equipAddress": "",
//             "equipCity": "",
//             "equipState": "CA",
//             "equipZip": "90210",
//             "vendorName": "",
//             "vendorAddress": "",
//             "vendorCity": "",
//             "vendorState": "CA",
//             "vendorZip": "90210"
//         }
//     ]
// })
//     .then(function (response) {
//         console.log(response.data);
//     })
//     .catch(function (error) {
//         console.log(error);
//     });

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
//         "requestedAmount" : 15000,
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

// axios.post('http://localhost:8000/assetReport').then(data=> console.log(data.data.auth.accounts))
// .catch(err=>console.log(err))