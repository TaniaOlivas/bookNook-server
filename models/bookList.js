const { DataTypes } = require('sequelize');
const db = require('../db');

const BookList = db.define('bookList', {
  title: {
    type: DataTypes.STRING(),
    allowNull: false,
  },
  author: {
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

module.exports = BookList;
