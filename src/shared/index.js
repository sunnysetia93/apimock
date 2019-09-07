const fastCSV = require('fast-csv');

export const parseCsvToJson = (filePath)=>new Promise((resolve,reject)=>{
    let result=[];
    fastCSV
        .parseFile(filePath,{headers:true})
        .on('error', error => reject(error))
        .on("data",data=>result.push(data))
        .on("end",()=>{
            resolve(result)
        })
})