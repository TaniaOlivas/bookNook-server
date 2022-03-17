const router = require('express').Router();
const { models } = require('../models');
const { validateSession } = require('../middleware');

router.post('/create', validateSession, async (req, res) => {
  const { title, author, genre, pageLength, picture } = req.body;

  try {
    await models.BookModel.create({
      title: title,
      author: author,
      genre: genre,
      pageLength: pageLength,
      picture: picture,
      userId: req.user.id,
    }).then((book) => {
      res.status(201).json({
        book: book,
        message: 'Book Added To List',
      });
    });
  } catch (err) {
    res.status(500).json({
      error: `Failed to add book: ${err}`,
    });
  }
});

router.get('/all', async (req, res) => {
  try {
    const allBooks = await models.BookModel.findAll();
    res.status(200).json(allBooks);
  } catch (err) {
    res.status(500).json({
      error: err,
    });
  }
});

router.get('/mine', validateSession, async (req, res) => {
  const { id } = req.user;
  try {
    const bookList = await models.BookModel.findAll({
      where: {
        userId: id,
      },
    });
    res.status(200).json(bookList);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

router.put('/:id', validateSession, async (req, res) => {
  const { title, author, genre, pageLength, picture } = req.body;
  try {
    await models.BookModel.update(
      { title, author, genre, pageLength, picture },
      { where: { id: req.params.id }, returning: true }
    ).then((result) => {
      res.status(200).json({
        message: 'List successfully updated',
        updatedBook: result,
      });
    });
  } catch (err) {
    res.status(500).json({
      error: `Failed to update list: ${err}`,
    });
  }
});

router.delete('/:id', validateSession, async (req, res) => {
  const userId = req.user.id;
  const bookListId = req.params.id;

  try {
    const query = {
      where: {
        id: bookListId,
        userId: userId,
      },
    };

    const deletedPost = await models.BookModel.destroy(query);

    if (deletedPost) {
      req.user.id = deletedPost;
      res.status(200).json({
        message: 'Listing Removed',
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
