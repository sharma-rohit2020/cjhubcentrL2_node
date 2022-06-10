const CryptoJS = require('crypto-js');
const Securitykey = 'cjportal2022abcd';

// encrypt
function encrypt(plainText) {
  let plainText_txt = JSON.stringify(plainText);
  let encodedWord = CryptoJS.enc.Utf8.parse(Securitykey);
  conversionEncryptOutput =
    CryptoJS.AES.encrypt(plainText_txt, encodedWord,
      { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 }).toString();
  return conversionEncryptOutput;
}
// decrypt
function decrypt(encryptText) {
  let encodedWord = CryptoJS.enc.Utf8.parse(Securitykey);
  let conversionDecryptOutput = CryptoJS.AES.decrypt(encryptText, encodedWord,
    { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 }).toString(CryptoJS.enc.Utf8);
    return JSON.parse(conversionDecryptOutput);
  
}

module.exports = {
  decrypt,
  encrypt
};