import fs from "fs-extra"
import { join, dirname } from "path"
import { fileURLToPath } from "url"

const { readJSON, writeJSON, writeFile } = fs

const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../data")

const booksJSONPath = join(dataFolderPath, "books.json")
const studentsJSONPath = join(dataFolderPath, "students.json")
const publicFolderPath = join(process.cwd(), "./public/img/students")

export const getBooks = () => readJSON(booksJSONPath)
export const writeBooks = content => writeJSON(booksJSONPath, content)
export const getStudents = () => readJSON(studentsJSONPath)
export const writeStudents = content => writeJSON(studentsJSONPath, content)

export const saveStudentPicture = (name, contentAsBuffer) => writeFile(join(publicFolderPath, name), contentAsBuffer)
