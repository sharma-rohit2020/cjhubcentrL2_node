const {OAuth2Client} = require('google-auth-library');
const CLIENT_ID= process.env.GOOGLE_CLIENT_ID //'831273480072-66nrq3bkag8d87omo176dginbji9oavd.apps.googleusercontent.com';
const CLIENT_SECRET=process.env.GOOGLE_CLIENT_SECRET //'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';


const client=new OAuth2Client(CLIENT_ID);

exports.verify=async(token)=> {
    try{
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
            // Or, if multiple clients access the backend:
            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
        });
        
        const payload = ticket.getPayload();
        const userid = payload['sub'];
        // If request specified a G Suite domain:
        // const domain = payload['hd'];
        if(payload){        
            return payload;
        }else{        
            return "Invalid Token";
        }
    }catch(error){
        return error;
    }
    
}
 //verify().catch(console.error);
  
  /* const verifyToken = {
    verify: verify(token)
  }; */

//   module.exports = verifyToken;