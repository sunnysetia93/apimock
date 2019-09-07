const operators = {
    // "/":{ precedence:17, original:"/", operation:(a,b)=>{return a/b} },
    // "*":{ precedence:17, original:"*", operation:(a,b)=>{return a*b} },
    // "%":{ precedence:17, original:"%", operation:(a,b)=>{return a%b} },
    // "+":{ precedence:16, original:"+", operation:(a,b)=>{return a+b} },
    // "-":{ precedence:16, original:"-", operation:(a,b)=>{return a-b} },
    ">":{ precedence:11, original:">", operation:(a,b)=>{return a>b} },
    "<":{ precedence:11, original:"<", operation:(a,b)=>{return a<b} },
    ">=":{ precedence:11, original:">=", operation:(a,b)=>{return a>=b} },
    "<=":{ precedence:11, original:"<=", operation:(a,b)=>{return a<=b} },
    // "===":{ precedence:11, original:"===", operation:(a,b)=>{return a===b} },
    "==":{ precedence:11, original:"==", operation:(a,b)=>{return a==b} },
    "=":{ precedence:11, original:"==", operation:(a,b)=>{return a==b} },
    "&&":{ precedence:6, original:"&&", operation:(a,b)=>{return a&&b} },
    "AND":{ precedence:6, original:"&&", operation:(a,b)=>{return a&&b} },
    "||":{ precedence:5 ,original:"||", operation:(a,b)=>{return a||b}},
    "OR":{ precedence:5, original:"||", operation:(a,b)=>{return a||b}},
}

function evaluate(expression){
    let arr = expression.split(" ");
    let len = arr.length;
    let operatorStack = [];
    let valueStack = [];
    for(let i=0;i<len;i++){
        if(Object.keys(operators).includes(arr[i])){
            let op;
            for(let key in operators){
                if(key===arr[i]){
                    op=operators[key].original;
                }
            }

            while(operatorStack.length!=0 && checkPrecedence(op,operatorStack[operatorStack.length-1])){
                let result = performOperation(valueStack.pop(),valueStack.pop(),operatorStack.pop());
                valueStack.push(result);
            }
            operatorStack.push(op);
        }
        else if(arr[i]==="(")
            operatorStack.push(arr[i]);
        else if(arr[i]===")"){
            while (operatorStack[operatorStack.length-1] != '(') 
                valueStack.push(performOperation(valueStack.pop(), valueStack.pop(), operatorStack.pop())); 
            operatorStack.pop(); 
        }
        else{
            if(arr[i]==="false")
                valueStack.push(false);
            else if(arr[i]==="true")
                valueStack.push(true);
            else
                valueStack.push(parseInt(arr[i]));
        }
    }

    while(operatorStack.length!=0){
        let result = performOperation(valueStack.pop(),valueStack.pop(),operatorStack.pop());
        valueStack.push(result);
    }
    return valueStack.pop();
}

function checkPrecedence(op1,op2){
    if (op2 == '(' || op2 == ')') 
        return false; 
    let precedence_op2 = operators[op2].precedence;
    let precedence_op1 = operators[op1].precedence;
    if(precedence_op2>=precedence_op1)
        return true;
    return false;
}

function performOperation(b,a,operater){
    for(let key in operators){
        if(key===operater){
            return operators[key].operation(a,b);
        }
    }
}
export default evaluate;