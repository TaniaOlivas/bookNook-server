const { DataTypes } = require('sequelize');
const db = require('../db');

const Comments = db.define('comment', {
  content: {
    type: DataTypes.STRING(1000),
    allowNull: false,
  },
});

module.exports = Comments;
