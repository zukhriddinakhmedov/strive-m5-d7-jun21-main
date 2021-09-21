// const express = require("express") // OLD SYNTAX!
import express from "express"
import listEndpoints from "express-list-endpoints"
import cors from "cors"
import { join } from "path"

import studentsRouter from "./services/students/index.js"
import booksRouter from "./services/books/index.js"
import filesRouter from "./services/files/index.js"
import { badRequestErrorHandler, notFoundErrorHandler, forbiddenErrorHandler, genericServerErrorHandler } from "./errorHandlers.js"

const server = express()

const port = 3001

const loggerMiddleware = (req, res, next) => {
  console.log(`Request method ${req.method} -- Request URL ${req.url} -- ${new Date()}`)
  // req.user = "Aziz"
  // if (req.user === "Aziz") {
  //   res.status(403).send()
  // } else {
  //   next() // MANDATORY!!!! I need to execute this function to give the control to what is coming next (either another middleware or the request handler)
  // }
  next()
}

const publicFolderPath = join(process.cwd(), "public")

// ***************** GLOBAL MIDDLEWARES ***********************

server.use(express.static(publicFolderPath))
server.use(loggerMiddleware)
server.use(cors()) // Add this to make your FE be able to communicate with BE
server.use(express.json()) // If I do not specify this line BEFORE the routes, all the requests' bodies will be UNDEFINED

// ***************** ENDPOINTS *********************
server.use("/books", booksRouter)
server.use("/students", loggerMiddleware, studentsRouter)
server.use("/files", filesRouter)

//server.use(loggerMiddleware) // This middleware is never going to be used

// *********************** ERROR MIDDLEWARES *************************

server.use(badRequestErrorHandler)
server.use(notFoundErrorHandler)
server.use(forbiddenErrorHandler)
server.use(genericServerErrorHandler)

console.table(listEndpoints(server))

server.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
