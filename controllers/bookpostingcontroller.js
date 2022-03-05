const router = require('express').Router();
const { models } = require('../models');
const { validateSession } = require('../middleware');
const { Op } = require('@sequelize/core');

router.post('/publish', validateSession, async (req, res) => {
  const { title, genre, pageLength, picture } = req.body;

  if (req.user.userType !== 'Author') {
    res.send('Not Authorized');
    return;
  } else {
    try {
      await models.PostingsModel.create({
        title: title,
        genre: genre,
        pageLength: pageLength,
        picture: picture,
        userId: req.user.id,
      }).then((post) => {
        res.status(201).json({
          post: post,
          message: 'Post created',
        });
      });
    } catch (err) {
      res.status(500).json({
        error: `Failed to create post: ${err}`,
      });
    }
  }
});

router.get('/all/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const results = await models.PostingsModel.findAll({
      where: { userId: userId },
    });
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({
      error: err,
    });
  }
});

router.get('/title/:title', validateSession, async (req, res) => {
  const { title } = req.params;
  try {
    const results = await models.PostingsModel.findAll({
      where: { title: { [Op.substring]: title } },
    });
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

router.get('/genre/:genre', validateSession, async (req, res) => {
  const { genre } = req.params;
  try {
    const genreResults = await models.PostingsModel.findAll({
      where: { genre: { [Op.substring]: genre } },
    });
    res.status(200).json(genreResults);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

router.put('/:id', validateSession, async (req, res) => {
  const { title, genre, pageLength, picture } = req.body;
  if (req.user.userType !== 'Author') {
    res.send('Not Authorized');
    return;
  } else {
    try {
      await models.PostingsModel.update(
        { title, genre, pageLength, picture },
        { where: { id: req.params.id }, returning: true }
      ).then((updateResult) => {
        res.status(200).json({
          message: 'Post successfully updated',
          updatedPost: updateResult,
        });
      });
    } catch (err) {
      res.status(500).json({
        error: `Failed to update post: ${err}`,
      });
    }
  }
});

router.delete('/:id', validateSession, async (req, res) => {
  const userId = req.user.id;
  const bookPostingId = req.params.id;
  if (req.user.userType !== 'Author') {
    res.send('Not Authorized');
    return;
  } else {
    try {
      const query = {
        where: {
          id: bookPostingId,
          userId: userId,
        },
      };

      const deletedPost = await models.PostingsModel.destroy(query);

      if (deletedPost) {
        req.user.id = deletedPost;
        res.status(200).json({
          message: 'Book Post Removed',
        });
      } else {
        res.status(403).json({
          message: 'Forbidden',
        });
      }
    } catch (err) {
      res.status(500).json({ error: err });
    }
  }
});
module.exports = router;
