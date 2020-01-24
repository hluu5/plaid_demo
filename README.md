## DCR CODING CHALLENGE

### Instruction:
Please run the follow command lines in terminal before proceeding:
```
#create a Postgres database, table if not exist: 
npm run createdb

# the following were created:
- DCR Postgres schema 
- users table, indexed by username
- account table, indexed by account_id
- a fake user with hashed password

#run API server:
npm run start

=> please go to localhost:8000 to check it out
```

### Questions:
1. What's the criteria to determine should an account be approved?
- Using Plaid, we could pull user's account and transaction info. If that passes certain criteria set by lenders, it could be pre-approved and sent to lender.
- A combination of income, assets and calculation of monthly payment (including interest) could be computed to determine if an application should be approved. 

2. According to Financial Pacific Leasing doc, approved application meant that it passed some criteria and the system approved it to be forwarded to the Credit Officer. It doesn't mean it is finalized. So I wonder since DCR's main strength is simple and fast process, if we have to wait for Credit Officer to approve it, then it wouldn't make sense. My guess is that when the application is in 'Approved' status and sent to the Credit Officer, it's already pre-approved. 

3. What happens after the approved application is sent to lender? 

4. Will payments be monitored and handled by DCR or lenders? Depends on the answer, we will use different service from Plaid. But my guess is that DCR will hand it off to lenders and the process ends there. But that would be inconvenient for buyers since they have to be redirected to another institute for payment. If we could handle it in one place, that would be great for buyers.

5. I'm interested in how DCR integrate inventory management to create live financing options. Does it mean based on the buyer's or dealer's inventory? How does it work? Is it something like if dealer's inventory is high and a predefined time frame is about to reached, DCR will provide a lower financing options? 

