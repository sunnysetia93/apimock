### To Run:

1. git clone <url>
2. npm install (make sure you are inside the apimock folder)
3. change the configuration as per your mongodb and redis
    a. opne the config folder
    b. change the respective urls in dev.js
4. npm start (again fomr apimock folder)

### APIs:
```
1. GET : localhost:8001/loop
2. POST : localhost:8001/csv2json | upload the csv file from postman
```

#### question 5:
```
3. GET: localhost:8001/dynamicdelay | uses redis to store data
4. GET : localhost:8001/dynamicdelay/volatile | doesn't persist data | only valid till instance localhost
```

#### question 6:
```
5. GET: localhost:8001/wallet
6. POST: localhost:8001/wallet 
    body =>
        user_id:2000
        number_of_deposits:1
        wallet_balance:12311
        has_deposited:true
7. PUT: localhost:8001/wallet  | same body as POST
8. DELETE: localhost:8001/wallet | body=> user_id:2000

9. POST: localhost:8001/wallet/query
    body:{
        "user_id":1,
        "query": "wallet_balance > 15 AND wallet_balance < 300 AND has_deposited"
    }
    response: {
        "error": false,
        "statusCode": 200,
        "message": "request successful",
        "data": true
    }
```
10. <b>in question 6, api is scalable in terms of adding more parameters and operators. (Code has been tested to operate on operators   like (+,-,\,*,===,>=,(,)) etc</b>
11. Question 6 API can perform better if redis caching is also incorporated.
