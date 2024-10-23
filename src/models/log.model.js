const { Sequelize, DataTypes } = require('sequelize');
const moment = require('moment-timezone');
const sequelize = new Sequelize('dbzvtfeophlfnr', 'u3m7grklvtlo6', 'AekAds@24', {
    host: '35.209.89.182',
    dialect: 'postgres'
});

const db = require("../config/dbConnection");

const Log = sequelize.define('Log', {
    action: {
      type: DataTypes.STRING,
      allowNull: false
    },
    message: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ip: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });


  const logData=  async () => {
    try {
      const logs = await Log.findAll({
        order: [['createdAt', 'DESC']]
      });

      const logsWithIST = logs.map(log => ({
        ...log.dataValues,
        createdAt: moment(log.createdAt).tz('Asia/Kolkata').format('HH:mm:ss DD-MM-YYYY')
      }));
      
      // console.log('logswithISt',logsWithIST);
     return logsWithIST;
    } catch (error) {
      console.error('Error fetching logs:', error);
      
    
    }
  };
module.exports={Log,logData};