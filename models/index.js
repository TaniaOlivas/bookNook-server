const db = require('../db');

const UserModel = require('./user');
const PostingsModel = require('./bookPosting');
const ReviewsModel = require('./bookReview');
const CommentsModel = require('./comments');

UserModel.hasMany(ReviewsModel);
UserModel.hasMany(CommentsModel);
UserModel.hasMany(PostingsModel);

ReviewsModel.belongsTo(UserModel);
ReviewsModel.hasMany(CommentsModel);

PostingsModel.belongsTo(UserModel);

CommentsModel.belongsTo(ReviewsModel);

module.exports = {
  dbConnection: db,
  models: {
    UserModel,
    PostingsModel,
    ReviewsModel,
    CommentsModel,
  },
};
