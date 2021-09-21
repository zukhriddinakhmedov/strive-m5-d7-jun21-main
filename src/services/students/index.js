// ******************************* STUDENTS CRUD ************************************

// 1. CREATE --> POST http://localhost:3001/students (+body)
// 2. READ --> GET http://localhost:3001/students
// 3. READ --> GET http://localhost:3001/students/:id
// 4. UPDATE --> PUT http://localhost:3001/students/:id (+body)
// 5. DELETE --> DELETE http://localhost:3001/students/:id

import express from "express" // 3RD PARTY MODULE
import fs from "fs" // CORE MODULE
import { fileURLToPath } from "url" // CORE MODULE
import { dirname, join } from "path" // CORE MODULE
import uniqid from "uniqid" // 3RD PARTY MODULE
import createHttpError from "http-errors"
import { validationResult } from "express-validator"
import { studentsValidationMiddleware } from "./validation.js"

const studentsRouter = express.Router() // studentsRouter is going to have /students as a prefix

// To obtain the studentsJSONFilePath I need to do the following:
// 1. I'll start from the current file path I'm in right now (c:/..../src/services/students/index.js)
const currentFilePath = fileURLToPath(import.meta.url)
console.log("IMPORT META URL: ", import.meta.url)
console.log("CURRENT FILE PATH: ", currentFilePath)
// 2. I'll obtain the current folder index.js file is in (c:/..../src/services/students)
const currentDirPath = dirname(currentFilePath)
console.log("CURRENT DIRECTORY: ", currentDirPath)
// 3. I'll concatenate folder path with students.json (c:/..../src/services/students/students.json) DO NOT USE "+" SYMBOL TO CONCATENATE TWO PATHS TOGETHER
const studentsJSONFilePath = join(currentDirPath, "students.json")
// const studentsJSONFilePath = join(currentDirPath, "../books/books.json")
console.log("STUDENTS.JSON PATH: ", studentsJSONFilePath)

// 1.
studentsRouter.post("/", studentsValidationMiddleware, async (request, response, next) => {
  const errorsList = validationResult(request)

  if (!errorsList.isEmpty()) {
    // We had validation errors! --> we need to trigger 400 error handler
    next(createHttpError(400, { errorsList }))
  } else {
    // 1. Read the request body obtaining the new student's data

    console.log("REQUEST BODY: ", request.body)

    const newStudent = { ...request.body, id: uniqid(), createdAt: new Date() }

    console.log(newStudent)

    // 2. Read students.json file content to get back an array of students
    const students = JSON.parse(fs.readFileSync(studentsJSONFilePath))

    // 3. Add new student to the array
    students.push(newStudent)

    // 4. Write the array back to the file
    fs.writeFileSync(studentsJSONFilePath, JSON.stringify(students))

    // 5. Send back a proper response

    response.status(201).send({ id: newStudent.id })
  }
})

// 2.
studentsRouter.get("/", async (req, res, next) => {
  // 1. Read students.json file content to get back an array of students

  const fileContent = fs.readFileSync(studentsJSONFilePath) // we get back a BUFFER which is the content of the file (Machine Readable)

  const students = JSON.parse(fileContent)

  // 2. Send back as a response the array of students
  res.send(students)
})

// 3.
studentsRouter.get("/:studentID", async (req, res, next) => {
  console.log("STUDENT ID : ", req.params.studentID)
  // 1. Read students.json file content to get back an array of students
  const students = JSON.parse(fs.readFileSync(studentsJSONFilePath))

  // 2. Find the specified student by id

  const student = students.find(s => s.id === req.params.studentID)
  // 3. Send him back as response
  if (student) {
    res.send(student)
  } else {
    next(createHttpError(404, `Student with ID ${req.params.studentID} not found!`)) // we want to trigger 404 error handler
  }
})

// 4.
studentsRouter.put("/:studentID", async (req, res, next) => {
  // 1. Read students.json file content to get back an array of students
  const students = JSON.parse(fs.readFileSync(studentsJSONFilePath))

  // 2. Modify the specified student
  // const remainingStudents = students.filter(student => student.id !== req.params.studentID)

  // const updatedStudent = { ...req.body, id: req.params.studentID }

  // remainingStudents.push(updatedStudent)

  const index = students.findIndex(student => student.id === req.params.studentID)

  const updatedStudent = { ...students[index], ...req.body }

  students[index] = updatedStudent

  // 3. Save the file with the updated list of students
  fs.writeFileSync(studentsJSONFilePath, JSON.stringify(students))

  // 4. Send back a proper response
  res.send(updatedStudent)
})

// 5.
studentsRouter.delete("/:studentID", async (req, res, next) => {
  // 1. Read students.json file content to get back an array of students
  const students = JSON.parse(fs.readFileSync(studentsJSONFilePath))

  // 2. Filter out the specified studentID from the array
  const remainingStudents = students.filter(student => student.id !== req.params.studentID)

  // 3. Write the remaining students into the file
  fs.writeFileSync(studentsJSONFilePath, JSON.stringify(remainingStudents))

  // 4. Send back a proper response
  res.status(204).send()
})

// studentsRouter.get("/whatever", (req, res, next) => {})

export default studentsRouter
