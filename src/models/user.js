'use strict';
const {
  Model,
  SequelizeScopeError
} = require('sequelize');

const {SALT} = require('../config/serverConfig');
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // this.belongsToMany(models.Role,{
      //   through : "User_Roles"
      // })
    }
  }
  User.init({
    email: {
      type : DataTypes.STRING,
      unique : true,
      allowNull : false,
      validate : {
        isEmail : true
      }
    },
    password: {
      type : DataTypes.STRING,
      allowNull : false,
      validate : {
        len : [3,50]
      }
    },
    role : {
      type : DataTypes.ENUM("ADMIN","NORMAL","BLOCKED"),
      defaultValue : "NORMAL",
      allowNull : false
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  //synchronous version
  // User.beforeCreate( (user) => {
  //   //has sync is already as async and we are not using await here so we can use hashSync
  //    const encryptedPassword =  bcrypt.hashSync(user.password , SALT);
  //    user.password = encryptedPassword
  // })

  // Use the async version: bcrypt.hash
  //Node.js offloads the heavy math to its internal thread pool (libuv). 
  // The main thread stays free to handle other incoming requests.
  //  When the hashing is done, it "calls back" and finishes the save
  User.beforeCreate(async (user) => {
    // We use the async 'hash' function, so we MUST 'await' it
    const encryptedPassword = await bcrypt.hash(user.password, SALT); 
    user.password = encryptedPassword;
  });

  return User;
};