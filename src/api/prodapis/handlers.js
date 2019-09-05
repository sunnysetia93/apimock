import fs from 'fs';
import fastCSV from 'fast-csv';
import path from 'path';

let adder = (sum, element) => {
	let p = new Promise ((resolve) => {
    resolve(sum + element);
  });

  return p;
}


export let loop = async (request, h) => {
  let numbers = [1,2,3,4,5,6,7,8,9,10];
  let sum = 0;
  let numbersLen = numbers.length;
  for(let i=0;i<numbersLen;i++){
    console.log(`Trying to add ${numbers[i]}`);
  	let res = await adder(sum, numbers[i])
    console.log(`Current sum is ${res}`);
    sum=res;
  }
  
  return sum;
};

export const csv2jsonHandler = async (request,h) => {
  const data = request.payload;
  if(typeof data.file==="object"){
    const directory = path.resolve(__dirname,"../../uploads")
    if(!fs.existsSync(directory)){
      fs.mkdirSync(directory);
    }
    const name = data.file.hapi.filename;
    const filePath = path.resolve(directory,name);
    await writeToFile(data.file,filePath);
    return await parseCsvToJson(filePath);
  }
  else
    return {
      error:true,
      statusCode:400
    }
}

export const writeToFile = (file,filePath)=>{
  return new Promise((resolve,reject)=>{
    const stream = fs.createWriteStream(filePath);
    stream.on('error',(err)=>reject(err));
    file.pipe(stream).on('close',()=>resolve());
  })
}

export const parseCsvToJson = (filePath)=>{
  return new Promise((resolve,reject)=>{
      const result = [];
      fastCSV
        .parseFile(filePath,{headers:true})
        .on('error', error => reject(error))
        .on("data",data=>result.push(data))
        .on("end",()=>{
            resolve(result);
        })
  })
}

