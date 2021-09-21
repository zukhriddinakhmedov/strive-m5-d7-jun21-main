import express from "express"
import multer from "multer"
import createHttpError from "http-errors"

import { saveStudentPicture } from "../../lib/fs-tools.js"

const filesRouter = express.Router()

filesRouter.post(
  "/uploadSingle/:studentID",
  multer({
    fileFilter: (req, file, cb) => {
      if (file.mimetype !== "image/gif") cb(createHttpError(400, { errorsList: "Format not supported!" }), false)
      else cb(null, true)
    },
  }).single("profilePic"),
  async (req, res, next) => {
    // This route is going to receive a multipart/form-data body, therefore we should use multer to parse that body and give us back the file
    try {
      console.log(req.file)

      await saveStudentPicture("3kgeacktjxtomx.gif", req.file.buffer)

      // 1. read students.json file
      // 2. find the student by studentID
      // 3. add img: "/img/students/3kgeacktjxtomx.gif"
      // 4. save the students back to students.json file
      res.send("OK")
    } catch (error) {
      next(error)
    }
  }
)

filesRouter.post("/uploadMultiple", multer().array("profilePic"), async (req, res, next) => {
  try {
    console.log(req.files)
    const arrayOfPromises = req.files.map(file => saveStudentPicture(file.originalname, file.buffer))
    await Promise.all(arrayOfPromises)
    res.send("OK")
  } catch (error) {
    next(error)
  }
})

export default filesRouter
