import fs, { promises } from 'fs';
import path from 'path';
import requestIp from 'request-ip';
import {parseCsvToJson} from '../../shared';
import config from '../../config';
import Singleton from './singletonMap';

const redis = require('redis');
const {promisify} = require('util');
const client = redis.createClient(config.redisURL);
const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

let adder = (sum, element) => {
	let p = new Promise ((resolve) => {
    resolve(sum + element);
  });

  return p;
}

export const dynamicDelayHandler = async (request,h)=>{
  const clientIp = requestIp.getClientIp(request);
  const instance = Singleton.getInstance();
  const map = instance.map;
  if(map[clientIp]==null){
    instance.set(clientIp);
  }
  map[clientIp].counter++;
  let user = map[clientIp];
  let response = Math.pow(2,user.counter);
  let delay = (2*user.counter -1)*1000;
  if(checkTimeDifference(user.timestamp) >= 10){
    instance.reset(clientIp);
    count = counter.increment(clientIp);
    delay = (2*count -1)*1000;
  }
  return await delayFunction(delay,response);  
}

export const dynamicDelayHandler_redis = async (request,h)=>{
  const clientIp = requestIp.getClientIp(request);
  let clientInfo = JSON.parse(await getAsync(clientIp));
  
  if(clientInfo===null)
    clientInfo = {counter:0,timestamp:now};
  
  // reset after 5 minutes
  if(checkTimeDifference(clientInfo.timestamp) >= 5*(60)){
    clientInfo = {counter:0,timestamp:now};
  }
  clientInfo.counter++;
  let response = Math.pow(2,clientInfo.counter);
  let delay = (2*clientInfo.counter -1)*1000;

  await setAsync(clientIp,JSON.stringify(clientInfo));  
  return await delayFunction(delay,response);  

}

const checkTimeDifference = (old)=>{
  let diff = Math.floor((Date.now() - old)/1000);
  return diff
}

const delayFunction = (delay,response) => new Promise(resolve=>{
    setTimeout(()=>{
        resolve(response);
    },delay)
})


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

const writeToFile = (file,filePath)=>{
  return new Promise((resolve,reject)=>{
    const stream = fs.createWriteStream(filePath);
    stream.on('error',(err)=>reject(err));
    file.pipe(stream).on('close',()=>resolve());
  })
}


