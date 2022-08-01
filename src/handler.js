/* eslint-disable max-len */
const {nanoid} = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) =>{
  const {payload} = request;
  const {name, year, author, summary, publisher, pageCount, readPage} = payload;

  const id = nanoid(16);
  const finished = pageCount === readPage;
  const reading = !finished;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  books.push(newBook);

  if (typeof(name) === 'undefined') {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    console.log('gagal menambahkan buku, mohon isi nama buku');
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    console.log('gagal menambahkan buku, readPage tidak boleh lebih besar dari pageCount');
    return response;
  }

  // check if book is already in the array
  const isAlready = books.filter((book) => book.id === id).length > 0;
  if (isAlready) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    console.log('Buku berhasil ditambahkan');
    return response;
  }

  const response = h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  console.log('Buku gagal ditambahkan');
  return response;
};

const getAllBooksHandler = (request, h) => ({
  status: 'success',
  data: {
    books,
  },
});

module.exports = {addBookHandler, getAllBooksHandler};
