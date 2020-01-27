## DCR CODING CHALLENGE
### Disclaimer: 
This is just a very short demo to see what Plaid and FinPac's API integration could be. It lacks several aspects in real production such as: 
    1. unit/integration testing, CI/CD. 
    2. authentication for every steps (between the user and DCR, not between DCR's sever and Plaid/, this already been done using token). This could be done using sessions or OAuth or token.
    3. Encryption and security: https
    4. Front-end set up where users could put in their info and chose the right options for them. 

### Instruction:
Please run the following command lines in terminal before proceeding:
```
#create a Postgres database, table if not exist: 
npm run createdb

# the following were created:
- DCR Postgres schema 
- users table, indexed by username,
- item table, indexed by itemId
- account table, indexed by account_id
- a fake user with hashed password using bcrypt

#run API server:
npm run start

=> please go to localhost:8000 to check it out
```
### App Flow:
1. Buyers log in DCR portal and link their accounts using using Plaid's Link Item system. If this is the first time buyers do this, then information from this Item sets and accounts will be saved to our database. This is done using the Plaid Link's button and send post request to our '/get_access_token' api.

2. After the buyer linked the items account. We will extract income and asset reports from Items sets. Note I couldn't get a working Asset Report because we need to provide a webhook for async creation of asset report. This is can only be done if our server was live with exposed ip address. 
    This is done using Post request to '/income' and '/assetReport' API's

3. After we have income and assets reports, we will extract data from these reports. If this passed certain criterias that were predetermined by DCR and lenders (in this case FinPac), we will send another request to FinPac to determine the max term buyer could apply for and its rate. This could be done with multiple lenders for buyers to compare. Once data is sent back, we will display them on front-end to let buyer decide.
    This is done using POST request to '/checkApplication' API.

4. Buyer chose the term and rate that he/she wants, clicks on it, and we make another request to the lender to submit our final application. At this point, I assume the buyer already satisfied most of the criteria and is pre-approved.
    This is done using POST request to '/submitApplication' API.

#### For consideration(?):
5. Buyer could monitor payment and make payment from our portal. This could only be done in collaboration with lenders. They have to provide us a tool such as APIs to create lendee account, check their lendee accounts balance, check transactions etc. Another option is that buyer will link up their lendee account using Plaid and DCR uses Plaid to monitor and authenticate users' identity, then uses something like Stripe to handle payment. 

### Questions/Comments:
1. I like how Plaid has different method to verify identity and link account to different intitutions. Most likely, we want to do instant verification by username and password at that intitution since DCR wants the process to be fast and simple. If the buyer has to go back on a different day to check their qualification, he most likely won't come back.

2. Compare and Contrast Plaid vs Finicity: 
- Plaid has a prebuilt widget that is easy to use for end user to Link their account. If we don't want to use this, we have to set up our Multi Factor Authentication ourselves. Finicity doesn't have a prebuilt widget like Plaid's.
- Both Plaid and Finicity supports Multi Factors Authentication. This is great for security. 
- Both has some async handler for their services, they're just different forms of webhooks. 
- Both has detailed Liabilites Report.
- Both Plaid and Finicity has some form of Income and Asset report aggregration. Finicity goes an extra step with their own Credit Decisioning service based on the previous 2 reports. DCR may or may not want to depend on this service. The criteria may or may not fit DCR and its partner's criteria. DCR also wants to to consider cost of using this service and compared it to DCR's revenue model to see if it is viable option.
- Overal, Plaid is a little easier to develop with. But both provides similar products.

3. What's the criteria to determine should an account be approved?
- Using Plaid, we could pull user's account and transaction info. If that passes certain criteria set by lenders, it could be pre-approved and sent to lender.
- A combination of income, assets and calculation of income as a percentage of monthly payment (including interest) could be computed to determine if an application should be approved. 

4. According to Financial Pacific Leasing doc, approved application meant that it passed some criteria and the system approved it to be forwarded to the Credit Officer. It doesn't mean it is finalized. So I wonder since DCR's main strength is simple and fast process (within mins), if we have to wait for Credit Officer to approve it, then it wouldn't make sense. My guess is that when the application is in 'Approved' status and sent to the Credit Officer, it's already pre-approved. 

5. What happens after the approved application is sent to lender? 

6. Will payments be monitored and handled by DCR or lenders? Depends on the answer, we will use different service from Plaid. But my guess is that DCR will hand it off to lenders and the process ends there. But that would be inconvenient for buyers since they have to be redirected to another institute for payment. If we could handle it in one place, that would be great for buyers.

7. I'm interested in how DCR integrate inventory management to create live financing options. Does it mean based on the buyer's or dealer's inventory? How does it work? Is it something like if dealer's inventory is high and a predefined time frame is about to reached, DCR will provide a lower financing options for buyers to rid of inventory faster? Or is it like inventory financing for dealer, where they could finance through the use of their own inventory? 

