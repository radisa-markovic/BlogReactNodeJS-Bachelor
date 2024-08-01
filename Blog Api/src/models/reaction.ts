import { DataTypes } from 'sequelize';

import sequelize from "../util/database";

const Reaction = sequelize.define('reaction', {
    id: {
        type: DataTypes.TINYINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    /**
     * like -> 0
     * dislike -> 1
     * whateverElse -> 2
    */
    code: {
        type: DataTypes.TINYINT,
        allowNull: false,
        unique: true
    }
});

export default Reaction;