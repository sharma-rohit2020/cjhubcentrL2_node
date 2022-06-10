const axios =require('axios');
const client_id="359970276018042";
const client_secret="37cfdc0ae77fa35822ab060fce7a0efa";
const redirect_uri="localhost:4000"

exports.getAccessTokenFromCode=async (code)=> {
  const { data } = await axios({
    url: 'https://graph.facebook.com/v4.0/oauth/access_token',
    method: 'get',
    params: {
      client_id: client_id,
      client_secret: client_secret,
      redirect_uri: redirect_uri,
      code,
    },
  });
  console.log(data); // { access_token, token_type, expires_in }
  return data.access_token;
};