const { DataTypes } = require('sequelize');
const db = require('../db');

const BookPostings = db.define('bookPosting', {
  title: {
    type: DataTypes.STRING(),
    allowNull: false,
  },
  genre: {
    type: DataTypes.STRING(),
    allowNull: false,
  },
  pageLength: {
    type: DataTypes.INTEGER(),
    allowNull: false,
  },
  picture: {
    type: DataTypes.STRING(1000),
    allowNull: true,
  },
});

module.exports = BookPostings;
