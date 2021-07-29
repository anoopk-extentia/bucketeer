#!/usr/bin/env node
const yargs = require("yargs");

// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');

const options = yargs
 .usage("Usage: -f <fn> -b <bucketName> -o <objectName>, -k <key>")
 .option("f", { alias: "fn", describe: "listBuckets, listObjects, getObject", type: "string", demandOption: true })
 .option("b", { alias: "bucket", describe: "Name of bucket to list objects from", type: "string"})
 .option("o", { alias: "object", describe: "Name of object to get", type: "string"})
 .option("k", { alias: "key", describe: "Number of objects to get", type: "string"})
 .argv;

 // Set the credentials 
try{
  AWS.config.loadFromPath('./config.json');
}
catch{
  console.log("config.json not found or not correctly created. This file provides the acessKeyId, secret and region.");
  return;
}
// Create S3 service object
s3 = new AWS.S3({apiVersion: '2006-03-01'});

if(options.fn == 'listBuckets'){
    // Call S3 to list the buckets
    s3.listBuckets(function(err, data) {
        if (err) {
        console.log("Error", err);
        } else {
        console.log("Success", data.Buckets);
        }
    });  
}

if(options.fn == 'listObjects'){
    var params = {
        Bucket: options.bucket, 
        MaxKeys: options.key
    };

    
    s3.listObjects(params, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else     console.log(data);           // successful response
      });
}

if(options.fn == 'getObject'){
    var params3 = {
        Bucket: options.bucket, 
        Key: options.object
    };
    
    s3.getObject(params3, function(err, data) {
        if (err) {
          console.log("Error", err);
        } else {
          let objectData = data.Body.toString('utf-8');
          console.log("Success", objectData);
        }
      });
}