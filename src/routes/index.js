const { authJwt } = require("../middleware/index.js"); 
const job_list = require("../controllers/job_list");
const job_publish = require("../controllers/jobPublish");
const master = require("../controllers/master");
const crm = require("../controllers/CI APIS/CRM.js");
const cms = require("../controllers/CMS API.js");

const login = require("../controllers/LoginController");
//const admin_user=require("../controllers/admin/adminController");
// const express = require("express");
const job_unpublish = require("../controllers/jobunpublish.js");
// const { authJwt } = require("../middleware/index.js");
// const job_list=require("../controllers/job_list");
// const job_publish=require("../controllers/jobPublish");
// const master=require("../controllers/master");
const mpr_attendence = require("../controllers/mpr_attendence");
// //const admin_user=require("../controllers/admin/adminController");
const express = require("express");
// const job_unpublish=require("../controllers/jobunpublish.js");

const authroute = express.Router();

authroute.use(authJwt.verifyToken);

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });



  //RECRUITER DETAILS
  app.post("/api/get_all_contrtact", mpr_attendence.get_all_contrtact);
  app.post("/api/get_all_contrtact_y_m", mpr_attendence.get_all_contrtact_year_month);
  app.post("/api/insert_contract", mpr_attendence.insert_contract);


  app.post("/api/update_record", mpr_attendence.update_record);
  app.post("/api/delete_record", mpr_attendence.delete_record);









  // app.post("/api/crm-job-list",job_list.job_list);
  // app.post("/api/open-job-list",authroute,job_publish.openJobList);
  // app.post("/api/publish-job-list",authroute,job_publish.publishedJobList); 
  // // app.get("/api/admin-user-list",admin_user.adminUserList);
  // app.post("/api/open-job-list-byid",authroute,job_publish.openJobListbyid);
  // app.post("/api/save-open-jobs",authroute,job_publish.saveopenjobs);
  // app.post("/api/publish-open-Job",authroute,job_publish.publishopenJob);
  // app.post("/api/saved-open-Jobbyid",authroute,job_publish.get_saved_jobs_byid);
  // app.post("/api/published-open-Jobbyid",authroute,job_publish.get_published_jobs_byid);
  // app.post("/api/get-unpublished-jobs",authroute,job_unpublish.getunpublished_jobs);
  // app.post("/api/get-multiple-qualification",master.getQualification);
  // app.post("/api/get-multiple-subroles",master.getSubRoles);
  // app.post("/api/unpublish-to-open",authroute,job_unpublish.unpublish_to_open);
  // app.post("/api/job-keyword-search",authroute,job_publish.job_keyword_search);


  // CI APIS

  app.post("/api/get-roles", authroute, crm.get_roles)
  app.post("/api/getUser-Departments", authroute, crm.getUserDepartments)
  // app.post("/api/get-all-users",authroute,crm.getall_users)
  // app.post("/api/get-MulitipleProfiles",authroute,crm.getMulitipleProfiles)
  app.post("/api/defaultLogout", authroute, crm.default_Logout);
  app.post("/api/getallroles", authroute, crm.get_allroles);
  app.post("/api/getAllProfileLists", authroute, crm.get_AllProfileLists);
  app.post("/api/getAllModuleListsforPrevilage", authroute, crm.get_AllModuleListsforPrevilage);
  app.post("/api/getModuletype", authroute, crm.get_Moduletype);
  app.post("/api/getAllModuleLists", authroute, crm.get_AllModuleLists);
  app.post("/api/getcountrylists", authroute, crm.get_countrylists);
  app.post("/api/getUserTypes", authroute, crm.get_UserTypes);
  app.post("/api/getDefaultUrl", authroute, crm.get_DefaultUrl);
  app.post("/api/getleadtype", authroute, crm.get_leadtype);
  app.post("/api/getDesignation", authroute, crm.get_Designation);
  app.post("/api/get-userbyid", authroute, crm.get_user_byid);
  app.post("/api/get-statesbyCountryID", authroute, crm.get_states_by_CountryID);
  app.post("/api/saveuser", authroute, crm.save_user);
  // app.post("/api/saveRoleProfile", authroute, crm.save_RoleProfile);
  app.post("/api/getRoleProfile-byName", authroute, crm.getRoleProfile_byName);
  app.post("/api/savePrivileges", authroute, crm.save_Privileges);
  app.post("/api/getPrivilegeModuleProfile", authroute, crm.get_PrivilegeModuleProfile);
  app.post("/api/getParentModule", authroute, crm.get_ParentModule);
  app.post("/api/getAllModuleListsFilter", authroute, crm.get_AllModuleListsFilter);
  app.post("/api/getPrivilegeModuleProfile", authroute, crm.get_PrivilegeModuleProfile);
  // CMS API

  app.post("/api/userChangerPassword", authroute, cms.userChangerPassword);
  app.post("/api/getProfileById", authroute, cms.getProfileById); 
  app.post("/api/checkAccessRight", authroute, cms.checkAccessRight);
  app.post("/api/getModuleByModuleId", authroute, cms.getModuleByModuleId);
  // app.post("/api/resetPassword", authroute, cms.resetPassword);
  app.post("/api/getUserDetailsByUserId", authroute, cms.getUserDetailsByUserId);
  app.post("/api/saveModule", authroute, cms.saveModule);
  
  app.post("/api/user_login",  cms.user_login);
  
}