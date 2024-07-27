import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(
    'bachelor-blog', 
    'root', 
    'root',
    {
        dialect: 'mysql',
        host: 'localhost',
    }
);

export default sequelize;