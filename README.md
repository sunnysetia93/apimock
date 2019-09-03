#test-setup

This repo contains a broken server setup you are expected to fix. The server then needs to give the correct responses to the below questions. 

To run the server, invoke
```
$npm install
$npm start
```

Steps to perform:

1. Fork this repo

2. Debug the errors which are causing the server to crash at initialization.

3. Create an api endpoint in `src/api/prodapis/handlers.js` called `/csv2json` which accepts a csv file as an input and then sends a json object as response.
	For eg:
		
        Payload:
		| Name    | Age  | Sex  |
		| :---:   | :-:  | :-: |
		| Harish  | 10   | M 	|
		| Suresh  | 20   | M 	|
		| Chanda  | 30   | F 	|
	
    	Response: 
        [
        	{	
        		"name"	: "Harish",
        		"age"	: "10",
        		"sex"	: "M"
        
        	},
        	{	
        		"name"	: "Suresh",
        		"age"	: "20",
        		"sex"	: "M"
        
        	},
        	{	
        		"name"	: "Chanda",
        		"age"	: "30",
        		"sex"	: "F"
        
        	}
        ]

4. Api endpoint `/loop` processes an array and is supposed to reply the output of function `adder`, when the array is serially processed through it. Function `adder` might seem to be performing an overcomplicated addition, but assume it to be a proxy for any asynchronous operation.

We are currently passing an array `[1,2,3,4,5,6,7,8,9,10]` to the function adder. Calling this api will currently give you:

`Response = 0` 
and on the console : 
```
Trying to add 1
Trying to add 2
Trying to add 3
Trying to add 4
Trying to add 5
Trying to add 6
Trying to add 7
Trying to add 8
Trying to add 9
Trying to add 10
Current sum is 1
Current sum is 2
Current sum is 3
Current sum is 4
Current sum is 5
Current sum is 6
Current sum is 7
Current sum is 8
Current sum is 9
Current sum is 10
```

This is obviously incorrect, and the correct method should be:
`Response = 55`
with console printing:
```
Trying to add 1
Current sum is 1
Trying to add 2
Current sum is 3
Trying to add 3
Current sum is 6
Trying to add 4
Current sum is 10
Trying to add 5
Current sum is 15
Trying to add 6
Current sum is 21
Trying to add 7
Current sum is 28
Trying to add 8
Current sum is 36
Trying to add 9
Current sum is 45
Trying to add 10
Current sum is 55
```

Modify ONLY and only the handler `loop` to get the expected response. Do not make any changes to `function adder`. I am interested in receving both the correct response as well as the correct logging on console (showing perfectly that the operation is happening serially, and not parallely). The actual step of addition needs to be performed using `function adder`, and not bypassing it by any means.

5. Create an api GET /dynamicdelay , the response of the api should be 
   2 for the first request from an ip, 
   4 for the second request,
   8 for the third request and so on.
   
   the api should also respond after

   1 second  for the first request,
   3 seconds for the second request,
   5 seconds for the third request and so on.
   
   They whole series should reset after 5 minutes for each ip
   
   Also a brief explanation of how the api will behave based on your implementation 
   
   1. when its used by thousands of clients.
   2. when a single client calls the api concurrently.
   
6. You have three Parameters: 
    wallet_balance,
    number_of_deposits
    depositted_users

You have an excel sheet attached with the question where the values of the params are given with user ids. 

NOTE : The excel has limited records. While completing the tasks, consider it is being used by millions of users. Try   making it as scalable, dynamic, optimized as possible. 

- Task 1:  
Make a system where we can easily store data using the columns mentioned in the
Excel. Make Sure (GET, POST, PUT, DELETE) operations are fast. The given data set has data for 20 users. Consider these operations are happening for  ~ 1 million users.
Give us particular api points which can be used to (GET, POST, PUT, DELETE) data from the system.
      

- Task 2:
Design the system in such a way that using the parameters mentioned below  -> (wallet_balance,number_of_deposits, depositted_users) & with some specific operators ( “AND”, “OR”, “>”, “<”, “=” ).
I can make any number /type dynamic queries with provided parameters and operators

 - CONDITION CAN BE LIKE - 
   - Deposited users and whose wallet balance is greater than 30
   - Users who have not deposited but have wallet_balance > certain amount.
   - ETC….

Note: Request can not contain anything other than the operators and parameters. You can use the operators and parameters in any order. Your api should automatically work if new operators and params are added



HINT: Input should contain one user_id and the query
Expected output: 
true/false(boolean)

If output is true that means the user id in request satisfies the condition and vice versa



   
 Bonus: Write an api / function using JS in Atmost 1000 lines, To show your coding capabilities.
    and an explanation of 
    
    1. The input
    2. The output
    3. why that api / function is impressive.
    
    Not the input and output can be anything, there are no restrictions
 


Tip:
1. You are free to use any publicly available npm library
2. This code was tested in `node v8.1.0` and `npm v5.0.3`. Please update node/npm before starting.
3. You may need to remove the node modules folder and reinstall. Perform by:
```
$rm -rf node_modules/
$npm install
```
