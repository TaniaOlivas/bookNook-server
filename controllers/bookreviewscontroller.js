const router = require('express').Router();
const { models } = require('../models');
const { validateSession } = require('../middleware');

router.post('/create', validateSession, async (req, res) => {
  const { title, genre, pageLength, picture, content, rating } =
    req.body.review;

  try {
    await models.ReviewsModel.create({
      title: title,
      genre: genre,
      pageLength: pageLength,
      picture: picture,
      content: content,
      rating: rating,
      userId: req.user.id,
    }).then((review) => {
      res.status(201).json({
        review: review,
        message: 'Review created',
      });
    });
  } catch (err) {
    res.status(500).json({
      error: `Failed to create review: ${err}`,
    });
  }
});

router.get('/all', async (req, res) => {
  try {
    const allReviews = await models.ReviewsModel.findAll();
    res.status(200).json(allReviews);
  } catch (err) {
    res.status(500).json({
      error: err,
    });
  }
});

router.get('/:id', validateSession, async (req, res) => {
  const { id } = req.user;
  try {
    const bookReviews = await models.ReviewsModel.findAll({
      where: {
        userId: id,
      },
    });
    res.status(200).json(bookReviews);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

router.get('/genre/:genre', validateSession, async (req, res) => {
  const { genre } = req.params;
  try {
    const genreResults = await models.ReviewsModel.findAll({
      where: { genre: genre },
    });
    res.status(200).json(genreResults);
  } catch (err) {
    res.status(500).json({
      error: err,
    });
  }
});

router.get('/title/:title', validateSession, async (req, res) => {
  const { title } = req.params;
  try {
    const results = await models.ReviewsModel.findAll({
      where: { title: title },
    });
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({
      error: err,
    });
  }
});

router.put('/:id', validateSession, async (req, res) => {
  const { title, genre, pageLength, picture, content, rating } =
    req.body.review;

  try {
    await models.ReviewsModel.update(
      { title, genre, pageLength, picture, content, rating },
      { where: { id: req.params.id }, returning: true }
    ).then((result) => {
      res.status(200).json({
        message: 'Review successfully updated',
        updatedReview: result,
      });
    });
  } catch (err) {
    res.status(500).json({
      error: `Failed to update review: ${err}`,
    });
  }
});

router.delete('/:id', validateSession, async (req, res) => {
  const userId = req.user.id;
  const bookReviewId = req.params.id;

  try {
    const query = {
      where: {
        id: bookReviewId,
        userId: userId,
      },
    };

    const deletedReview = await models.ReviewsModel.destroy(query);

    if (deletedReview) {
      req.user.id = deletedReview;
      res.status(200).json({
        message: 'Book Review Removed',
      });
    } else {
      res.status(403).json({
        message: 'Forbidden',
      });
    }
  } catch (err) {
    res.status(500).json({ error: err });
  }
});
module.exports = router;
