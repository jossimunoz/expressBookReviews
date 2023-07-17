const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

//Hint: The code should take the ‘username’ and ‘password’ provided in the body of the request for registration. If the username already exists, it must mention the same & must also show other errors like eg. when username &/ password are not provided.

public_users.post("/register", (req, res) => {
  //Write your code here

  const { username, password } = req.body;

  if (!username || !password)
    return res
      .status(400)
      .json({ message: "Username or Password are not provided." });

  const userExist =
    users.findIndex((user) => user.username === username) !== -1;

  if (userExist)
    return res.status(409).json({ message: "User already exists" });

  users.push({
    username,
    password,
  });

  return res.status(200).json({ message: "User added successfully." });
});

// Get the book list available in the shop
public_users.get("/", async function (req, res) {
  //Write your code here

  try {
    const _books = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(books);
      }, 300);
    });

    const data = await _books;

    return res.json(data);
  } catch (err) {
    return res.status(500).json({ message: "Something wrong has happened" });
  }

  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  //Write your code here

  const { isbn } = req.params;

  const getBookPromise = new Promise((resolve, reject) => {
    if (!books[isbn]) {
      reject("The book does not exist");
    } else {
      resolve(books[isbn]);
    }
  });

  getBookPromise
    .then((book) => {
      res.json(book);
    })
    .catch((error) => {
      res.status(400).json({ message: error });
    });
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const { author } = req.params;

  const getBooksPromise = new Promise((resolve, reject) => {
    const array = Object.entries(books).map((value) => ({
      isbn: value[0],
      ...value[1],
    }));

    const filteredBooks = array.filter((book) =>
      book.author.toLowerCase().includes(author.toLowerCase())
    );

    if (filteredBooks.length === 0) {
      reject("No books found for the given author");
    } else {
      resolve(filteredBooks);
    }
  });

  getBooksPromise
    .then((books) => {
      res.json(books);
    })
    .catch((error) => {
      res.status(400).json({ message: error });
    });
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const { title } = req.params;

  const getBooksPromise = new Promise((resolve, reject) => {
    const array = Object.entries(books).map((value) => ({
      isbn: value[0],
      ...value[1],
    }));

    const filteredBooks = array.filter((book) =>
      book.title.toLowerCase().includes(title.toLowerCase())
    );

    if (filteredBooks.length === 0) {
      reject("No books found with the given title");
    } else {
      resolve(filteredBooks);
    }
  });

  getBooksPromise
    .then((books) => {
      res.json(books);
    })
    .catch((error) => {
      res.status(400).json({ message: error });
    });
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const { isbn } = req.params;
  if (!books[isbn])
    return res.status(400).json({ message: "The book does not exist" });

  return res.json(books[isbn].reviews);
});

module.exports.general = public_users;
