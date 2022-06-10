const bcrypt = require('bcryptjs');
const dateformat = require('date-and-time');
let curdate = new Date();
let curdate_sys = dateformat.format(curdate, 'YYYY-MM-DD HH:mm:ss');
let curdate_dmy = dateformat.format(curdate, 'DD/MM/YYYY');

const utils = {
    bcrypt, curdate_sys, curdate_dmy
}

module.exports = utils;