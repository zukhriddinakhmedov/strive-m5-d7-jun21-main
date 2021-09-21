// ******************************* BOOKS CRUD ************************************

// 1. CREATE --> POST http://localhost:3001/books (+body)
// 2. READ --> GET http://localhost:3001/books (+ optional query params)
// 3. READ --> GET http://localhost:3001/books/:id
// 4. UPDATE --> PUT http://localhost:3001/books/:id (+body)
// 5. DELETE --> DELETE http://localhost:3001/books/:id

import express from "express"
import uniqid from "uniqid"
import createHttpError from "http-errors"

import { getBooks, writeBooks } from "../../lib/fs-tools.js"

// const booksJSONPath = join(dirname(fileURLToPath(import.meta.url)), "books.json")

// const getBooks = () => JSON.parse(fs.readFileSync(booksJSONPath))
// const writeBooks = content => fs.writeFileSync(booksJSONPath, JSON.stringify(content))

const booksRouter = express.Router() // booksRouter is going to have /students as a prefix

const anotherLoggerMiddleware = async (req, res, next) => {
  console.log(`ojoijasodjosajdosjadoijaosidjasd`)
  next() // MANDATORY!!!! I need to execute this function to give the control to what is coming next (either another middleware or the request handler)
}

// 1.
booksRouter.post("/", async (req, res, next) => {
  try {
    const newBook = { ...req.body, id: uniqid(), createdAt: new Date() }

    const books = await getBooks()

    books.push(newBook)

    await writeBooks(books)

    res.status(201).send({ id: newBook.id })
  } catch (error) {
    next(error) // If I use next here I'll send the error to the error handlers
  }
})

// 2.
booksRouter.get("/", anotherLoggerMiddleware, anotherLoggerMiddleware, async (req, res, next) => {
  try {
    const books = await getBooks()
    console.log(books)
    // throw new Error("KABOOOOOOOOOOOOOOOOOM!")
    if (req.query && req.query.title) {
      const filteredBooks = books.filter(book => book.title === req.query.title)
      res.send(filteredBooks)
    } else {
      res.send(books)
    }
  } catch (error) {
    next(error) // If I use next here I'll send the error to the error handlers
  }
})

// 3.
booksRouter.get("/:bookID", async (req, res, next) => {
  try {
    const books = await getBooks()
    const book = books.find(b => b.id === req.params.bookID)
    if (book) {
      res.send(book)
    } else {
      next(createHttpError(404, `Book with ID ${req.params.bookID} not found!`)) // we want to trigger 404 error handler
    }
  } catch (error) {
    next(error)
  }
})

// 4.
booksRouter.put("/:bookID", async (req, res, next) => {
  try {
    const books = await getBooks()

    const index = books.findIndex(b => b.id === req.params.bookID)

    const bookToModify = books[index]
    const updatedFields = req.body

    const updatedBook = { ...bookToModify, ...updatedFields }

    books[index] = updatedBook

    await writeBooks(books)

    res.send(updatedBook)
  } catch (error) {
    next(error)
  }
})

// 5.
booksRouter.delete("/:bookID", async (req, res, next) => {
  try {
    const books = await getBooks()

    const filteredBooks = books.filter(book => book.id !== req.params.bookID)

    await writeBooks(filteredBooks)

    res.status(204).send()
  } catch (error) {
    next(error)
  }
})

export default booksRouter
