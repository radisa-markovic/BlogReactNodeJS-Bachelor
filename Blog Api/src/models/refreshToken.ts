import { DataTypes, ModelDefined, Optional } from "sequelize";
import sequelize from "../util/database";

const refreshToken = sequelize.define('refreshToken', {
    id: {
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        type: DataTypes.INTEGER
    },
    value: {
        type: DataTypes.STRING,
        allowNull: false
    },
    isUsed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
});

export default refreshToken;