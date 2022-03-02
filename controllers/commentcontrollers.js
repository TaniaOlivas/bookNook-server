const router = require('express').Router();
const { validateSession } = require('../middleware');
const { models } = require('../models');

router.post('/comment', validateSession, async (req, res) => {
  const { content, bookReviewId } = req.body;
  const userId = req.user.id;

  try {
    await models.CommentsModel.create({
      content: content,
      bookReviewId: bookReviewId,
      userId: userId,
    }).then((comment) => {
      res.status(201).json({
        comment: comment,
        message: 'Comment created',
      });
    });
  } catch (err) {
    res.status(500).json({ message: `Failed to create comment: ${err}` });
  }
});

router.get('/:bookReviewId', async (req, res) => {
  const { bookReviewId } = req.params;
  try {
    const allComments = await models.CommentsModel.findAll({
      where: {
        bookReviewId: bookReviewId,
      },
    });
    res.status(200).json(allComments);
  } catch (err) {
    res.status(500).json({
      message: `${err}`,
    });
  }
});

router.put('/:id', validateSession, async (req, res) => {
  const { content } = req.body;

  try {
    await models.CommentsModel.update(
      { content },
      { where: { id: req.params.id }, returning: true }
    ).then((updateComment) => {
      res.status(200).json({
        message: 'Comment successfully updated',
        updatedComment: updateComment,
      });
    });
  } catch (err) {
    res.status(500).json({
      error: `Failed to update comment: ${err}`,
    });
  }
});

router.delete('/:id', validateSession, async (req, res) => {
  const userId = req.user.id;
  const commentId = req.params.id;

  try {
    const query = {
      where: {
        id: commentId,
        userId: userId,
      },
    };

    const deletedComment = await models.CommentsModel.destroy(query);

    if (deletedComment) {
      req.user.id = deletedComment;
      res.status(200).json({
        message: 'Comment Removed',
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
