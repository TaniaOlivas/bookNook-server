# BookNook Server

BookNook is an app that is primarily made for book lovers. The main function of the app is to complie a reading list and share books reviews with other users. This portion is the server side of the application, the client side can be found [here](https://github.com/TaniaOlivas/booknook-client). It has been fully deployed using Heroku and can be found [here](https://tdo-booknook-client.herokuapp.com/home).

## Description

 The app is set up for two user-functionality: an Author and a User. The application has full CRUD and associations between tables in the database so the information can interact and be individualized per user. There are several endpoints for each user which include POSTs, GETs, UPDATEs, and DELETEs for different parts of the tables. The Users have the ability to POST book reviews of books they have read and the Authors have the ability to POST their own books into the database. Both users have a "Reading List" page where they can GET books and POST them to a reading list through either a search through the database for books from Authors on the app, or through the Google Books API. From this list, both users have the ability to POST a review of the book once they finish reading it. If the book is not on their reading list, they also have the option to manually enter the book information in the review tab. The book reviews are then posted on a feed through a GET request that all users are able to scroll through, read and comment on. All comments are associated with the user and the post they comment on. The original user is the only one who can either UPDATE or DELETE their own comments.

 ## Tech Used
 
 This project was done using the PERN full-stack and the server side utilized Express, Node.js and PostgreSQL for the database. Tokenization and bcrypt were both used to keep information secure and individualized per user.
