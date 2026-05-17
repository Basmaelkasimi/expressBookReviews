const express = require('express');
const axios = require('axios');

let books = require("./booksdb.js");
let users = require("./auth_users.js").users;

const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(404).json({ message: "Username and password required" });
  }

  if (users.some(user => user.username === username)) {
    return res.status(404).json({ message: "User already exists" });
  }

  users.push({ username, password });

  return res.status(200).json({ message: "User successfully registered" });
});

// Get all books
public_users.get('/', async (req, res) => {
  return res.status(200).json(books);
});


// Get book by ISBN using async/await with Axios
// Search by ISBN using Promises with Axios
public_users.get('/isbn/:isbn', (req, res) => {
  axios.get('http://localhost:5000/')
    .then(response => {
      const book = response.data[req.params.isbn];

      if (book) {
        return res.status(200).json(book);
      }

      return res.status(404).json({ message: "Book not found" });
    })
    .catch(error => {
      return res.status(500).json({ message: "Error retrieving book" });
    });
});

// Get books by author using async/await with Axios
public_users.get('/author/:author', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:5000/');
    const result = Object.values(response.data).filter(
      book => book.author === req.params.author
    );

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving books by author" });
  }
});

// Get books by title using async/await with Axios
public_users.get('/title/:title', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:5000/');
    const result = Object.values(response.data).filter(
      book => book.title === req.params.title
    );

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving books by title" });
  }
});

public_users.get('/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  return res.status(200).json(books[isbn].reviews);
});

module.exports.general = public_users;