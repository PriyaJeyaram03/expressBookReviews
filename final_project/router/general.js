const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Task 6: Register a new user
public_users.post("/register", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      return res.status(404).json({message: "User already exists!"});
    } else {
      users.push({"username": username, "password": password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    }
  }
  return res.status(404).json({message: "Unable to register user. Please provide both username and password"});
});

// Task 1: Get the book list available in the shop
public_users.get('/', function (req, res) {
  //Write your code here
  return res.status(200).json(books);
});

// Task 2: Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn]);
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});

// Task 3: Get book details based on author
public_users.get('/author/:author', function (req, res) {
  //Write your code here
  const author = req.params.author;
  let booksByAuthor = [];
  
  for (let isbn in books) {
    if (books[isbn].author === author) {
      booksByAuthor.push({
        isbn: isbn,
        title: books[isbn].title,
        reviews: books[isbn].reviews
      });
    }
  }
  
  if (booksByAuthor.length > 0) {
    return res.status(200).json({booksbyauthor: booksByAuthor});
  } else {
    return res.status(404).json({message: "No books found by this author"});
  }
});

// Task 4: Get all books based on title
public_users.get('/title/:title', function (req, res) {
  //Write your code here
  const title = req.params.title;
  let booksByTitle = [];
  
  for (let isbn in books) {
    if (books[isbn].title === title) {
      booksByTitle.push({
        isbn: isbn,
        author: books[isbn].author,
        reviews: books[isbn].reviews
      });
    }
  }
  
  if (booksByTitle.length > 0) {
    return res.status(200).json({booksbytitle: booksByTitle});
  } else {
    return res.status(404).json({message: "No books found with this title"});
  }
});

// Task 5: Get book review
public_users.get('/review/:isbn', function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  
  if (books[isbn] && books[isbn].reviews) {
    return res.status(200).json(books[isbn].reviews);
  } else if (books[isbn]) {
    return res.status(200).json({message: "No reviews yet for this book"});
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});

// Tasks 10-13: Async/Await versions - ADD THESE NEW ROUTES

// Task 10: Get all books using Promise/Async-Await
public_users.get('/async/all', function (req, res) {
  // Using Promise
  const getBooksPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(books);
    }, 1000);
  });

  getBooksPromise
    .then(bookList => {
      return res.status(200).json(bookList);
    })
    .catch(error => {
      return res.status(500).json({message: "Error fetching books"});
    });
});

// Task 11: Get book by ISBN using Promise/Async-Await
public_users.get('/async/isbn/:isbn', function (req, res) {
  // Using Async/Await
  const isbn = req.params.isbn;
  
  const getBookAsync = async () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (books[isbn]) {
          resolve(books[isbn]);
        } else {
          reject("Book not found");
        }
      }, 1000);
    });
  };

  (async () => {
    try {
      const book = await getBookAsync();
      return res.status(200).json(book);
    } catch (error) {
      return res.status(404).json({message: error});
    }
  })();
});

// Task 12: Get books by author using Promise/Async-Await
public_users.get('/async/author/:author', function (req, res) {
  const author = req.params.author;
  
  const getBooksByAuthorAsync = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let booksByAuthor = [];
        for (let isbn in books) {
          if (books[isbn].author === author) {
            booksByAuthor.push({
              isbn: isbn,
              title: books[isbn].title,
              reviews: books[isbn].reviews
            });
          }
        }
        resolve(booksByAuthor);
      }, 1000);
    });
  };

  (async () => {
    try {
      const booksByAuthor = await getBooksByAuthorAsync();
      if (booksByAuthor.length > 0) {
        return res.status(200).json({booksbyauthor: booksByAuthor});
      } else {
        return res.status(404).json({message: "No books found by this author"});
      }
    } catch (error) {
      return res.status(500).json({message: "Error fetching books"});
    }
  })();
});

// Task 13: Get books by title using Promise/Async-Await
public_users.get('/async/title/:title', function (req, res) {
  const title = req.params.title;
  
  const getBooksByTitleAsync = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let booksByTitle = [];
        for (let isbn in books) {
          if (books[isbn].title === title) {
            booksByTitle.push({
              isbn: isbn,
              author: books[isbn].author,
              reviews: books[isbn].reviews
            });
          }
        }
        resolve(booksByTitle);
      }, 1000);
    });
  };

  (async () => {
    try {
      const booksByTitle = await getBooksByTitleAsync();
      if (booksByTitle.length > 0) {
        return res.status(200).json({booksbytitle: booksByTitle});
      } else {
        return res.status(404).json({message: "No books found with this title"});
      }
    } catch (error) {
      return res.status(500).json({message: "Error fetching books"});
    }
  })();
});

module.exports.general = public_users;