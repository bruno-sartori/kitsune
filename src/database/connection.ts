import { Sequelize } from 'sequelize';

let sequelizeConnection: Sequelize = new Sequelize(process.env.DB_DATABASE!, process.env.DB_USERNAME!, process.env.DB_PASSWORD!, {
  host: process.env.DB_HOST!,
  dialect: 'mysql',
  port: parseInt(process.env.DB_PORT!, 10), 
});

export default sequelizeConnection;
