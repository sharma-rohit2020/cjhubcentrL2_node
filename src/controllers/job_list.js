const db = require('../models/index')
const { table, count, Console } = require('console');
var jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const Cryptr = require('cryptr');
const { encrypt, decrypt } = require('../middleware/crypt');
const crm_client=require("./jobposting/client/crm_client");
const e = require('express');

const response=require("../models/response");
var inserted_transaction_id=[];

exports.job_list=async(req,res)=>{
    try{
        var data;
        var transaction_id;
        var lead_id ;
        var crm_job_id ;
        var client_name; 
        var client_address;
        var client_city;
        var client_state;
        var client_pin ;
        var job_posting_title;
        var job_description ;
        var number_of_vacancies;
        var job_role_id;
        var job_role_name;
        var job_role_sub_ids;
        var job_role_sub_name;
        var job_skils_ids;
        var job_skils_name;
        var industry_ids;
        var industry_names;
        var location_of_job;
        var min_experience ;
        var max_experience;
        var annual_ctc_currency;
        var monthlysalary ;
        var qualification_ids ;
        var qualification_name;
        var qualification_branch_ids;
        var qualification_branch_name;
        var created_date;
        var created_by;
        await crm_client.job_list().then(value=>{
            data=value.data;   
        });
       // return  response.success(res,{ 'status': true, 'msg': data});
        if((data==null)){
            return  response.success(res,{ 'status': true, 'msg': "No Data Found"});
        }
        for(var row in data){
            var job_list=data[row];
            transaction_id=job_list.transaction_id;
            lead_id=job_list.lead_id ;
            crm_job_id=job_list.job_id ;
            client_name=job_list.client_name; 
            client_address=job_list.client_address;
            client_city=job_list.client_city;
            client_state=job_list.client_state;
            client_pin=job_list.client_pin ;
            job_posting_title=job_list.job_posting_title;
            job_description=job_list.job_description ;
            number_of_vacancies=job_list.job_position_qty;
            job_role_id=job_list.job_role_id;
            job_role_name=job_list.job_role_name;
            job_role_sub_ids=job_list.job_role_sub_ids!=null?job_list.job_role_sub_ids.replace(/\|/g,','):job_list.job_role_sub_ids;
            job_role_sub_name=job_list.job_role_sub_name;
            job_skils_ids=job_list.job_skils_ids.replace(/\|/g,',');
            job_skils_name=job_list.job_skils_name;
            industry_ids=job_list.industry_ids!=null?job_list.industry_ids.replace(/\|/g,','):job_list.industry_ids;
            industry_names=job_list.industry_names;
            location_of_job=job_list.location_of_job;
            min_experience=job_list.min_experience ;
            max_experience=job_list.max_experience;
            annual_ctc_currency='Rupees';
            monthlysalary=job_list.monthlysalary ;
            qualification_ids=job_list.qualification_ids!=null?job_list.qualification_ids.replace(/\|/g,','):job_list.qualification_ids ;
            qualification_name=job_list.qualification_name;
            qualification_branch_ids=job_list.qualification_branch_ids!=null?job_list.qualification_branch_ids.replace(/\|/g,','):job_list.qualification_branch_ids;
            qualification_branch_name=job_list.qualification_branch_name;
            created_date=job_list.created_date;
            created_by=job_list.created_by;
            
            await db.sequelize.query("CALL usp_client_crm_job_list(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);"
            ,{
                replacements:["job_list",transaction_id,lead_id,crm_job_id,client_name,client_address,client_city,client_state,client_pin,job_posting_title,job_description,number_of_vacancies,job_role_id,job_role_name,job_role_sub_ids,job_role_sub_name,job_skils_ids,job_skils_name,industry_ids,industry_names,location_of_job,min_experience,max_experience,annual_ctc_currency,monthlysalary,qualification_ids,qualification_name,qualification_branch_ids,qualification_branch_name,created_date,created_by,'']
            }).then (data=>
                {
                result=JSON.parse(JSON.stringify(data[0]));
                if(result[0].status!=''){
                    inserted_transaction_id.push(transaction_id);  
                }                          
                
            })
        }
        return  response.success(res,{ 'status': false, 'msg': inserted_transaction_id});
                    
           /*  await crm_client.job_list_acknowledgement(inserted_transaction_id).then(value=>{
                data=(value);  
                console.log(data);
                if(data.status==true){                                
                    return  response.success(res,{ 'status': true, 'msg': data.msg});
                }else{                            
                    return  response.success(res,{ 'status': false, 'msg': data.msg});
                }       
            }); */
            
        
        
        

    }catch(error){
        console.log(error);
        return response.errorCJ_500(res,{'api':req.url,'error':error});
    }
}