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


exports.openJobList= async(req,res)=>{
    try{
        var userid=req.userid;
        var role=req.role;
        var body=req.body;
        var search_keyword=null;
        if(body.search_keyword){
            search_keyword=body.search_keyword;
        }
        await db.sequelize.query("SET datestyle TO 'ISO, DMY' ;select * from  get_all_open_job_list(?,?,?,?,?,?);"
        ,{
            replacements:["open-job",userid,role,null,null,search_keyword]
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
exports.openJobListbyid= async(req,res)=>{
    try{
        var userid=req.userid;
        var job_id=req.body.job_id;
        await db.sequelize.query("select * from  get_open_jobs_byid(?,?,?);"
        ,{
            replacements:["open_job_byid",job_id,userid]
        }).then (data=>
            {
                result=JSON.parse(JSON.stringify(data[0]));
                if(result!=''){
                    return response.success(res,{ 'status': true, 'data': result});
                }
                else{
                    return response.success(res,{ 'status': false, 'data': result});                    
                }
            })
    }
    catch(error){
        console.log(error);
        return response.errorCJ_500(res,{'api':req.url,'error':error});
    }
}

exports.saveopenjobs= async(req,res)=>{
    try{
        const body=req.body;
        var id=req.id;
        var userid=req.userid;
        let logo_path ='';
        if(!(body.action_type && body.job_type && body.job_title && body.job_role && body.work_experience_min && body.work_experience_max && body.min_annual_salary && body.max_annual_salary&& 
             body.number_of_vacancies && body.city && body.state && body.en_employer_name && body.en_employer_logo )){
            return response.errorCJ_400(res,{error:"Data not formatted properly"});
        }
        if(body.file_name){
            var logo_data=body.en_employer_logo;
            var original_file_name=body.file_name;
            var convert_file_name_in_array=original_file_name.split(".");
            var file_extension=convert_file_name_in_array.pop();
            var file_name="upload/companylogo/"+convert_file_name_in_array.toString()+"_"+new Date().getTime()+"."+file_extension; 
             logo_path = await azure.uploadImgToAzure(file_name,logo_data)
        }else{
            logo_path =body.en_employer_logo;
        }
        

        // return response.success(res,{ 'status': false, 'Msg': logo_path});
        
        var job_id=body.job_id;
        var job_title=body.job_title;
        var job_type=body.job_type;
        var job_positions= body.number_of_vacancies;        
        var job_role=body.job_role;
        var sub_role=body.new_job_sub_role_id;
        var skills_tools_technologies=body.skills_tools_technologies;
        var min_annual_salary=body.min_annual_salary;
        var max_annual_salary=body.max_annual_salary;
        var work_experience_min=body.work_experience_min;
        var work_experience_max=body.work_experience_max;
        var  state=body.state;
        var city=body.city;
        var job_description=body.job_description;
        var number_of_vacancies=body.number_of_vacancies;
        var specialization=body.specialization;
        var candidate_qualifications=body.candidate_qualifications;
        var en_employer_name=body.en_employer_name;
        var en_employer_logo=logo_path;

        /* var required_experience=body.required_experience;
        var location_of_job=body.location_of_job;
        var industry=body.industry;
        var functional_area=body.functional_area;
        var job_live_date=body.job_live_date;
        var post_date=body.post_date;
        var status=body.status;
        var  publish_status=body.publish_status; */
        var action=body.action_type;
       /*  await db.sequelize.query("CALL save_publish_openjob(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);"
        ,{
            replacements:[action,job_title,job_positions,required_experience,job_type,job_id,job_description,skills_tools_technologies
                ,work_experience_min,work_experience_max,min_annual_salary,max_annual_salary,number_of_vacancies,location_of_job,city,
                state,industry,functional_area,job_role,candidate_qualifications,specialization,job_live_date,post_date,status,publish_status," ",en_employer_name,en_employer_logo]
        }).then (data=> */
        await db.sequelize.query("CALL usp_insert_update_employer_jobprovider(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);"
        ,{
            replacements:[action,id,job_title,job_positions,job_id,job_description,number_of_vacancies,en_employer_logo,
                en_employer_name,job_type,job_role,sub_role,skills_tools_technologies,min_annual_salary,max_annual_salary,
                work_experience_min,work_experience_max,state,city,specialization,candidate_qualifications,'']
        }).then (data=>
            {
            result=JSON.parse(JSON.stringify(data[0]));
            // console.log(result);
            if(result[0].status=='Data updated'){
              return response.success(res,{ 'status': true, 'Msg': result[0].status});  
            }
            else{
                return response.success(res,{ 'status': false, 'Msg': result[0].status});
                }

        }).catch(error =>{
            return response.errorCJ_500(res,{ 'api':req.url,'error':error});
        });

    }
    catch(error){
        return response.errorCJ_500(res,{'api':req.url,'error':error});
    }
}
exports.publishopenJob= async(req,res)=>{
    try{
        const body=req.body;
        

        job_title=body.job_title;
        job_positions= body.job_positions;
        required_experience=body.required_experience;
        job_type=body.job_type;
        job_id=body.job_id;
        job_description=body.job_description;
         skills_tools_technologies=body.skills_tools_technologies;
        work_experience_min=body.work_experience_min;
        work_experience_max=body.work_experience_max;
        min_annual_salary=body.min_annual_salary;
        max_annual_salary=body.max_annual_salary;
        number_of_vacancies=body.number_of_vacancies;
        location_of_job=body.location_of_job;
        city=body.city;
        state=body.state;
        industry=body.industry;
        functional_area=body.functional_area;
        job_role=body.job_role;
        candidate_qualifications=body.candidate_qualifications;
        specialization=body.specialization;
        job_live_date=body.job_live_date;
        post_date=body.post_date;
        var status=body.status;
        publish_status=body.publish_status;
         action='Post_Job';
         en_employer_name=body.en_employer_name;
         en_employer_logo=body.en_employer_logo;
         await db.sequelize.query("CALL save_publish_openjob(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);"
         ,{
             replacements:[action,job_title,job_positions,required_experience,job_type,job_id,job_description,skills_tools_technologies
                 ,work_experience_min,work_experience_max,min_annual_salary,max_annual_salary,number_of_vacancies,location_of_job,city,
                 state,industry,functional_area,job_role,candidate_qualifications,specialization,job_live_date,post_date,status,publish_status," ",en_employer_name,en_employer_logo]
         }).then (data=>
            {
            result=JSON.parse(JSON.stringify(data[0]));
            if(result[0].savestatus=='Job Posted Successfully'){
              return response.success(res,{ 'status': true, 'Msg': result[0].savestatus});  
            }
            else{
                return response.success(res,{ 'status': false, 'Msg': result[0].savestatus});
                }

        }).catch(error =>{
            return response.errorCJ_500(res,{ 'api':req.url,'error':error});
        });


    }
    catch(error){
        return response.errorCJ_500(res,{'api':req.url,'error':error});
    }
}



exports.publishedJobList= async(req,res)=>{
    try{
        var userid=req.userid;
        //return res.status(200).send({'user':userid});
        var role=req.role;
        var body=req.body;
        var search_keyword=null;
        if(body.search_keyword){
            search_keyword=body.search_keyword;
        }
        await db.sequelize.query("SET datestyle TO 'ISO, DMY' ;select * from  get_all_open_job_list(?,?,?,?,?,?);"
        ,{
            replacements:["publish-job",userid,role,null,null,search_keyword]
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
        console.log('either here')
        console.log(error);
        return response.errorCJ_500(res,{'api':req.url,'error':error});
    }
}
exports.unpublishedJobList= async(req,res)=>{
    try{
        var userid=req.userid;
        //return res.status(200).send({'user':userid});
        var role=req.role;
        var body=req.body;
        var search_keyword=null;
        if(body.search_keyword){
            search_keyword=body.search_keyword;
        }
        await db.sequelize.query("SET datestyle TO 'ISO, DMY' ;select * from  get_all_open_job_list(?,?,?,?,?,?);"
        ,{
            replacements:["open-job",userid,role,null,null,search_keyword]
        }).then (data=>
            {
                result=JSON.parse(JSON.stringify(data[0]));
                if(result!=''){
                    console.log("hello "+result.length);
                    return response.success(res,{ 'status': true,'total-count':result.length, 'data': result});
                }
                else{
                    return response.success(res,{ 'status': true,'total-count':result.length,  'data': result});                    
                }
            })
    }
    catch(error){
        return response.errorCJ_500(res,{'api':req.url,'error':error});
    }
}

//WORK START

exports.get_published_jobs_byid=async(req,res)=>{
    try{
        var userid=req.userid;
        var job_id=req.body.job_id;
        await db.sequelize.query("select * from  get_Saved_Publishedjobs_byid(?,?,?);"
        ,{
            replacements:["published_job_byid",job_id,userid]
        }).then (data=>
            {
                result=JSON.parse(JSON.stringify(data[0]));
                if(result!=''){
                    return response.success(res,{ 'status': true, 'total-count':result.length,'data': result});
                }
                else{
                    return response.success(res,{ 'status': false,'total-count':result.length, 'data': result});                    
                }
            })
    }
    catch(error){
        return response.errorCJ_500(res,{'api':req.url,'error':error});
    }
}

exports.get_saved_jobs_byid=async(req,res)=>{
    try{
        var userid=req.userid;
        var job_id=req.body.job_id;
        await db.sequelize.query("select * from  get_Saved_Publishedjobs_byid(?,?,?);"
        ,{
            replacements:["Saved_job_byid",job_id,userid]
        }).then (data=>
            {
                result=JSON.parse(JSON.stringify(data[0]));
                if(result!=''){
                    return response.success(res,{ 'status': true, 'total-count':result.length,'data': result});
                }
                else{
                    return response.success(res,{ 'status': false,'total-count':result.length, 'data': result});                    
                }
            })
    }
    catch(error){
        return response.errorCJ_500(res,{'api':req.url,'error':error});
    }
};

exports.job_keyword_search=async(req,res)=>{
    try{
        // var userid=req.userid;
        // var job_id=req.body.job_id;
        action=req.body.action;
        search=req.body.search;
        await db.sequelize.query("select * from  get_job_keywords(?,?);"
        ,{
            replacements:[search,action]
        }).then (data=>
            {
                result=JSON.parse(JSON.stringify(data[0]));
                if(result!=''){
                    return response.success(res,{ 'status': true, 'total-count':result.length,'data': result});
                }
                else{
                    return response.success(res,{ 'status': false,'total-count':result.length, 'data': result});                    
                }
            })
    }
    catch(error){
        return response.errorCJ_500(res,{'api':req.url,'error':error});
    }
};