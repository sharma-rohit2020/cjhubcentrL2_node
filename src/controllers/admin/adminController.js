const db = require('../models/index')
const { table, count, Console } = require('console');
var jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const Cryptr = require('cryptr');
const { encrypt, decrypt } = require('../middleware/crypt');
const crm_client=require("./jobposting/client/crm_client");
const e = require('express');
const response=require("../models/response");


exports.adminUserList= async(req,res)=>{
    try{
        // var userid=req.userid;
        // //return res.status(200).send({'user':userid});
        // var role=req.role;
        await db.sequelize.query("select admin_id,admin_fullname,account_status,enable_login from  admin_login where account_status=? and enable_login=?"
        ,{
            replacements:['1','1']
        },{type:db.sequelize.QueryTypes.SELECT}).then (data=>
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