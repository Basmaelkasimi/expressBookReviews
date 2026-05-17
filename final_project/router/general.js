const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


// Register new user
public_users.post("/register", (req, res) => {

  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({
      message: "Username and password required"
    });
  }

  let userExists = users.some(
    (user) => user.username === username
  );

  if (userExists) {
    return res.status(404).json({
      message: "User already exists"
    });
  }

  users.push({
    username: username,
    password: password
  });

  return res.status(200).json({
    message: "User successfully registered"
  });
});


// Get all books
public_users.get('/', function (req, res) {

  return res.status(200).json(books);

});


// Get by ISBN
public_users.get('/isbn/:isbn', function (req, res) {

  const isbn = req.params.isbn;

  return res.status(200).json(books[isbn]);

});


// Get by author
public_users.get('/author/:author', function (req, res) {

  const author = req.params.author;

  let filteredBooks = Object.values(books).filter(
    (book) => book.author === author
  );

  return res.status(200).json(filteredBooks);

});


// Get by title
public_users.get('/title/:title', function (req, res) {

  const title = req.params.title;

  let filteredBooks = Object.values(books).filter(
    (book) => book.title === title
  );

  return res.status(200).json(filteredBooks);

});


// Get review
public_users.get('/review/:isbn', function (req, res) {

  const isbn = req.params.isbn;

  return res.status(200).json(
    books[isbn].reviews
  );

});

module.exports.general = public_users;