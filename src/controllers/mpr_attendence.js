const CosmosClient = require('@azure/cosmos').CosmosClient
const config = require("../models/config");

const { endpoint, key, databaseId, containerId } = config;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const client = new CosmosClient({ endpoint, key });

const database = client.database(databaseId);
const container = database.container(containerId);





//const db = require('../models/databaseContext')
const { table, count, Console } = require('console');
var jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const Cryptr = require('cryptr');
const { encrypt, decrypt } = require('../middleware/crypt');
const crm_client = require("./jobposting/client/crm_client");
const e = require('express');
const response = require("../models/response");
const azure = require("../utils/azure_util");
const { ConflictResolutionMode } = require('@azure/cosmos');
const { exit } = require('process');

const newItem = {
    id: "4",
    category: "fudsdn",
    name: "Cosmos DB",
    description: "Complete Cosmos DB Node.js Quickstart ⚡",
    isComplete: false
};


exports.get_all_contrtact = async (req, res) => {
    try {
         var body = req.body;
         var id=body.id;
        // var MPRYear, MPRMonth;
        // MPRYear = body.MPRYear;
        // MPRMonth = body.MPRMonth;

        // console.log(`Querying container:\n${config.container.id}`)
        const querySpec = {
            query: "SELECT * from c",
            parameters: [
                // {
                //     name: '@MPRYear',
                //     value: MPRYear
                // },
                // {
                //     name: '@id',
                //     value: id
                // }
            ]
        }

        const { resources: data } = await client
            .database(databaseId)
            .container(containerId)
            .items.query(querySpec)
            .fetchAll()
            .then(data => {
                // console.log(typeof(data));  // result=JSON.stringify(data);   // console.log(result);   // console.log(typeof(result));
                result = JSON.parse(JSON.stringify(data))

                if (result != '') {
                    return response.success(res, { 'status': true, 'total-count': result.length, 'data': result.resources });
                }
                else {
                    return response.success(res, { 'status': true, 'total-count': result.length, 'data': result.resources });
                }
            });
    }
    catch (error) {
        console.log(error);
        return response.errorCJ_500(res, { 'api': req.url, 'error': error });
    }
}

exports.get_all_contrtact_year_month = async (req, res) => {
    try {
         var body = req.body;
         
         var MPRYear, MPRMonth;
         MPRYear = body.MPRYear;
         MPRMonth = body.MPRMonth;
        // console.log(`Querying container:\n${config.container.id}`)
        const querySpec = {
            query: "SELECT * from c where c.contractResources[0].mprDetails[0].mprYear=@MPRYear and c.contractResources[0].mprDetails[0].mprMonth=@MPRMonth",
            parameters: [
                {
                    name: '@MPRYear',
                    value: MPRYear
                },
                {
                    name: '@MPRMonth',
                    value: MPRMonth
                }
            ]
        }

        const { resources: data } = await client
            .database(databaseId)
            .container(containerId)
            .items.query(querySpec)
            .fetchAll()
            .then(data => {
                // console.log(typeof(data));  // result=JSON.stringify(data);   // console.log(result);   // console.log(typeof(result));
                result = JSON.parse(JSON.stringify(data))

                if (result != '') {
                    return response.success(res, { 'status': true, 'total-count': result.length, 'data': result.resources });
                }
                else {
                    return response.success(res, { 'status': true, 'total-count': result.length, 'data': result.resources });
                }
            });
    }
    catch (error) {
        console.log(error);
        return response.errorCJ_500(res, { 'api': req.url, 'error': error });
    }
}

exports.insert_contract = async (req, res) => {
    try {
         var newItem = req.body;
        // const newItem = {
        //     id: "30",
        //     category: "fudsdn",
        //     name: "Cosmos DB",
        //     description: "Complete Cosmos DB Node.js Quickstart ⚡",
        //     isComplete: false
        // };

        const { resource: result } = await client
            .database(databaseId)
            .container(containerId)
            .items.create(newItem)
            .then(result => {                
                if (result != '') {
                    return response.success(res, { 'status': true, 'total-count': result.length, 'data': result.resource });
                }
                else {
                    return response.success(res, { 'status': true, 'total-count': result.length, 'data': result.resource });
                }
            })
    }
    catch (error) {
        console.log(error);
        return response.errorCJ_500(res, { 'api': req.url, 'error': error });
    }
}

exports.update_record = async (req, res) => {
    try {
         var createdItem = req.body;
        // const createdItem = {
        //     id: "3",
        //     category: "cat3",
        //     name: "Cosmdsadsadsados DBXsadsadsgadhgszX",
        //     description: "dsadsadsadsadsadsadsa Cosmos DB Node.js Quickstart ⚡",
        //     isComplete: false
        // };
       
        const { id, category } = createdItem;

        createdItem.isComplete = true;

        const { resource: updatedItem } = await client
            .database(databaseId)
            .container(containerId)            
            .item(id, category)
            .replace(createdItem)
            .then(updatedItem => {   
              //return  console.log(updatedItem);
                result=updatedItem.resource;
                
                if (updatedItem != '') {
                    return response.success(res, { 'status': true, 'total-count': result.length, 'data': result });
                }
                else {
                    return response.success(res, { 'status': true, 'total-count': result.length, 'data': result });
                }
            })
    }
    catch (error) {
        console.log(error);
        return response.errorCJ_500(res, { 'api': req.url, 'error': error });
    }
}

exports.delete_record = async (req, res) => {
    try {
         var createdItem = req.body;
        // const createdItem = {
        //     id: "23",
        //     category: "fudsdn",
        //     name: "Cosmos DB",
        //     description: "Complete Cosmos DB Node.js Quickstart ⚡",
        //     isComplete: false
                        
        // };

        const { resource: deleteItem } = await client
            .database(databaseId)
            .container(containerId)            
            .item(createdItem.id, createdItem.category)
            .delete()
            .then(deleteItem => {   
                result=deleteItem.item;
                
                if (result != '') {
                    return response.success(res, { 'status': true, 'total-count': result.length, 'data': result.id });
                }
                else {
                    return response.success(res, { 'status': true, 'total-count': result.length, 'data': result.id });
                }
            })
    }
    catch (error) {
        console.log(error);
        return response.errorCJ_500(res, { 'api': req.url, 'error': error });
    }
}
