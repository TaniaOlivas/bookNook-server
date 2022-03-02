const router = require('express').Router();
const { models } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UniqueConstraintError } = require('sequelize/lib/errors');

router.post('/register', async (req, res) => {
  const { firstName, lastName, email, password, userType } = req.body;
  try {
    await models.UserModel.create({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: bcrypt.hashSync(password, 10),
      userType: userType,
    }).then((user) => {
      let token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
        expiresIn: 60 * 60 * 24,
      });
      res.status(201).json({
        user: user,
        message: 'User created',
        token: token,
      });
    });
  } catch (err) {
    if (err instanceof UniqueConstraintError) {
      res.status(409).json({
        message: 'Email already in use',
      });
    } else {
      res.status(500).json({
        error: `Failed to register user: ${err}`,
      });
    }
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    await models.UserModel.findOne({
      where: {
        email: email,
      },
    }).then((user) => {
      if (user) {
        bcrypt.compare(password, user.password, (err, matches) => {
          if (matches) {
            let token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
              expiresIn: 60 * 60 * 24,
            });
            res.json({
              user: user,
              message: 'Logged in',
              token: token,
            });
          } else {
            res.status(502).send({
              error: 'Bad gateway',
            });
          }
        });
      } else {
        res.status(500).send({
          error: 'Failed to authenticate',
        });
      }
    });
  } catch (err) {
    res.status(501).send({
      error: 'Server does not support this functionality',
    });
  }
});

router.get('/userinfo', async (req, res) => {
  try {
    await models.UserModel.findAll({
      include: [
        {
          model: models.ReviewsModel,
          include: [
            {
              model: models.CommentsModel,
            },
          ],
        },
      ],
    }).then((users) => {
      res.status(200).json({
        users: users,
      });
    });
  } catch (err) {
    res.status(500).json({
      error: `Failed to retrieve users: ${err}`,
    });
  }
});

module.exports = router;
