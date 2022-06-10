const db = require('../models/index') 
var jwt = require("jsonwebtoken");
const utils = require('../utils/index');
const handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');
var nodemailer = require('nodemailer');
// const { encrypt } = require('../middleware/cj_encryptor');
const { encrypt,decrypt } = require('../middleware/crypt.js');
const striptags=require("striptags");
var md5 = require('md5');
const { update_module, checkUserRights, getmodulebyid, get_profiles_by_id, update_user, checkCurrentPassword, checkTime, get_user_by_id } = require('../models/CMS_CI');


var token;
var result;
var menuhtml;
let login_date_time = utils.curdate_sys;


exports.userChangerPassword = async (req, res) => {
    try {
        // return console.log(encrypt('123456'))
        const { currentpwd, newpassword, confirmpassword } = req.body;
        user_id = req.id;
        if (currentpwd == null || newpassword == null || confirmpassword == null) {
            res.status(200).send({
                status: false,
                msg: "Some parameters are missing"
            })
        }
        if (currentpwd == '' || newpassword == '' || confirmpassword == '') {
            res.status(200).send({
                status: false,
                msg: "Please fill all the mandatory fields."
            })
        }
        checkCurrentPassword(currentpwd).then(temp => {
            if (temp == '') {
                res.status(200).send({
                    status: false,
                    msg: 'Current Password Does Not Match Please Enter Correct Password'
                })
            }
            if (newpassword != confirmpassword) {
                res.status(200).send({
                    status: false,
                    msg: 'New Password and Confirm Password Not Matched. Please enter Same Password'
                })
            }
            let update = [];
            update['password'] = newpassword;
            update['is_passwordchange'] = 'Y';
            update_user(user_id, update).then(temp => {
                if (temp) {
                    res.status(200).send({
                        status: true,
                        msg: 'Password has been changed Successfully!'
                    })
                }
                else {
                    res.status(200).send({
                        status: false,
                        msg: 'Something went wrong'
                    })
                }
            })
        })
    }
    catch (err) {
        res.status(500).send({
            status: false,
            msg: "Exception occurred"
        })
    }
}


// get profileid
exports.getProfileById = async (req, res) => {
    try {
        const { profile_id } = req.body;
        if (profile_id == null) {
            res.status(200).send({
                status: false,
                msg: 'Some parameter is missing.'
            })
        }
        if (profile_id == '') {
            res.status(200).send({
                status: false,
                msg: 'Please fill the mandatory field.'
            })
        }
        let row = [];
        get_profiles_by_id(profile_id).then(temp => {
            console.log(temp);
            if (temp != '') {
                temp.map(el => row.push({
                    'id': el.profileid,
                    'enc_id': encrypt(el.profileid.toString()),
                    'profilename': el.profilename,
                    'profiledesc': el.profiledesc
                }))
                res.status(200).send({
                    status: true,
                    data: row
                })
            }
            else {
                res.status(200).send({
                    status: false,
                    msg: 'Records are not found.'
                })
            }
        })
    }
    catch (err) {
        console.log(err);
        res.status(500).send({
            status: false,
            msg: 'Exception occurred'
        })
    }
}
// checkaccess right

exports.checkAccessRight = (req, res) => {
    try {
        // console.log(typeof(authJwt))
        // console.log(authJwt)
        const { module_name } = req.body;
        // console.log(module_name);
        role_id = req.role;
        // console.log(role_id)
        user_id = req.id;
        checkUserRights(role_id, module_name).then(temp => {
            console.log(temp)
            if (temp != '') {
                res.status(200).send({
                    status: true,
                    'data': temp

                })
            }
            else {
                res.status(200).send({
                    status: false,

                })
            }
        })
    }
    catch (err) {
        res.status(500).send({
            status: false,
            msg: "Exception occured"
        })
    }
}
// getmodulebyid



exports.getModuleByModuleId = (req, res) => {
    try {
        const { id } = req.body;
        if (id == null) {
            res.status(200).send({
                staus: false,
                msg: "Some Parameter is missing."
            })
        }
        if (id == '') {
            res.status(200).send({
                staus: false,
                msg: "Please fill the mandatory field."
            })
        }
        let row = [];
        getmodulebyid(id).then(temp => {
            if (temp != '') {
                console.log(temp);
                temp[0].map(el => row.push({
                    'id': el.moduleid,
                    'encid': encrypt(el.moduleid.toString()),
                    'modulename': el.modulename,
                    'linkname': el.linkname,
                    'parentid': el.parentid,
                    'moduletype': el.moduletype,
                    // 'comment':el.comment
                }))
                res.status(200).send({
                    status: true,
                    data: row
                })
            }
            else {
                res.status(200).send({
                    status: false,
                    msg: 'Records are not found.'
                })
            }

        })
    }
    catch (err) {
        console.log(err);
    }
}

// reset password

// exports.resetPassword = async (req, res) => {
//     try {
//         const { reset_email, base_url } = req.body;
//         db.sequelize.query("Select * from admin_login where admin_email=?",
//             { replacements: [reset_email] }, { type: db.sequelize.QueryTypes.SELECT })
//             .then(temp => {
//                 result = JSON.parse(JSON.stringify(temp[0]));

//                 if (result != '') {

//                     id_enc = encrypt((result[0].admin_id).toString());
//                     link = base_url + '/cms/password/reset/' + id_enc;
//                     //htmlPath = '../controllers/views/rs_pass.html';

//                     var smtpTransport = nodemailer.createTransport({
//                         host: "email-smtp.us-east-1.amazonaws.com",
//                         port: 587,
//                         secure: false,  //use tls not working if set as true, SSL version error
//                         auth: {
//                             user: "AKIAXJENAIJ7C6A4BFFQ",
//                             pass: "BLlll2ISsB00Dglj3IVkiVJlhSqZaHd7mxaxDlSc7qO9",
//                         },
//                     });
//                     sendMail = function (toemailid, reset_link) {
//                         const filePath = path.join(__dirname, '../views/rs_pass.html');
//                         const source = fs.readFileSync(filePath, 'utf-8').toString();
//                         const template = handlebars.compile(source);
//                         const replacements = { reset_link: reset_link };
//                         const htmlToSend = template(replacements);
//                         var mailOptions = {
//                             from: {
//                                 name: 'CMS',
//                                 address: 'noreply@contract-jobs.com'
//                             },
//                             to: 'vinod@akalinfosys.com',
//                             subject: 'Reset Password Sales CMS',
//                             html: htmlToSend // html body
//                         };

//                         smtpTransport.sendMail(mailOptions, (error, info) => {
//                             if (error) {
//                                 return console.log(error),
//                                     res.status(200).send('Email not sent');
//                                 ;
//                             }
//                             console.log(info),
//                                 res.status(200).send('Email sent');
//                         });
//                     };

//                     sendMail(reset_email, link);
//                 }

//             })  //end of then


//     } catch (error) {
//         console.error(error)
//     }
// };
// getUserDetailsByUserId
exports.getUserDetailsByUserId = async (req, res) => {
    try {
        // var id  = decrypt(((req.body.id).toString()));
        var id=req.body.id;
        if (id == null) {
            res.status(200).send({
                statuS: false,
                msg: "Some parameter is missing."
            })
        }
        if (id == '') {
            res.status(200).send({
                status: false,
                msg: "Please fill the mandatory field."
            })
        }

        if (id != '') {
            let row = [];
            checkTime(id).then(temp => {
                if (temp[0].usp_isresetlinkactive == 0) {
                    get_user_by_id(id).then(temp => {
                        if (temp != '') {

                            temp.map((el) => {
                                row.push({
                                    id: el.admin_id,
                                    enc_id: encrypt(el.admin_id.toString()),
                                    admin_fullname: el.admin_fullname,
                                    admin_email: el.admin_email,
                                    admin_mobile: el.admin_mobile,
                                    rec_time: el.resetrequestdatetime,
                                    country: el.country,
                                    state: el.state,
                                    address: el.address,
                                    geotaglatitude: el.geotaglatitude,
                                    geotaglongitude: el.geotaglongitude,
                                    account_status: el.account_status,
                                    role: el.role,
                                    default_cust_segment: el.default_cust_segment,
                                    default_cust_leadtype: el.default_cust_leadtype,
                                    designation: el.designation
                                })
                                // console.log("row",row)
                            } );
                            // temp=row;
                            // console.log(row)
                            res.status(200).send({
                                status: true,
                                data: row
                            })
                            // console.log(row)

                        }
                    })
                }
                else {
                    res.status(200).send({
                        status: false,
                        msg: 'EXP'
                    })
                }
            })
        }
        else {
            res.status(200).send({
                status: false,
                msg: 'Invalid Email Id Passed'
            })
        }

    } catch (error) {
        console.error(error)
        res.status(200).send({
            status: false,
            msg: 'Exception occured',
        })
    }
};

// Savemodule
exports.saveModule = (req, res) => {
    try {
        const { id, moduletype, parentname, modulename, webpagepath } = req.body;
        if (id == null || moduletype == null || parentname == null || modulename == null || webpagepath == null) {
            res.status(200).send({
                status: false,
                msg: "Some parameters are missing."
            })
        }
        if (moduletype == '' || modulename == '' || webpagepath == '') {
            res.status(200).send({
                status: false,
                msg: "Please fill all the mandatory fields."
            })
        }
        user_id = req.id;
        function test_input(input) {
            input = input.trim();
            input = striptags(input);
            return input;
        }
        let insertdata = [];
        insertdata['moduletype'] = test_input(moduletype);
        if (moduletype == 1) {
            insertdata['parentid'] = 1
        }
        else {
            insertdata['parentid'] = test_input(parentname);
        }
        insertdata['modulename'] = test_input(modulename);
        insertdata['linkname'] = test_input(webpagepath);
        let rowid = test_input(id);

        let date_ob = new Date();
        let month = date_ob.getMonth() + 1;
        var date_time = date_ob.getFullYear() + "-" + month + date_ob.getDate() + " " + date_ob.getHours() +
            date_ob.getMinutes() + date_ob.getSeconds() + date_ob.getMilliseconds();
        if (rowid == '') {
            insertdata['modifiedby'] = user_id;
            insertdata['modifiedon'] = date_ob;
        }
        update_module(rowid, insertdata).then(temp => {
            if (temp) {
                res.status(200).send({
                    status: true,
                    msg: 'Record saved successfully.',
                })
            }
            else {
                res.status(200).send({
                    status: false,
                    msg: 'Something went wrong.',
                })
            }
        })
    }
    catch (err) {
        console.log(err)
        res.status(500).send({

            status: false,
            msg: "Exception occured"
        })
    }
}

exports.user_login = async (req, res) => {
    try {
      const { email, password } = req.body;
      // console.log(email, password);
      // return console.log(encrypt)
      let user_ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
      let user_browser = req.useragent.browser;
      
      if (email == '' || password == '') {
        let userid = email;
        await db.sequelize.query("Insert into admin_login_log (userid,user_ip,user_browser,login_date_time,type,login_status) values (?,?,?,?,?,?)"
        , {
          replacements: [userid, user_ip, user_browser, login_date_time, 'Admins', 'Invalid Email ID or Password.']
        }, { type: db.sequelize.INSERT })
      }
      // console.log(utils.curdate_sys);
      
      // only runs the block when values of email and password are present
      if (email != '' && password != '') {
        // pass=md5(password)
        // console.log(pass)
       await db.sequelize.query(`SELECT a.*,b.role_name,0 as teamids 
                            from public.admin_login a
                            inner join public.mst_roles b on
                            a.role = b.roleid 
                            where a.admin_email=? and a.password=?
                            AND a.enable_login='1'` ,
          { replacements: [email, password] }, { type: db.sequelize.QueryTypes.SELECT })
          .then(temp => {
            console.log(temp)
            result = JSON.parse(JSON.stringify(temp[0]));
            // check if result is empty or not
            if (result == '') {
              login_status = 'False';
  
              // create log in db about invalid password entered 
              db.sequelize.query("Insert into admin_login_log (userid,user_ip,user_browser,login_date_time,type,login_status) values (?,?,?,?,?,?)"
                , {
                  replacements: [email, user_ip, user_browser, login_date_time, 'Admins', 'Invalid Email ID or Password.']
                }, { type: db.sequelize.INSERT })
              res.status(200).send({ 'status': login_status, 'msg': 'Invalid Login', });
  
              // check if account is active or not
            } else if (result[0].account_status != '1') {
              login_status = 'False';
              res.status(200).send({
                status: login_status,
                msg: 'Your account is Inactive. Please check your registred E-Mail for activation link or click on forget password to retrive your account details.',
              });
            } else {
              login_status = 'True';
            };
  
            if (login_status == 'True') {
              db.sequelize.query(" select * from get_prepare_menu(?,?)",
                { replacements: [result[0].usertype, result[0].role] }, { type: db.sequelize.QueryTypes.SELECT })
                .then(temp => {
                  menuhtml = JSON.parse(JSON.stringify(temp[0]));
                  // console.log(menuhtml);
                  // create token and send response if email and password entered are correct
                  token = jwt.sign({
                    id: result[0].admin_id.toString(),
                    name: result[0].admin_fullname,
                    userid: result[0].admin_email,
                    role: result[0].role.toString(),
                    department: result[0].usertype,
                    designation: result[0].designation,
                    defaulturl: result[0].defaulturl,
                    permision: 'W',
                    language: 'EN',
                    user_type: result[0].usertype,
                    rolename: result[0].role_name,
                    default_cust_leadtype: result[0].default_cust_leadtype,
                    default_cust_segment: result[0].default_cust_segment,
                    is_passwordchange: result[0].is_passwordchange,
                    tok_team_id: result[0].teamids,
                    parent_admin_id: result[0].parent_admin_id.toString(),
                    parent_admin_email: result[0].parent_admin_email,
                  }, process.env.Secret, {                 
                    expiresIn: 86400 // 24 hours
                  });
                  res.status(200).send({
                    status: login_status,
                    token: token,
                    //user_type: result[0].user_type,
                    role_name: result[0].role_name,
                    department: result[0].department,
                    //default_cust_leadtype: result[0].default_cust_leadtype,
                    // default_cust_segment: result[0].default_cust_segment,
                    //  role_id: result[0].role,
                    email_id: email,
                    name: result[0].admin_fullname,
                    role: encrypt((result[0].role).toString()),
                    user_id: encrypt((result[0].admin_id).toString()),
                    menuhtml: menuhtml[0].get_prepare_menu,
                  });
  
                  //increase char limit at token in admin_login_log table of DB to store token
                  db.sequelize.query("Insert into admin_login_log (userid,user_ip,user_browser,login_date_time,type,login_status, login_token) values (?,?,?,?,?,?,?)"
                    , {
                      replacements: [email, user_ip, user_browser, login_date_time, 'admin', 'Success', token]
                    }, { type: db.sequelize.INSERT });
  
                })  //end of then
            }  // end of if
  
          });
      } else {
        res.status(200).send({ 'status': false, 'msg': 'All the fields are required', 'browser': user_browser });
      };
      // end of then
    } catch (error) {
      // console.log(error)
      res.status(200).send({ 'status': false, 'msg': error.msg });
    }
  };