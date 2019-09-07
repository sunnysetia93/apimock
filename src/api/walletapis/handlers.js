const mongoose = require('mongoose');
const Wallet = mongoose.model('Wallet');
import evulateExpression from './expressionEvaluator';

export const getHandler = async(request,h)=>{
    const params = request.query;
    if(params.userId){
        const userWallet = await Wallet
                                    .find({userId:params.userId})
        return {
            error:false,
            statusCode:200,
            message:"Request Successful",
            data:userWallet
        }   
    }
    return {
        error:true,
        statusCode:400,
        message:"userId parameter not found"
    }
}

export const postHandler = async (request,h)=>{
    const params = request.payload;
    if( checkIfExists(params.user_id) && 
        checkIfExists(params.number_of_deposits) && 
        checkIfExists(params.has_deposited) && 
        checkIfExists(params.wallet_balance) ){{
    
        let wallet = await Wallet.findOne({userId:params.user_id});
        if(wallet!=null){
            return {
                error:true,
                statusCode:400,
                message:'wallet with this user_id already exists'
            };        
        }
        let newWallet = new Wallet({
            userId:params.user_id,
            hasDeposited:params.has_deposited,
            walletBalance:parseInt(params.wallet_balance),
            noOfDeposits:parseInt(params.number_of_deposits)
        })
        const createdWallet = await newWallet.save();
        return createdWallet;

    }}
    else{
        return {
            error:true,
            statusCode:400,
            message:" required parameters not found"
        }
    }

}

export const updateHandler = async (request,h)=>{
    const payload = request.payload;
    let updateWallet = {}
    if(!checkIfExists(payload.user_id))
        return {
            error:true,
            statusCode:400,
            message:'no user_id found in the request payload'
        };
    
    if(checkIfExists(payload.number_of_deposits))
        updateWallet.noOfDeposits = payload.number_of_deposits;
    if(checkIfExists(payload.wallet_balance))
        updateWallet.walletBalance = payload.wallet_balance;
    if(checkIfExists(payload.has_depositted))
        updateWallet.hasDeposited = payload.has_depositted;
    
    const wallet = await Wallet.findOneAndUpdate({userId:payload.user_id},updateWallet);
    if(!wallet)
        return {
            error:true,
            statusCode:400,
            message:'no wallet found matching user_id'
        }
    return {
        error:false,
        statusCode:202,
        message:'Successfully Updated',
        data:wallet
    };
}

export const removeHandler = async (request,h)=>{
    const payload = request.payload;
    if(!checkIfExists(payload.user_id))
        return {
            error:true,
            statusCode:400,
            message:'no user_id found in the request payload'
        };
    const walletDeleted = await Wallet.findOneAndDelete({userId:payload.user_id});
    if(walletDeleted==null)
        return {
            error:true,
            statusCode:400,
            message:'no wallet found matching user_id'
        }
    return {
        error:false,
        statusCode:202,
        message:'Successfully Deleted',
        data:walletDeleted
    }
}

export const queryHandler = async (request,h)=>{
    const payload = request.payload;
    if(!checkIfExists(payload.query) || !checkIfExists(payload.user_id)){
        return {
            error:true,
            statusCode:400,
            message:'required parameters not found in the request payload'
        };
    }

    const userFound = await Wallet.findOne({userId:payload.user_id});
    if(!userFound)
        return {
            error:true,
            statusCode:400,
            message:'no user found matching the user_id'
        };
    let q = replaceParametersWithValues(payload.query,userFound);
    let queryResult = evulateExpression(q);
    return {
        error:false,
        statusCode:200,
        message:"request successful",
        data:queryResult
    }
}


const checkIfExists = (value)=>{
    if(value===undefined)
        return false;
    return true;
}

const replaceParametersWithValues = (query,user)=>{
    let parameters = {
        "wallet_balance":user.walletBalance,
        "number_of_deposits":user.noOfDeposits,
        "has_deposited":user.hasDeposited
    }
    let q=query;
    let keys = Object.keys(parameters);
    for(let i=0;i<keys.length;i++){
        let re = new RegExp(keys[i],"g");
        q = q.replace(re,parameters[keys[i]]);
    }

    return q;
}