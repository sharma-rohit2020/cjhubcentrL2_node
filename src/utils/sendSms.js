const { response } = require("express");
var request = require("request");
const entityid = "1001560220000013663";
const CJRegn = "CJRegn";
const CTjobs = "CTjobs";

exports.sendSms = async (sms) => {
    try {
        console.log(sms);
        var mobile_no=sms['mobile_no'];
        var smsBody = sms['sms_body'];
        var tempid = sms['template_id'];
        var url = "http://202.143.96.245/submitsms.jsp?user=akalinfo&key=218da1a072XX&mobile=+91" + mobile_no + "&message=" + smsBody + "&senderid=" + CJRegn + "&accusage=1&&entityid=" + entityid + "&tempid=" + tempid;
        // return url;
        // console.log(url);
        
        if(mobile_no==undefined || mobile_no==''){
            return false;
        }
        await request({ url: url.toString() }, (error, response) => {
            console.log(error);
            return response;
        })
    }
    catch (error) {

        return error;
    }

}

// 202.143.96.245/submitsms.jsp?user=akalinfo&key=218da1a072XX&mobile=+917210881453&message=8854%20is%20your%20Contract%20Jobs%20verification%20code.&senderid=CJRegn&accusage=1&&entityid=1001560220000013663&tempid=8854"
// 202.143.96.245/submitsms.jsp?user=akalinfo&key=218da1a072XX&mobile=+917210881453&message=3906 is your Contract Jobs verification code.&senderid=CJRegn&accusage=1&&entityid=1001560220000013663&tempid=3906

exports.applysendsms=async(sms)=>{
    try{
        console.log(sms);
        var mobile_no=sms['mobile_no'];
        var smsBody=sms['sms_body'];
        var tempid=sms['template_id']
        var url = "http://202.143.96.245/submitsms.jsp?user=akalinfo&key=218da1a072XX&mobile=+91" + mobile_no + "&message=" + smsBody + "&senderid=" + CTjobs + "&accusage=1&&entityid=" + entityid + "&tempid=" + tempid;
        // console.log(url);
        if(mobile_no==undefined || mobile_no==''){
            return false;
        }
        await request({url:url.toString()},(error,response)=>{
            console.log(error);
            return response;
        })
    }
    catch(error){
        return error;
    }
};