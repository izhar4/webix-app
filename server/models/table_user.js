'use strict';
module.exports = function(sequelize, DataTypes) {
  var table_User = sequelize.define('table_User', {
    UserID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    subscriber_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    first_name:{
      type: DataTypes.STRING(50)
    },
    last_name:{
      type: DataTypes.STRING(50),
      allowNull: false
    },
    role:{
      type: DataTypes.STRING(5),
      allowNull: false
    },
    gender:{
      type: DataTypes.STRING(5),
      allowNull: false
    },
    address_1:{
      type: DataTypes.STRING(50)
    },
    address_2:{
      type: DataTypes.STRING(100)
    },
    city:{
      type: DataTypes.STRING(50)
    },
    state:{
      type: DataTypes.STRING(50)
    },
    zipcode:{
      type: DataTypes.STRING(10)
    },
    email:{
      type: DataTypes.STRING(65535)
    },
    phone:{
     type: DataTypes.STRING(15),
     allowNull: false
    },
    updated_by:{
      type: DataTypes.STRING(15),
      allowNull: false
    },
    password:{
      type: DataTypes.STRING(15),
      allowNull: true
    },
    updated_at:{
    type:DataTypes.DATE,
    allowNull:false,
    defaultValue: DataTypes.NOW
    }
  },{
      classMethods: {
        associate: function(models) {
          table_User.hasMany(models.table_Enrollment,{foreignKey : 'UserID', onDelete: 'CASCADE'});
          table_User.hasMany(models.table_Correspondence,{foreignKey : 'UserID', onDelete: 'CASCADE'});
          table_User.hasOne(models.table_ClaimsData,{foreignKey : 'UserID', onDelete: 'CASCADE'});
          table_User.hasMany(models.table_ClaimsDetail,{foreignKey : 'UserID', onDelete: 'CASCADE'});
          table_User.belongsToMany(models.table_PCP, { through: models.table_AssignPCP ,onDelete: 'CASCADE', foreignKey: 'UserID', otherKey: 'PCPID'})
        }
      }
    }
  );
  return table_User;
};
