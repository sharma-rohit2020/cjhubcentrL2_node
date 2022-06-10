const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const key = 'vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3';
const iv = crypto.randomBytes(16);

function encrypt(text) {
  let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  //return encrypted.toString('hex');
  return iv.toString('hex') + ':' + encrypted.toString('hex');
 }
 
 function decrypt(text) {
   //console.log(text);
   let textParts = text.split(':');
  let iv = Buffer.from(textParts.shift(), 'hex');
  //let encryptedText = Buffer.from(text.encryptedData, 'hex');
  let encryptedText = Buffer.from(textParts.join(':'), 'hex');
  let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
 }
module.exports = {
  encrypt,
  decrypt
};