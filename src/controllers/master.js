const db = require('../models/index')
const { table, count, Console } = require('console');
var jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const Cryptr = require('cryptr');
const { encrypt, decrypt } = require('../middleware/crypt');
const crm_client=require("./jobposting/client/crm_client");
const e = require('express');
const response=require("../models/response");
const azure=require("../utils/azure_util");


exports.getQualification= async(req,res)=>{
    try{
        var userid=req.userid;
        //return res.status(200).send({'user':userid});
        var role=req.role;
        var body=req.body;
        var qualification_id;
        if(!(body.qualification_id)) {  
            return response.errorCJ_422(res,{ error: "Data not formatted properly" });
          }
          qualification_id=body.qualification_id;
        await db.sequelize.query("select * from  get_multiple_specialization(?);"
        ,{
            replacements:[qualification_id]
        }).then (data=>
            {
                result=JSON.parse(JSON.stringify(data[0]));
                if(result!=''){
                    return response.success(res,{ 'status': true,'total-count':result.length, 'data': result});
                }
                else{
                    return response.success(res,{ 'status': true,'total-count':result.length, 'data': result});                    
                }
            })
    }
    catch(error){
        console.log(error);
        return response.errorCJ_500(res,{'api':req.url,'error':error});
    }
}
exports.getSubRoles= async(req,res)=>{
    try{
        var userid=req.userid;
        //return res.status(200).send({'user':userid});
        var role=req.role;
        var body=req.body;
        var subroles;
        if(!(body.subroles)) {  
            return response.errorCJ_422(res,{ error: "Data not formatted properly" });
          }
          subroles=body.subroles;
        await db.sequelize.query("select * from  get_multiple_subroles(?);"
        ,{
            replacements:[subroles]
        }).then (data=>
            {
                result=JSON.parse(JSON.stringify(data[0]));
                if(result!=''){
                    return response.success(res,{ 'status': true,'total-count':result.length, 'data': result});
                }
                else{
                    return response.success(res,{ 'status': true,'total-count':result.length, 'data': result});                    
                }
            })
    }
    catch(error){
        console.log(error);
        return response.errorCJ_500(res,{'api':req.url,'error':error});
    }
}