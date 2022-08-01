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

const getOneBookHandler = (request, h) => {
  const {bookId} = request.params;
  const book = books.find((book)=> book.id === bookId);
  console.log(book);
  if (book !== undefined) {
    const response = h.response({
      status: 'success',
      data: {
        book,
      },
    });
    response.code(200);
    console.log(`Buku dengan id: ${bookId} ditemukan`);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  console.log('buku tidak ditemukan');
  return response;
};

const updateBookHandler = (request, h) => {
  const {bookId} = request.params;
  const {payload} = request;
  const {name, year, author, summary, publisher, pageCount, readPage} = payload;

  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbaharui buku. Mohon isi nama buku',
    });
    response.code(400);
    console.log('gagal memperbaharui buku, mohon isi nama buku');
    return response;
  }
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbaharui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    console.log('gagal memperbaharui buku, readPage tidak boleh lebih besar dari pageCount');
    return response;
  }

  const updateAt = new Date().toISOString();
  const index = books.findIndex((book) => book.id === bookId);
  console.log(index);
  if (index !== -1) {
    const updateBook = books[index];
    updateBook.name = name;
    updateBook.year = year;
    updateBook.author = author;
    updateBook.summary = summary;
    updateBook.publisher = publisher;
    updateBook.pageCount = pageCount;
    updateBook.readPage = readPage;
    updateBook.updatedAt = updateAt;
    updateBook.finished = pageCount === readPage;
    updateBook.reading = !updateBook.finished;
    books[index] = updateBook;

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbaharui',
    });
    response.code(200);
    console.log('Buku berhasil diperbaharui');
    return response;
  } else {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku, Id tidak ditemukan',
    });
    response.code(404);
    console.log('Gagal memperbarui buku, Id tidak ditemukan');
    return response;
  }
};

const deleteBookHandler = (request, h) => {
};
module.exports = {addBookHandler, getAllBooksHandler, getOneBookHandler, updateBookHandler, deleteBookHandler};
