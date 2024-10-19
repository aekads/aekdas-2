const { Sequelize, DataTypes } = require('sequelize');
const moment = require('moment-timezone');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Set up the Sequelize instance with environment variables
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    port: process.env.DB_PORT
});

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

const logData = async () => {
    try {
        const logs = await Log.findAll({
            order: [['createdAt', 'DESC']]
        });

        const logsWithIST = logs.map(log => ({
            ...log.dataValues,
            createdAt: moment(log.createdAt).tz('Asia/Kolkata').format('HH:mm:ss DD-MM-YYYY')
        }));

        console.log('logsWithIST', logsWithIST);
        return logsWithIST;
    } catch (error) {
        console.error('Error fetching logs:', error);
    }
};

module.exports = { Log, logData };
