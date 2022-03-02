const { DataTypes } = require('sequelize');
const db = require('../db');

const BookReviews = db.define('bookReview', {
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
  content: {
    type: DataTypes.STRING(1000),
    allowNull: false,
  },
  rating: {
    type: DataTypes.STRING(),
    allowNull: false,
  },
});

module.exports = BookReviews;
