#!/usr/bin/env node
const yargs = require("yargs");

// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');

const options = yargs
 .usage("Usage: -f <fn> -b <bucketName> -o <objectName>, -k <key>")
 .option("f", { alias: "fn", describe: "listBuckets, listObjects, getObject, removeObject", type: "string", demandOption: true })
 .option("b", { alias: "bucket", describe: "Name of bucket to list objects from", type: "string"})
 .option("o", { alias: "object", describe: "Name of object to get or remove", type: "string"})
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
var s3 = new AWS.S3({apiVersion: '2006-03-01'});

switch(options.fn){
  case('listBuckets'):
      // Call S3 to list the buckets
      s3.listBuckets(function(err, data) {
          if (err) {
          console.log("Error", err);
          } else {
          console.log("Success", data.Buckets);
          }
      });  
      break;

  var params;
  case('listObjects'):
        params = {
          Bucket: options.bucket, 
          MaxKeys: options.key
      };
      
      s3.listObjects(params, function(err, data) {
          if (err) console.log(err, err.stack); // an error occurred
          else     console.log(data);           // successful response
        });
    break;

  case('getObject'):
        params = {
          Bucket: options.bucket, 
          Key: options.object
      };
      
      s3.getObject(params, function(err, data) {
          if (err) {
            console.log("Error", err);
          } else {
            let objectData = data.Body.toString('utf-8');
            console.log("Success", objectData);
          }
        });
  break;

  case('removeObject'):
      params = {
        Bucket: options.bucket, 
        Key: options.object
    };
    
    s3.deleteObject(params, function(err, data) {
        if (err) {
          console.log("Error", err);
        } else {
          console.log("Object removed");
        }
      });
    break;
  default:
    console.log("Function", options.fn + " not found. See help with 'npm run help'.");
}