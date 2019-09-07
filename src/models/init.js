const mongoose = require('mongoose');
const fastCSV = require('fast-csv');
const path = require('path');
const fs = require('fs');
import {parseCsvToJson} from '../shared';
const Wallet = mongoose.model('Wallet');

(function(){
    return new Promise(async (resolve,reject)=>{
        let filePath = path.resolve(__dirname,"../static","Data.csv");
        if(!fs.existsSync(filePath)){
            reject("Data.csv file not found");
        }

        try{

            let dataArray = await parseCsvToJson(filePath);
            let len = dataArray.length;
            for(let i=0;i<len;i++){
                let hasDeposited = dataArray[i].has_depositted==="TRUE"?true:false
                let newWallet = new Wallet({
                    userId:dataArray[i].user_id,
                    hasDeposited:hasDeposited,
                    walletBalance:parseInt(dataArray[i].wallet_balance),
                    noOfDeposits:parseInt(dataArray[i].number_of_deposits)
                })
                await Wallet.findOneOrCreate({userId:dataArray[i].user_id},newWallet)
                
            }
        }
        catch(err){
            reject(err);
        }
    })
})();
