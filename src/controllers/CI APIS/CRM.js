const db = require('../../models/index'); 
const { table, count, Console } = require('console');
var jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const Cryptr = require('cryptr');
const { encrypt, decrypt } = require('../../middleware/crypt');
// const crm_client = require("./jobposting/client/crm_client");
const e = require('express');
const response = require("../../models/response");
const azure = require("../../utils/azure_util");
// const db = require('../models/index');
const { get_user, admin_login_log, get_team_id } = require('../../models/user_model')
// var jwt = require("jsonwebtoken");
const utils = require('../../utils/index');
const handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');
var nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
var md5 = require('md5');
// const { IGNORE } = require('sequelize/types/index-hints');
// const e = require('express');
// const { encrypt, decrypt } = require('../middleware/crypt');
// const md5 = require('md5');
// const cursor= require('../../cursor')
// const { Md5 } = require("ts-md5/dist/md5");

exports.get_roles = async (req, res) => {
  try {
    await db.sequelize.query("select a.rolestatus,a.roleid,a.role_name || coalesce(' [ ' ||(select coalesce(t.role_name,'')from mst_roles t where t.roleid=a.parentid)  || ' ] ','') role_name from mst_roles a where  a.roleid!='1' order by a.roleid ;")
      .then(temp => {
        result = JSON.parse(JSON.stringify(temp[0]));
        if (result != '') {
          return response.success(res, { "status": true, "total-count": result.length, "data": result })
        }
        else {
          return response.success(res, { "status": true, "total-count": result.length, "data": result, "msg": "No data found." });
        }
      });
  }
  catch (error) {
    console.log(error);
    return response.errorCJ_500(res, { "api url": req.url, "error": error });
  }
};

// exports.resetPassword = async (req, res) => {
//     try {
//       const { reset_email, base_url} = req.body;
//       db.sequelize.query("Select * from public.admin_login where admin_email=?",
//       {replacements: [reset_email]},{type:db.sequelize.QueryTypes.SELECT})
//       .then(temp=> {
//         result= JSON.parse(JSON.stringify(temp[0]));
//       console.log(temp);
//       if (result != ''){

//         id_enc= encrypt((result[0].admin_id).toString());
//         link= base_url+'/crm/password/reset/'+id_enc;
//         //htmlPath = '../controllers/views/rs_pass.html';

//         var smtpTransport= nodemailer.createTransport({
//           host: "email-smtp.us-east-1.amazonaws.com",
//           port: 587,
//           secure: false,  //use tls not working if set as true, SSL version error
//           auth: {
//               user: "AKIAXJENAIJ7C6A4BFFQ",
//               pass: "BLlll2ISsB00Dglj3IVkiVJlhSqZaHd7mxaxDlSc7qO9",
//           },
//         });
//         sendMail  = function(toemailid,reset_link)
//         {
//           const filePath = path.join(__dirname, '../controllers/views/rs_pass.html');
//           const source = fs.readFileSync(filePath, 'utf-8').toString();
//           const template = handlebars.compile(source);
//           const replacements = { reset_link: reset_link };
//           const htmlToSend = template(replacements);
//           var mailOptions = {
//             from: {
//                 name: 'CRM',
//                 address: 'noreply@contract-jobs.com'
//             },
//             to: 'rishabh.jain@akalinfosys.com',
//             subject :'Reset Password Sales CRM',
//             html: htmlToSend // html body
//           };

//           smtpTransport.sendMail(mailOptions, (error, info) => {
//             if (error)
//             {
//                 return console.log(error),
//                 res.status(200).send('Email not sent');

//             }
//             console.log(info),
//             res.status(200).send('Email sent');
//           });
//         };

//         sendMail(reset_email,link);
//       }

//       })  //end of then


//     }catch (error){
//       console.error(error)
//     }
//   };

exports.getUserDepartments = async (req, res) => {
  try {
    await db.sequelize.query('select crm_deptid,crm_departmentcode,crm_departmentname from mst_crm_department usertype  where status=1 order by crm_deptid;')
      .then(temp => {
        result = JSON.parse(JSON.stringify(temp[0]));
        if (result != '') {
          return response.success(res, { "status": true, "total-count": result.length, "data": result })
        }
        else {
          return response.success(res, { "status": true, "total-count": result.length, "data": result });
        }
      });
  }
  catch (error) {
    console.log(error);
    return response.errorCJ_500(res, { "api": req.api, "error": error });
  }
};

// exports.getall_users=async(res,req)=>{
//   try{

//     // const body=req.body;
//     const {keyword,p_segment,p_seldept,p_selrole,status}=req.body;
//     // var keyword=body.keyword;
//     // var p_segment= body.p_segment;
//     // var p_seldept=body.p_seldept ;
//     // var p_selrole=body.p_selrole ;
//     // var status=body.status;
//     // if(!(body.keyword&& body.p_segment&&body.p_seldept&& body.p_selrole&& body.status)){
//     //   return response.errorCJ_400(res,{error :"Data not formatted properly"});
//     // }
//     // return console.log(keyword,p_segment,p_seldept,p_selrole,status);
//     await db.sequelize.query('select * from get_alluserlist(?,?,?,?,?) order by admin_id;',
//     {
//       replacements:[keyword,p_segment,p_seldept,p_selrole,status]
//     },{ type: db.sequelize.Select })
//     .then(temp=>{
//       result=json.parse(json.strigify(temp[0]));
//       if(result!=''){
//         return response.success(res,{"status":true,"total-count":result.length,"data":result});
//       }
//       else{
//         return response.success(res,{"status":false,"total-count":result.length,"data": result, "msg": "No data found." });
//       }
//     }).catch(error=>{
//       console.log(error);
//     });
//   }
//   catch(error){
//     console.log('here')
//   console.log(error);
//   return response.errorCJ_500(res,{"api url":req.url,"error":error});

//   }
// }

// exports.getMulitipleProfiles=async(req,res)=>{
//   try{
//     // const{id,role,department}=req
//     console.log(req.id)
//     console.log(req.name)
//   id=req.id;
//   role=req.role;
//   department=req.department;
//   await db.sequelize.query('select * from fn_get_switch_profilelist(?,?,?);'
//   ,{replacement:[id,role,department]}
//   ,{ type: db.sequelize.Select })
//   .then (temp=>{
//     result=JSON.parse(JSON.stringify(temp[0]));
//     if(result!=''){
//         return response.success(res,{"status":true,"total-count":result.length,"data":result})
//     }
//     else{
//         return response.success(res,{"status":true,"total-count":result.length,"data": result});
//     }
//     });
//       }
//       catch(error){
//         console.log(error);
//         return response.errorCJ_500(res,{"api":req.api,"error":error});
//       }
//     };

exports.default_Logout = async (req, res) => {
  try {
    console.log(req.userid)
    await db.sequelize.query('select * from get_lastlogintime(?);'
      , { replacements: [req.userid] }
      , { type: db.sequelize.Select })
      .then(temp => {
        result = JSON.parse(JSON.stringify(temp[0]));
        if (result != '') {
          return response.success(res, { "status": true, "total-count": result.length, "data": result })
        }
        else {
          return response.success(res, { "status": true, "total-count": result.length, "data": result });
        }
      });
  }
  catch (error) {
    return response.errorCJ_500(res, { "api": req.api, "error": error });
  }
};

exports.get_allroles = async (req, res) => {
  try {
    await db.sequelize.query('select  r.roleid,r.role_name,r.rolestatus,r.created,r.updated,r.parentid ,(select t.role_name from mst_roles as t where t.roleid=r.parentid) parentrole from mst_roles as r where r.roleid <>1 order by r.roleid ;'
      , { type: db.sequelize.Select })
      .then(temp => {
        result = JSON.parse(JSON.stringify(temp[0]));
        var rolestatus_text;
        if (result[0].role_status == '2') {
          rolestatus_text = 'Inactive';
        }
        else if (result[0].role_status == '1') {
          rolestatus_text = 'Active';
        }
        else {
          rolestatus_text = 'Unknown';
        }
        result = result.map(object => {
          return { ...object, 'rolestatus_text': rolestatus_text };
        });
        var table = [];
        var row = {};
        for (var i = 0; i < Object.keys(result).length; i++) {
          row['id'] = result[i].roleid;
          row['enc_id'] = encrypt((result[i].roleid).toString());
          row['role_name'] = result[i].role_name;
          row['rolestatus'] = result[i].rolestatus;
          row['rolestatus_text'] = result[i].rolestatus_text;
          row['created'] = result[i].created;
          row['updated'] = result[i].updated;
          row['parentid'] = result[i].parentid;
          row['parentrole'] = result[i].parentrole;


          table[i] = row;
          row = {};

        }

        if (result != '') {
          return response.success(res, { "status": true, "total-count": result.length, 'data': table });
        }
        else {
          return response.success(res, { "status": true, "total-count": result.length, "data": table });
        }
      });
  }
  catch (error) {
    console.log(error);
    return response.errorCJ_500(res, { "api": req.api, "error": error });
  }
};

exports.get_AllProfileLists = async (req, res) => {
  try {
    const body = req.body;
    profile_lists = body.profile_lists;
    porfile_lists_final = [];
    if (profile_lists) {
      if (profile_lists != '' && profile_lists != undefined) {
        porfile_lists_final = profile_lists.split(',');

      } else {
        porfile_lists_final = [];
      }
    }
    await db.sequelize.query('select * from profile order by profilename;'
    ).then(temp => {
      result = JSON.parse(JSON.stringify(temp[0]));
      var table = [];
      var row = {};

      if (result != '') {
        var data = result
        for (var i = 0; i < Object.keys(result).length; i++) {
          row['id'] = data[i].profileid;
          row['enc_id'] = encrypt((data[i].profileid).toString());
          row['profilename'] = data[i].profilename;
          row['profiledesc'] = data[i].profiledesc;
          if (porfile_lists_final.length != 0 && porfile_lists_final.indexOf('profilename') != -1) {
            console.log('true')
            row['is_checked'] = true;
          } else {
            row['is_checked'] = false;
          }

          table[i] = row;
          row = {};

        }
        return response.success(res, { "status": true, "total-count": result.length, 'data': table });
      }
      else {
        return response.success(res, { "status": true, "total-count": result.length, "data": table });
      }
    });
  }
  catch (error) {
    console.log(error);
    return response.errorCJ_500(res, { "api": req.api, "error": error });
  }
};

exports.get_AllModuleListsforPrevilage = async (req, res) => {
  try {
    await db.sequelize.query('select M.moduleid,M.modulename,M.linkname,B.moduletype,C.modulename parent_text from modules M join moduletype B on  M.moduletype = B.id join modules C on M.parentid = C.moduleid where M.parentid=1 order by M.modulename;'
      , { type: db.sequelize.Select })
      .then(temp => {
        result = JSON.parse(JSON.stringify(temp[0]))
        const table = [];

        result.map(mod => table.push({
          'enc_id': encrypt((mod.moduleid).toString()),
          'moduleid': mod.moduleid,
          'linkname': mod.linkname,
          'moduletype': mod.moduletype,
          'parent_text': mod.parent_text
        }));


        if (result != '') {
          return response.success(res, { "status": true, "total-count": result.length, 'data': table });
        }
        else {
          return response.success(res, { "status": true, "total-count": result.length, "data": table });
        }
      });
  }
  catch (error) {
    console.log(error);
    return response.errorCJ_500(res, { "api": req.api, "error": error });
  }
};

exports.get_Moduletype = async (req, res) => {
  try {
    await db.sequelize.query('select * from moduletype ;'
      , { type: db.sequelize.Select })
      .then(temp => {
        result = JSON.parse(JSON.stringify(temp[0]));
        const table = [];

        if (result != '') {
          return response.success(res, { "status": true, "total-count": result.length, 'data': result });
        }
        else {
          return response.success(res, { "status": true, "total-count": result.length, "data": result });
        }
      });
  }
  catch (error) {
    return response.errorCJ_500(res, { "api": req.api, "error": error });
  }
};

exports.get_AllModuleLists = async (req, res) => {
  try {
    await db.sequelize.query('select M.moduleid,M.modulename,M.linkname,B.moduletype,C.modulename parent_text from modules M join moduletype B on M.moduletype = B.id join modules C on M.parentid = C.moduleid order by M.moduleid ;'
      , { type: db.sequelize.Select })
      .then(temp => {
        result = JSON.parse(JSON.stringify(temp[0]));
        const table = [];
        // console.log(result[0]);
        // result = result.map(object => {
        //   return {...object, 'rolestatus_text': rolestatus_text};
        //   // object.rolestatus_text=rolestatus_text
        // });
        //         for (var i = 0; i < Object.keys(result).length; i++){
        // result = result.map(object => {
        //   return {...object, 'enc_id': encrypt((result[i].roleid).toString())};
        // });}.
        // result.map(mod => table.push({
        //   'enc_id':encrypt((mod.moduleid).toString()),
        //   'moduleid':mod.moduleid,
        //   'linkname':mod.linkname,
        //   'moduletype':mod.moduletype,
        //   'parent_text':mod.parent_text}));
        if (result != '') {
          // for (var i = 0; i < Object.keys(result).length; i++) {
          //   row['enc_id'] = encrypt((result[i].moduleid).toString());
          //   row['role_name'] = result[i].role_name;
          //   row['rolestatus'] = result[i].rolestatus;
          //   row['rolestatus_text'] = result[i].rolestatus_text;
          //   row['created'] = result[i].created;
          //   row['updated'] = result[i].updated;
          //   row['parentid'] = result[i].parentid;
          //   row['parentrole'] = result[i].parentrole;
          // console.log(decrypt('OTRJM0JUN1NsSmVCemRaR3hJdlRMQT09'));
          // table[i] = row;
          // row = {};
          // }
          return response.success(res, { "status": true, "total-count": result.length, 'data': result });
        }
        else {
          return response.success(res, { "status": true, "total-count": result.length, "data": result });
        }
      });
  }
  catch (error) {
    return response.errorCJ_500(res, { "api": req.api, "error": error });
  }
};

exports.get_countrylists = async (req, res) => {
  try {
    var country_id = req.body.country_id;
    if (country_id == undefined) {
      country_id = 1;
    }
    console.log((country_id))
    await db.sequelize.query('select * from mst_country where countryid = (?) order by country_name ;',
      { replacements: [country_id] },
      { type: db.sequelize.Select })
      .then(temp => {
        result = JSON.parse(JSON.stringify(temp[0]));
        if (result != '') {
          return response.success(res, { "status": true, "total-count": result.length, 'data': result });
        }
        else {
          return response.success(res, { "status": true, "total-count": result.length, "data": result });
        }
      });
  }
  catch (error) {
    return response.errorCJ_500(res, { "api": req.api, "error": error });
  }
};

exports.get_UserTypes = async (req, res) => {
  try {

    await db.sequelize.query('select usertype from admin_login where usertype is not null group by usertype ;',
      { type: db.sequelize.Select })
      .then(temp => {
        result = JSON.parse(JSON.stringify(temp[0]));
        if (result != '') {
          return response.success(res, { "status": true, "total-count": result.length, 'data': result });
        }
        else {
          return response.success(res, { "status": true, "total-count": result.length, "data": result });
        }
      });
  }
  catch (error) {
    return response.errorCJ_500(res, { "api": req.api, "error": error });
  }
};

exports.get_DefaultUrl = async (req, res) => {
  try {
    await db.sequelize.query('select * from fn_get_defaultlogin_url() ;',
      { type: db.sequelize.Select })
      .then(temp => {
        result = JSON.parse(JSON.stringify(temp[0]));
        if (result != '') {
          return response.success(res, { "status": true, "total-count": result.length, 'data': result });
        }
        else {
          return response.success(res, { "status": true, "total-count": result.length, "data": result });
        }
      });
  }
  catch (error) {
    return response.errorCJ_500(res, { "api": req.api, "error": error });
  }
};

exports.get_leadtype = async (req, res) => {
  try {
    await db.sequelize.query('select * from mst_leadtype where status=1 order by leadtypeid;',
      { type: db.sequelize.Select })
      .then(temp => {
        result = JSON.parse(JSON.stringify(temp[0]));
        if (result != '') {
          return response.success(res, { "status": true, "total-count": result.length, 'data': result });
        }
        else {
          return response.success(res, { "status": true, "total-count": result.length, "data": result });
        }
      });
  }
  catch (error) {
    return response.errorCJ_500(res, { "api": req.api, "error": error });
  }
};

exports.get_Designation = async (req, res) => {
  try {
    await db.sequelize.query('select * from mst_designation where status=1;',
      { type: db.sequelize.Select })
      .then(temp => {
        result = JSON.parse(JSON.stringify(temp[0]));
        if (result != '') {
          return response.success(res, { "status": true, "total-count": result.length, 'data': result });
        }
        else {
          return response.success(res, { "status": true, "total-count": result.length, "data": result });
        }
      });
  }
  catch (error) {
    return response.errorCJ_500(res, { "api": req.api, "error": error });
  }
};

exports.get_user_byid = async (req, res) => {
  try {
    // return console.log(encrypt((req.id).toString()))
    // var id = encrypt((req.id).toString())
    // var id = decrypt((req.body.id).toString())
    var id=req.body.id;
    // return console.log(md5(req.id));
    // var id=md5((req.body.id).toString())
    if (id == '' && id == " ") {
      return response.errorCJ_422(res, { error: "Please enter a valid id" });
    }
    await db.sequelize.query('select * from admin_login where admin_id=?;',
      { replacements: [id] })
      .then(temp => {
        result = JSON.parse(JSON.stringify(temp[0]));
        if (result != '') {
          return response.success(res, { "status": true, "total-count": result.length, 'data': result });
        }
        else {
          return response.success(res, { "status": true, "total-count": result.length, "data": result });
        }
      });
  }
  catch (error) {
    console.log(error);
    return response.errorCJ_500(res, { "api": req.api, "error": error });
  }
};

exports.get_states_by_CountryID = async (req, res) => {
  try {
    var countryid = req.body.countryid
    if (countryid == undefined) {
      countryid = '1';
    }

    await db.sequelize.query('select id,state_name from mst_state where status=1 and countryid=? order by state_name;'
      , { replacements: [countryid] },
      { type: db.sequelize.Select })
      .then(temp => {
        result = JSON.parse(JSON.stringify(temp[0]));
        if (result != '') {
          return response.success(res, { "status": true, "total-count": result.length, 'data': result });
        }
        else {
          return response.success(res, { "status": true, "total-count": result.length, "data": result });
        }
      });
  }
  catch (error) {
    console.log(error);
    return response.errorCJ_500(res, { "api": req.api, "error": error });
  }
};

exports.save_user = async (req, res) => {
  try {
    const body = req.body;
    if (body.default_cust_segment != '') {
      default_cust_segment = body.default_cust_segment;

    }
    else {
      default_cust_segment = null;

    }

    if (body.default_cust_leadtype != '') {
      default_cust_leadtype = body.default_cust_leadtype;

    }
    else {
      default_cust_leadtype = null;

    }

    if (body.position_bulk_flag != '') {
      position_bulk_flag = body.position_bulk_flag;
    }
    else {
      position_bulk_flag = null;
    }



    await db.sequelize.query('select * from mst_roles where roleid=?;'
      , { replacements: [req.role] })
      .then(temp => {
        result = JSON.parse(JSON.stringify(temp[0]));
        // console.log(result[0]);
        if (result[0].rolestatus == 2) {
          return response.errorCJ_422(res, { "status": false, error: 'Your selected role is inactive.' });
        }
      });
    // var date_ob = new Date();
    // var month = date_ob.getMonth() + 1;
    // var date = date_ob.getDate();
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    var user_id = req.id;
    console.log(ip)
    console.log(encrypt((user_id).toString()));
    // console.log( decrypt('133987b0b6ad0c01fc0ccbdae1b95449'));
    if (body.id != '') {

      if ((body.id == undefined || body.id == ' ')) {
        return response.errorCJ_422(res, { status: false, error: "USER ID is missing." });
      }
      console.log('true');
      // var id = decrypt((body.id).toString());
      var id=body.id;

      await db.sequelize.query('update admin_login set admin_fullname=?,admin_email=?,admin_mobile=?,country=?,state=?,address=?,defaulturl=?,modified_by=?,modified_ip=?,modified_date=CURRENT_TIMESTAMP,account_status=?,enable_login=?,jdbankflag=?,role=?,usertype=?,default_cust_segment=?,default_cust_leadtype=?,position_bulk_flag=?,designation=? where admin_id=? returning *;'
        , {
          replacements: [body.name, body.email, body.mobile, body.Country, body.State, body.Location, body.default_url, user_id
            , ip, body.account_status, body.enable_login, body.jdbankflag, body.role, body.user_type, default_cust_segment, default_cust_leadtype, position_bulk_flag, body.designation, id]
        }).then(temp => {
          result = JSON.parse(JSON.stringify(temp[0]));

          if (result != '') {
            return response.success(res, { "status": true, "total-count": result.length, 'data': result, 'msg': 'Records updated Successfully.' });
          }
          else {
            return response.success(res, { "status": true, "total-count": result.length, "data": result, 'msg': 'Records not updated Successfully.' });
          }
        });
    }
    else {
      await db.sequelize.query('Insert into admin_login (admin_fullname,password,admin_email,admin_mobile,country,state,address,defaulturl,designation,account_status,enable_login,usertype,jdbankflag,role,default_cust_segment,default_cust_leadtype,position_bulk_flag,created_by,created_ip,created_date) Values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,Current_timestamp) returning *;'
        , {
          replacements: [body.name, encrypt('Welcome123'), (body.email).toLowerCase(), body.mobile, body.Country, body.State, body.Location, body.default_url, body.default_url, body.designation,
          body.account_status, body.enable_login, body.user_type, body.jdbankflag, body.role, default_cust_segment, default_cust_leadtype, position_bulk_flag, user_id, ip]
        },
        { type: db.sequelize.INSERT }
      ).then(temp => {
        result = JSON.parse(JSON.stringify(temp[0]));
        if (result != '') {
          return response.success(res, { "status": true, "total-count": result.length, 'data': result, 'msg': 'Records Saved Successfully.' });
        }
        else {
          return response.success(res, { "status": true, "total-count": result.length, "data": result, 'msg': 'Records Not Saved Successfully.' });
        }
      });
    }
  }
  catch (error) {
    console.log(error);
    return response.errorCJ_500(res, { "api": req.api, "error": error });
  }
};


// exports.save_RoleProfile = async (req, res) => {
//   try {
//     const body = req.body;
//     //   if(!isset($post['id']) || !isset($post['profilename']) || !isset($post['profiledescription'])){
//     //     $this->response(array("status"=>false,"msg"=>'Some parameters are missing.'), REST_Controller::HTTP_OK);
//     // }
//     if (body.profilename == ' ' || body.profiledescription == ' ') {
//       return response.errorCJ_422(res, { status: false, error: 'Please fill all the mandatory fields.' });
//     }
//     var userid = req.id;

//     // var date_ob = new Date();
//     // var month = date_ob.getMonth() + 1;
//     // var date = date_ob.getDate();
//     var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
//     var user_id = req.id;
//     console.log(ip)
//     console.log(encrypt((user_id).toString()));
//     // console.log( decrypt('133987b0b6ad0c01fc0ccbdae1b95449'));
//     if (body.id != '') {

//       if ((body.id == undefined || body.id == ' ')) {
//         return response.errorCJ_422(res, { status: false, error: "USER ID is missing." });
//       }
//       // var id = decrypt((body.id).toString());
//       var id=body.id;

//       await db.sequelize.query('update admin_login set profilename=?,profiledesc=?,modifiedby=?,modifiedon=Current_timestamp where admin_id=? returning *;'
//         , {
//           replacements: [body.profilename, body.profiledescription, userid, id]
//         }).then(temp => {
//           result = JSON.parse(JSON.stringify(temp[0]));

//           if (result != '') {
//             return response.success(res, { "status": true, "total-count": result.length, 'data': result, 'msg': 'Records updated Successfully.' });
//           }
//           else {
//             return response.success(res, { "status": true, "total-count": result.length, "data": result, 'msg': 'Records not updated Successfully.' });
//           }
//         });
//     }
//     else {
//       await db.sequelize.query('Insert into admin_login (profilename,profiledesc,createdby,createdon=Current_timestamp,,country,state,address,defaulturl,designation,account_status,enable_login,usertype,jdbankflag,role,default_cust_segment,default_cust_leadtype,position_bulk_flag,created_by,created_ip,created_date) Values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,Current_timestamp) returning *;'
//         , { replacements: [body.profilename, body.profiledescription, userid] },
//         { type: db.sequelize.INSERT }
//       ).then(temp => {
//         result = JSON.parse(JSON.stringify(temp[0]));
//         if (result != '') {
//           return response.success(res, { "status": true, "total-count": result.length, 'data': result, 'msg': 'Records Saved Successfully.' });
//         }
//         else {
//           return response.success(res, { "status": true, "total-count": result.length, "data": result, 'msg': 'Records Not Saved Successfully.' });
//         }
//       });
//     }
//   }
//   catch (error) {
//     console.log(error);
//     return response.errorCJ_500(res, { "api": req.api, "error": error });
//   }
// };

exports.getRoleProfile_byName = async (req, res) => {
  try {
    const body = req.body;
    var name = body.profile_name;
    name = name.toLowerCase();
    await db.sequelize.query('select * from get_assignprofile(0) where lower(role_name) like \'%' + name + '%\' OR lower(profilenames) like \'%' + name + '%\' ;')
      // query2= ' where 1=1 and  LOWER(m.modulename) like '+'%?%'+' or LOWER(c.modulename) like '+'%?%'; 
      // where 1=1 and lower(m.modulename) like \'%'+keyword+'%\' or lower(c.modulename) like \'%'+keyword+'%\' '
      // , { replacements: [name,name] })
      .then(temp => {
        result = JSON.parse(JSON.stringify(temp[0]));
        const table = [];

        result.map(mod => table.push({
          'roleid': mod.roleid,
          'roleid_enc': encrypt((mod.roleid).toString()),
          'role_name': mod.role_name,
          'profilenames': mod.profilenames,
          'profileids': mod.profileids
        }));
        if (result != '') {
          return response.success(res, { "status": true, "total-count": result.length, 'data': table });
        }
        else {
          return response.success(res, { "status": true, "total-count": result.length, "data": table });
        }
      });
  }
  catch (error) {
    console.log(error);
    return response.errorCJ_500(res, { "api": req.api, "error": error });
  }
};


exports.save_Privileges = async (req, res) => {
  try {
    const body = req.body;
    profile_id = body.profile_id;
    access_privilegs = body.privileges_details;

    var user_id = req.id;
    if (access_privilegs != undefined && access_privilegs != '') {

      access_privilegs.map(async mod => {
        moduleid = mod.moduleid
        // console.log(moduleid)

        if (moduleid != '' && moduleid != undefined) {

          await db.sequelize.query('delete from privilege where moduleid=? and  profileid=? returning * ;',
            { replacements: [moduleid, profile_id] }).then(temp => {
              result = JSON.parse(JSON.stringify(temp[0]));

              // console.log('mod', mod);
              // data =[].prototype.slice.call(mod,3);
              // data =slice.call(mod,3);
              data = Object.fromEntries(
                Object.entries(mod).slice(3)
              )
              // console.log(data)

              if (data != '') {
                for (let key in data) {
                  // return console.log(data[key]==1);
                  exp = key.split('_');
                  // Object.keys(data).map(async obj => {
                  //   exp = obj.split('_');

                  // console.log(obj == '1');
                  if (data[key] == '1') {

                    exp1 = (exp['0'].trim())
                    // exp=exp['0'];
                    db.sequelize.query('select accessid,accessdesc from accesstypes where LOWER(accessdesc) = LOWER (?) order by orderby ',
                      {
                        replacements: [exp1]
                      }).then(temp => {
                        getacess_id = JSON.parse(JSON.stringify(temp[0]));
                        // profileid =profile_id,
                        // moduleid = moduleid;
                        accessid = getacess_id['accessid'];
                        db.sequelize.query('Insert into privilege(profileid,moduleid,accessid,createdby,createdon ) Values(?,?,?,?,CURRENT_TIMESTAMP) returning *'
                          , {
                            replacements: [profile_id, moduleid, accessid, user_id]
                          }).then(temp => {
                            result = JSON.parse(JSON.stringify(temp[0]));
                            if (result != '') {
                              return response.success(res, { "status": true, "total-count": result.length, 'msg': 'Privileges Save Sucessfully', 'data': result });
                            }
                            else {
                              return response.success(res, { "status": true, "total-count": result.length, "data": result });
                            }
                          })
                      });
                  }
                }
                // })
              }
            })
        }
        else {
          await db.sequelize.query('delete from privilege where profileid=? returning * ;'

            , { replacements: [profile_id] })
            .then(temp => {
              result = JSON.parse(JSON.stringify(temp[0]));

              // console.log('mod', mod);
              // data =[].prototype.slice.call(mod,3);
              // data =slice.call(mod,3);
              data = Object.fromEntries(
                Object.entries(mod).slice(3)
              )
              if (data != '') {
                for (let key in data) {
                  exp = key.split('_');
                  // Object.keys(data).map(async obj => {
                  //   exp = obj.split('_');

                  // console.log(obj == '1');
                  if (data[key] == '1') {

                    exp1 = (exp['0'].trim())
                    // exp=exp['0'];
                    db.sequelize.query('select accessid,accessdesc from accesstypes where LOWER(accessdesc) = LOWER (?) order by orderby ',
                      {
                        replacements: [exp1]
                      }).then(temp => {
                        getacess_id = JSON.parse(JSON.stringify(temp[0]));
                        accessid = getacess_id['accessid'];
                        console.log(accessid)

                        db.sequelize.query('Insert into privilege(profileid,moduleid,accessid,createdby,createdon ) Values(?,?,?,?,CURRENT_TIMESTAMP) returning *'
                          , {
                            replacements: [profile_id, moduleid, accessid, user_id]
                          }).then(temp => {
                            result = JSON.parse(JSON.stringify(temp[0]));
                            if (result != '') {
                              return response.success(res, { "status": true, "total-count": result.length, 'msg': 'Privileges Save Sucessfully', 'data': result });
                            }
                            else {
                              return response.success(res, { "status": true, "total-count": result.length, "data": result });
                            }
                          })
                      });
                  }
                }
                // })
              }
            })
        }
      });


    }
    //   else{

    // await db.sequelize.query('delete from privilege where profileid=? returning * ;'

    //   , { replacements: [profile_id] })
    //   .then(temp => {
    //     result = JSON.parse(JSON.stringify(temp[0]));
    //     const table = [];

    //     // result.map(mod => table.push({
    //     //   'roleid': mod.roleid,
    //     //   // 'roleid_enc': encrypt((mod.roleid).toString()),
    //     //   'role_name': mod.moduleid,
    //     //   'linkname': mod.linkname,
    //     //   'profilenames': mod.profilenames,
    //     //   'profileids': mod.profileids
    //     // }));
    //     // if (result != '') {
    //     //   return response.success(res, { "status": true, "total-count": result.length, 'data': table });
    //     // }
    //     // else {
    //     //   return response.success(res, { "status": true, "total-count": result.length, "data": table });
    //     // }
    //   });}
  }
  catch (error) {
    console.log(error);
    return response.errorCJ_500(res, { "api": req.api, "error": error });
  }
};


exports.get_PrivilegeModuleProfile = async (req, res) => {
    try {
      const body = req.body;
      var{profileid,moduleid}=body;
      const table1 = [];
      const table = [];
          if(profileid!=undefined  && profileid!=''){ 
            profileid =profileid;
            }else{
              profileid = 0;
            }
            if(moduleid!=undefined && moduleid!=''){
            moduleid = moduleid;
            }else{
              moduleid = 0;
            }
  
            function check(data){
              if(data==0){
                  return false;
              }
              else{
                  return true;
              }
          }
  
     await db.sequelize.query('select * from get_accessprivilege(?,?)  ;'
        , { replacements: [profileid,moduleid] })
        .then(temp => {
          result = JSON.parse(JSON.stringify(temp[0]));
          // const table = [];
  
          if(result!=''&& result!=null){
            result.map(el=>table.push({
                'moduleid':el.moduleid,
                'modulename':el.modulename,
                'parentmodule':el.parentmodule,
                'isheader':el.isheader,
                'view': check(el.view),
                'add':check(el.add),
                'edit':check(el.edit),
                'delete':check(el.delete),
                'verify':check(el.verify),
                'print':check(el.print),
                'export':check(el.export),
                'fullcontrol':check(el.fullcontrol)
            }));
    }});
  
        await db.sequelize.query('select accessid,accessdesc from accesstypes  ;'
        ) .then(temp => {
          result1 = JSON.parse(JSON.stringify(temp[0]));
          
  
          if(result1!=''){
            // console.log(temp1[0])
            result1.map(el=>table1.push({
                'accessid':el.accessid,
                'accessdesc':el.accessdesc
            }));
            // data2=temp1;
            console.log(table1)
        }
        });
                if (result != '') {
            return response.success(res, { "status": true, "total-count": result.length, 'data': table ,'data1': table1});
          }
          else {
            return response.success(res, { "status": true, "total-count": result.length, "data": table ,'data1': table1});
          }
              
  }
    catch (error) {
      console.log(error);
      return response.errorCJ_500(res, { "api": req.api, "error": error });
    }
  };

  


exports.get_AllModuleListsFilter = async (req, res) => {
  try {
    const body = req.body;
    var module_name = body.module_name;
    query1 = 'select m.moduleid,m.modulename,m.linkname,b.moduletype,c.modulename as parent_text from modules m join moduletype b on  m.moduletype = b.id  join  modules c on m.parentid = c.moduleid';
    // query2= ' where 1=1 and  LOWER(m.modulename) like '+'`%?%`'+' or LOWER(c.modulename) like '+'`%?%`'; 

    query3 = ' order by m.moduleid '
    if (module_name != '' && module_name != undefined) {
      keyword = module_name.toLowerCase();
      keyword = keyword.trim();
      query2 = ' where 1=1 and lower(m.modulename) like \'%' + keyword + '%\' or lower(c.modulename) like \'%' + keyword + '%\' '
      q = query1 + query2 + query3;
      await db.sequelize.query(q
        // {replacements:[keyword,keyword]}
      ).then(temp => {

        result = JSON.parse(JSON.stringify(temp[0]));
        //  console.log(result)
        const table = [];

        result.map(mod => table.push({
          'moduleid': mod.moduleid,
          'enc_id': encrypt((mod.moduleid).toString()),
          'modulename': mod.modulename,
          'linkname': mod.linkname,
          'moduletype': mod.moduletype,
          'parent_text': mod.parent_text
        }));
        if (result != '') {
          return response.success(res, { "status": true, "total-count": result.length, 'data': table });
        }
        else {
          return response.success(res, { "status": true, "total-count": result.length, "data": table });
        }
      });
    }
    else {

      await db.sequelize.query(query1 + query3)
        //  { replacements: [module_name] })
        .then(temp => {
          result = JSON.parse(JSON.stringify(temp[0]));
          console.log(result)
          const table = [];

          result.map(mod => table.push({
            'moduleid': mod.moduleid,
            'enc_id': encrypt((mod.moduleid).toString()),
            'modulename': mod.modulename,
            'linkname': mod.linkname,
            'moduletype': mod.moduletype,
            'parent_text': mod.parent_text
          }));

          if (result != '') {
            return response.success(res, { "status": true, "total-count": result.length, 'data': table });
          }
          else {
            return response.success(res, { "status": true, "total-count": result.length, "data": table });
          }
        });
    }
  }
  catch (error) {
    console.log(error);
    return response.errorCJ_500(res, { "api": req.api, "error": error });
  }
};


exports.get_ParentModule = async (req, res) => {
  try {
    const body = req.body;
    var moduleid = body.id;
    console.log(typeof (id))



    // await db.sequelize.query('select * from modules where parentid=? and parentid=?>0;'

    if (moduleid != '' && moduleid != '0' && moduleid != undefined) {
      moduleid = moduleid - 1;
      console.log(typeof (moduleid))
      await db.sequelize.query('select * from modules where parentid=? and (parentid=?) > false;'
        , {
          replacements: [moduleid, moduleid]
        }).then(temp => {
          result = JSON.parse(JSON.stringify(temp[0]));
          const table = [];

          result.map(mod => table.push({
            'id': mod.moduleid,
            'modulename': mod.modulename,
            'linkname': mod.linkname,
            'parentid': mod.parentid
          }));
          if (result != '') {
            return response.success(res, { "status": true, "total-count": result.length, 'data': table });
          }
          else {
            return response.success(res, { "status": true, "total-count": result.length, "data": table });
          }

        })
    } else {
      await db.sequelize.query('select * from modules ;')
        .then(temp => {
          result = JSON.parse(JSON.stringify(temp[0]));
          const table = [];

          result.map(mod => table.push({
            'id': mod.moduleid,
            'modulename': mod.modulename,
            'linkname': mod.linkname,
            'parentid': mod.parentid
          }));
          if (result != '') {
            return response.success(res, { "status": true, "total-count": result.length, 'data': table });
          }
          else {
            return response.success(res, { "status": true, "total-count": result.length, "data": table });
          }
        });
    }
  }
  catch (error) {
    console.log(error);
    return response.errorCJ_500(res, { "api": req.api, "error": error });
  }
};

