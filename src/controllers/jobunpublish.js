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

exports.getunpublished_jobs=async(req,res)=>{
    try{
        var userid=req.userid;
        //return res.status(200).send({'user':userid});
        var role=req.role;
        await db.sequelize.query("SET datestyle TO 'ISO, DMY' ;select * from  get_all_unpublish_job_list(?,?,?);"
        ,{
            replacements:["UnPublish_job",userid,role]
        }).then (data=>
            {
                result=JSON.parse(JSON.stringify(data[0]));
                if(result!=''){
                    return response.success(res,{ 'status': true, 'total-count':result.length,'data': result});
                }
                else{
                    return response.success(res,{ 'status': true,'total-count':result.length, 'data': result});                    
                }
            })
    }
    catch(error){
        return response.errorCJ_500(res,{'api':req.url,'error':error});
    }
};
exports.unpublish_to_open=async(req,res)=>{
    try{
        var userid=req.userid;
        var role=req.role;
        var jobid=req.body.jobid;
        if( jobid=='' || jobid==" "){
            return response.errorCJ_400(res,{error:'Data not formated Properly'});
        }
        await db.sequelize.query("update tbl_employerjobprovider set status =0, post_date=current_timestamp where upper(job_id)=? RETURNING status ,post_date;"
        ,{
            replacements:[jobid]
        }).then(data=>{
            result=JSON.parse(JSON.stringify(data[0]));
            if(result!=''){
                return response.success(res,{ 'status': true, 'msg':"Job status 'Open' has been updated successfully",'total-count':result.length,'data': result});
            }
            else{
                return response.success(res,{ 'status': false,'msg':"Job status 'Unpublish' has not been updated successfully",'total-count':result.length, 'data': result});                    
            }
        })
    }
    catch(error){
        return response.errorCJ_500(res,{'api':req.url,'error':error}); 
    }
};