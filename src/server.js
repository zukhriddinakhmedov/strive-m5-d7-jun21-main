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

const port = process.env.PORT

console.log("ENV VAR", process.env)

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

//**************************CORS************************ */

// CORS: CROSS-ORIGIN-RESOURCE SHARING

// htt
const whitelist = [process.env.FE_DEV_URL, process.env.FE_PROD_URL] //we
//are allowing local FE AND the deployed FE to access to our API

const corsOptions = {
  origin: function (origin, next) {
    console.log(origin)
    if (!origin || whitelist.indexOf(origin) === -1) {//if received origin is in the whitelist
      //we are going to allow that request
      next(null, true)
    } else {// if it is not we are going to reject that request
      next(new Error(`Origin ${origin} not allowed`))
    }
  }
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
