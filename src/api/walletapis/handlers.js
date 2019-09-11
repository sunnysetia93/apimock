const mongoose = require('mongoose');
const Wallet = mongoose.model('Wallet');
import evulateExpression from './expressionEvaluator';
import {replaceLogicalOperators,evaluateQuery} from './parser'; 
import {StatusCodes,ResponseMessages} from '../../shared/Constants';

export const getHandler = async(request,h)=>{
    const params = request.query;
    if(params.userId){
        const userWallet = await Wallet.find({userId:params.userId})
        return {
            error:false,
            statusCode:StatusCodes.SUCCESS_200,
            message:ResponseMessages.REQUEST_SUCCESSFUL,
            data:userWallet
        }   
    }
    return {
        error:true,
        statusCode:StatusCodes.FAILURE_404,
        message:ResponseMessages.NO_MATCHING_RECORD_FOUND
    }
}

export const postHandler = async (request,h)=>{
    const params = request.payload;
    if( checkIfExists(params.number_of_deposits) && 
        checkIfExists(params.has_deposited) && 
        checkIfExists(params.wallet_balance) ){
        let newWallet = new Wallet({
            hasDeposited:params.has_deposited,
            walletBalance:parseInt(params.wallet_balance),
            noOfDeposits:parseInt(params.number_of_deposits)
        })
        const createdWallet = await newWallet.save();
        return {
            error:false,
            statusCode:StatusCodes.SUCCESS_201,
            message:ResponseMessages.REQUEST_SUCCESSFUL,
            data:createdWallet
        }

    }
    else{
        return {
            error:true,
            statusCode:StatusCodes.FAILURE_400,
            message:ResponseMessages.PARAMETERS_NOT_FOUND
        }
    }

}

export const updateHandler = async (request,h)=>{
    const payload = request.payload;
    let updateWallet = {}
    if(!checkIfExists(payload.user_id))
        return {
            error:true,
            statusCode:StatusCodes.FAILURE_400,
            message:ResponseMessages.NO_MATCHING_RECORD_FOUND
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
            statusCode:StatusCodes.FAILURE_400,
            message:NO_MATCHING_RECORD_FOUND
        }
    return {
        error:false,
        statusCode:StatusCodes.SUCCESS_202,
        message:ResponseMessages.REQUEST_SUCCESSFUL,
        data:wallet
    };
}

export const removeHandler = async (request,h)=>{
    const payload = request.payload;
    if(!checkIfExists(payload.user_id))
        return {
            error:true,
            statusCode:StatusCodes.FAILURE_400,
            message:ResponseMessages.NO_MATCHING_RECORD_FOUND
        };
    const walletDeleted = await Wallet.findOneAndDelete({userId:payload.user_id});
    if(walletDeleted==null)
        return {
            error:true,
            statusCode:StatusCodes.FAILURE_400,
            message:ResponseMessages.NO_MATCHING_RECORD_FOUND
        }
    return {
        error:false,
        statusCode:StatusCodes.SUCCESS_202,
        message:ResponseMessages.REQUEST_SUCCESSFUL,
        data:walletDeleted
    }
}

export const queryHandler = async (request,h)=>{
    try {
        
        const payload = request.payload;
        if(!checkIfExists(payload.query) || !checkIfExists(payload.user_id)){
            return {
                error:true,
                statusCode:StatusCodes.FAILURE_400,
                message:ResponseMessages.PARAMETERS_NOT_FOUND
            };
        }
        
        const userFound = await Wallet.findOne({userId:payload.user_id});
        if(!userFound)
        return {
            error:true,
            statusCode:StatusCodes.FAILURE_400,
            message:ResponseMessages.NO_MATCHING_RECORD_FOUND
        };
        
        let replacedQuery = replaceLogicalOperators(payload.query);
        let result = evaluateQuery(replacedQuery,userFound);

        return {
            error:false,
            statusCode:StatusCodes.SUCCESS_200,
            message:ResponseMessages.REQUEST_SUCCESSFUL,
            data:result
        }
    }
    catch(err){
        return {
            error:true,
            statusCode:StatusCodes.FAILURE_400,
            message:ResponseMessages.PARSING_ERROR
        };
    }
}


export const queryHandler_custom = async (request,h)=>{
    const payload = request.payload;
    if(!checkIfExists(payload.query) || !checkIfExists(payload.user_id)){
        return {
            error:true,
            statusCode:StatusCodes.FAILURE_400,
            message:ResponseMessages.PARAMETERS_NOT_FOUND
        };
    }

    const userFound = await Wallet.findOne({userId:payload.user_id});
    if(!userFound)
        return {
            error:true,
            statusCode:StatusCodes.FAILURE_400,
            message:ResponseMessages.NO_MATCHING_RECORD_FOUND
        };
    let q = replaceParametersWithValues(payload.query,userFound);
    let queryResult = evulateExpression(q);
    return {
        error:false,
        statusCode:StatusCodes.SUCCESS_200,
        message:ResponseMessages.REQUEST_SUCCESSFUL,
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