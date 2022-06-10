 const { encrypt } = require('../middleware/crypt');
const db = require('./index');
// userChangerPassword

async function checkCurrentPassword(cpassword) {
    let data = [];
    await db.sequelize.query('select * from admin_login where password = ?', {
        replacements: [cpassword]
    }, {
        type: db.sequelize.QueryTypes.SELECT
    }).then(temp => {
        data = JSON.parse(JSON.stringify(temp));
    })
    return data;
}
async function update_user(rowid, param) {
    let data = [];
    await db.sequelize.query('Update admin_login set password=?, is_passwordchange=? where admin_id=? ', {
        replacements: [param.password, param.is_passwordchange, rowid]
    }).then(temp => {
        data = temp;
    })
    return data;
}

//getprofileby id

    
    async function get_profiles_by_id(rowid) {
            let data = '';
            await db.sequelize.query('select * from profile where profileid=?', {
                replacements: [rowid]
            }, {
                type: db.sequelize.QueryTypes.SELECT
            }).then(temp => {
                data = temp[0];
                // console.log(data)
            })
            return data;
        }
// check access right
async function checkUserRights(user_id, module_name) {
    let data = [];
    await db.sequelize.query('select * from get_access_right(?,?)', {
        replacements: [user_id, module_name]
    }, {
        type: db.sequelize.QueryTypes.SELECT
    }).then(temp => {
        data = JSON.parse(JSON.stringify(temp[0]));
    })

    return data;
}

// getmodulebyid

async function getmodulebyid(rowid) {
    // let data;
    await db.sequelize.query('select M.moduleid,M.modulename,M.linkname,M.parentid,M.moduletype from modules M where M.moduleid=?', {
        replacements: [rowid]
    }, {
        type: db.sequelize.QueryTypes.SELECT
    }).then(temp => {
        data=temp
        // data =  JSON.parse(JSON.stringify(temp));
        // console.log('data value',typeof(data))
    })
    // console.log(data[0]);
    return data;
}


// getUserDetailsByUserId
async function checkTime(id) {
    let data = '';
    await db.sequelize.query("select * from public.usp_isresetlinkactive(?)", {
        replacements: [id]
    }, {
        type: db.sequelize.QueryTypes.SELECT
    })
        .then(temp => {
            data = JSON.parse(JSON.stringify(temp));
            // console.log(data[0][0].usp_isresetlinkactive)
        })
    return data[0];
}
async function get_user_by_id(rowid) {
    let data = '';
    await db.sequelize.query('select * from admin_login where admin_id= ?', {
        replacements: [rowid]
    }, {
        type: db.sequelize.QueryTypes.SELECT
    }).then(temp => {
        data = JSON.parse(JSON.stringify(temp));
    })
    return data[0];
}

// save module
async function update_module(rowid, param) {
    console.log(rowid);
    let data = [];
    db.sequelize.query('update modules set moduletype=?,parentid=?,modulename=?,linkname=?, modifiedby=?,modifiedon=? where moduleid=?', {
        replacements: [param.moduletype, param.parentid, param.modulename, param.linkname, param.modifiedby, param.modifiedon, rowid]
    }).then(temp => {
        data = temp;
    })
    return data;

}





module.exports = { update_module, checkUserRights, getmodulebyid, get_profiles_by_id, update_user, checkCurrentPassword, checkTime, get_user_by_id };