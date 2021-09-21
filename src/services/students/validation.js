import { body } from "express-validator"

export const studentsValidationMiddleware = [
  body("firstName").exists().withMessage("firstName is a mandatory field!"),
  body("lastName").exists().withMessage("lastName is a mandatory field!"),
  body("email").exists().withMessage("email is a mandatory field!").isEmail().withMessage("Please send a valid email!"),
]
