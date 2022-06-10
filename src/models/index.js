// import data from .env file
require('dotenv').config();
const {Sequelize,DataTypes} = require('sequelize');
const connetstring = `postgres://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DBNAME}`;
//const sequelize = new Sequelize(connetstring, { max: 5, min: 0, acquire: 30000, idle: 10000 });
const sequelize = new Sequelize(connetstring, {dialect: 'postgres',
dialectOptions: {
  ssl: true
}, max: 20, min: 0, acquire: 30000, idle: 10000 });
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// link with Models
/*db.users=require('./users')(sequelize,DataTypes);

db.sequelize.sync({force:false})
.then(()=>{
    console.log('tables sync');
})
;*/


// export to other files
module.exports = db;

/* { max: 5, min: 0, acquire: 30000, idle: 10000}
Never have more than five open connections (max: 5)
At a minimum, have zero open connections/maintain no minimum number of connections (min: 0)
Remove a connection from the pool after the connection has been idle (not been used) for 10 seconds (idle: 10000)
*/