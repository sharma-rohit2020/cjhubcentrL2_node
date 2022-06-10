const { application } = require("express");

module.exports=(sequelize,DataTypes)=>{

    const Users=sequelize.define("users",
    {
        name:DataTypes.STRING,
        email:
        {
           type: DataTypes.STRING,
           defaultValue:"test@gmail.com"
        },
        gender:DataTypes.STRING,
        salary:DataTypes.STRING
    },
    {
        // timestamps:false,
        createdAt:false,
        updatedAt:false
        
    });
}
