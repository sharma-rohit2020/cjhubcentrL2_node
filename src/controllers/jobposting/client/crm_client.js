const axios = require('axios');
const domain_name=process.env.DOMAIN_NAME;
const job_list_api=process.env.JOB_LIST_API;
const job_list_acknowledgement=process.env.JOB_LIST_ACKNOWLEDGEMENT;
/* const data = {
    name: 'John Doe',
    job: 'Content Writer'
}; */
var return_value;
const data={};
exports.job_list = async () => {
    try{
        var data_info=[];
    
        await axios.post(domain_name+job_list_api, data)
        .then((res) => {  
            this.return_value=res.data
            
        }).catch((err) => {
            return error;
        });
        return this.return_value;

    }catch(error){
        return error;
    }
    
}
exports.job_list_acknowledgement = async (transaction_id) => {
    try{
        var data_info=transaction_id;
        console.log(transaction_id);
        await axios.post(domain_name+job_list_acknowledgement, data_info)
        .then((res) => {  
            this.return_value=res.data
            //console.log(typeof this.return_value);
        }).catch((err) => {
            return error;
        });
        return this.return_value;

    }catch(error){
        return error;
    }
    
}