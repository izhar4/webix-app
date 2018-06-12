'use strict';
module.exports = function(sequelize, DataTypes) {
  var table_PCP = sequelize.define('table_PCP', {
    PCPID:{
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    pcp_first_name:{
      type: DataTypes.STRING(50)
    },
    pcp_last_name:{
      type: DataTypes.STRING(50),
      allowNull: false
    },
    provider_type1:{
      type: DataTypes.STRING(5),
      allowNull: false
    },
    provider_type2:{
      type: DataTypes.STRING(5),
      allowNull: false
    },
    address1:{
      type: DataTypes.STRING(50)
    },
    address2:{
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
      allowNull:false
    },
    updated_by:{
      type: DataTypes.STRING(15),
      allowNull:false
    },
    dateFrom:{
      type:DataTypes.DATE,
      allowNull:false,
      defaultValue: DataTypes.NOW
    },
    dateTo:{
      type:DataTypes.DATE
    },
    updated_at:{
      type:DataTypes.DATE,
      allowNull:false,
      defaultValue: DataTypes.NOW
    },
    notes:{
      type: DataTypes.STRING(65535)
    }
  },{
      classMethods: {
        associate: function(models) {
          table_PCP.belongsTo(models.table_User, { through: models.table_AssignPCP, onDelete: 'CASCADE', foreignKey: 'PCPID', otherKey: 'UserID' })
        }
      }
    }
  )
  return table_PCP;
};
