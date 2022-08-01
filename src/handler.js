/* eslint-disable valid-jsdoc */
/* eslint-disable max-len */

const {nanoid} = require('nanoid');
const booksList = require('./books');


/** Function handler untuk menambahkan buku baru*/
const addBookHandler = (request, h) =>{
  const {payload} = request;
  const {name, year, author, summary, publisher, pageCount, readPage, reading} = payload;

  const id = nanoid(16);
  const finished = pageCount === readPage;
  // const reading = !finished;
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

  booksList.push(newBook);

  // check if book is already in the array
  const isAlready = booksList.filter((book) => book.id === id).length > 0;
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

/** Function handler untuk mengambil buku sesuai dengan kondisi */
const getAllBooksHandler = (request, h) => {
  // get book list from query params
  const {query} = request;
  const nama = query.name;
  const baca = query.reading;
  const selesai = query.finished;
  let books = [''];

  if (nama !== undefined && nama.toLowerCase() === 'dicoding') {
    console.log('masuk keisini fillter dicoding');
    const book = booksList.filter((book) => book.name.toLowerCase().includes(nama.toLowerCase()));
    books = book.map((book) => {
      return {
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      };
    });
    const response = h.response({
      status: 'success',
      data: {
        books,
      },
    });
    response.code(200);
    return response;
  }

  if (baca !== undefined) {
    if (baca === '1') {
      const book = booksList.filter((book) => book.reading === true);
      books = book.map((book) => {
        return {
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        };
      });
      const response = h.response({
        status: 'success',
        data: {
          books,
        },
      });
      response.code(200);
      return response;
    } else if (baca === '0') {
      const book = booksList.filter((book) => book.reading === false);
      books = book.map((book) => {
        return {
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        };
      });
    }
    const response = h.response({
      status: 'success',
      data: {
        books,
      },
    });
    response.code(200);
    return response;
  }

  if (selesai !== undefined) {
    if (selesai === '1') {
      const book = booksList.filter((book) => book.finished === true);
      books = book.map((book) => {
        return {
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        };
      });
      const response = h.response({
        status: 'success',
        data: {
          books,
        },
      });
      response.code(200);
      return response;
    } else if (selesai === '0') {
      const book = booksList.filter((book) => book.finished === false);
      books = book.map((book) => {
        return {
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        };
      });
      const response = h.response({
        status: 'success',
        data: {
          books,
        },
      });
      response.code(200);
      return response;
    }
  }

  // map books to get properties id, name, publisher
  books = booksList.map((book) => {
    return {
      id: book.id,
      name: book.name,
      publisher: book.publisher,
    };
  });

  const response = h.response({
    status: 'success',
    data: {
      books,
    },
  });
  response.code(200);
  console.log('buku berhasil ditemukan');
  return response;
};

/** Function handler untuk mengambil buku berdasarkan id */
const getOneBookHandler = (request, h) => {
  const {bookId} = request.params;
  const book = booksList.find((book)=> book.id === bookId);
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

/** function handler untuk mengupdate data buku */
const updateBookHandler = (request, h) => {
  const {bookId} = request.params;
  const {payload} = request;
  const {name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = payload;

  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    console.log('gagal memperbaharui buku, mohon isi nama buku');
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    console.log('gagal memperbaharui buku, readPage tidak boleh lebih besar dari pageCount');
    return response;
  }

  const updateAt = new Date().toISOString();
  const index = booksList.findIndex((book) => book.id === bookId);
  console.log(index);
  if (index !== -1) {
    const updateBook = booksList[index];
    updateBook.name = name;
    updateBook.year = year;
    updateBook.author = author;
    updateBook.summary = summary;
    updateBook.publisher = publisher;
    updateBook.pageCount = pageCount;
    updateBook.readPage = readPage;
    updateBook.updatedAt = updateAt;
    updateBook.finished = pageCount === readPage;
    updateBook.reading = reading;
    booksList[index] = updateBook;

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    console.log('Buku berhasil diperbaharui');
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  console.log('Gagal memperbarui buku. Id tidak ditemukan');
  return response;
};

/** function untuk menghapus buku */
const deleteBookHandler = (request, h) => {
  const {bookId} = request.params;
  const index = booksList.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    booksList.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    console.log('Buku berhasil dihapus');
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });

  response.code(404);
  console.log('Buku gagal dihapus. Id tidak ditemukan');
  return response;
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getOneBookHandler,
  updateBookHandler,
  deleteBookHandler,
};
