const Parser = require('expr-eval').Parser;

export const replaceLogicalOperators = (query)=>{
    let operators = {
        "AND":"and",
        "OR":"or"
    }
    let replacedQuery=query;
    let keys = Object.keys(operators);
    for(let i=0;i<keys.length;i++){
        let regexExpression = "\\b("+keys[i] + ")\\b";
        let regExp = new RegExp(regexExpression,"g");
        replacedQuery = replacedQuery.replace(regExp,operators[keys[i]]);
    }
    return replacedQuery;
}

export const evaluateQuery = (query,user)=>{
    try {

        let parameters = {
            "wallet_balance":user.walletBalance,
            "number_of_deposits":user.noOfDeposits,
            "has_deposited":user.hasDeposited
        }
        let parser = new Parser();
        let expr = parser.parse(query);
        let result = expr.evaluate(parameters);
        
        return result;
    }
    catch(err){
        throw err;
    }
}
