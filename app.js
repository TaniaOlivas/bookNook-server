require('dotenv').config();

const Express = require('express');
const app = Express();

const dbConnection = require('./db');
const controllers = require('./controllers');
const middleware = require('./middleware');

app.use(Express.json());
app.use(middleware.CORS);

app.use('/user', controllers.userscontroller);
app.use('/post', controllers.bookpostingscontroller);
app.use('/review', controllers.bookreviewscontroller);
app.use('/comment', controllers.commentscontroller);

dbConnection
  .authenticate()
  .then(() => dbConnection.sync())
  .then(() => {
    app.listen(process.env.PORT, () =>
      console.log(`[Server]: App is listening on ${process.env.PORT}`)
    );
  })
  .catch((err) => {
    console.log(`[Server] has crashed: ${err}`);
  });
