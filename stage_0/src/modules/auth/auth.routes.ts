import { Router } from 'express';
import authController from './auth.controller.js';
import { loginSchema } from './dto/login.dto.js';
import { validateUser } from '../../common/middleware/validation.middleware.js';

const route = Router();

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: login a user.
 *     tags:
 *        - Auth
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *              schema:
 *                  type: object
 *                  required: true
 *                    - email
 *                    - password
 *                  properties:
 *                     email:
 *                       type: string
 *                     password:
 *                       type: string
 *                  example:
 *                     email: "john@example.com"
 *                     password: StrongPassword
 *     responses:
 *       201:
 *         description: Success
 */
route.post('/auth/login', validateUser(loginSchema, 'body'), authController.login);



/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: register a new user.
 *     tags:
 *        - Auth
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *              schema:
 *                  type: object
 *                  required:
 *                    - name
 *                    - email
 *                    - password
 *                  properties:
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     password:
 *                       type: string
 *                  example:
 *                     name: "John Doe"
 *                     email: "john@example.com"
 *                     password: "StrongPassword"
 *     responses:
 *       201:
 *         description: Success
 */
route.post('/auth/signup', validateUser(loginSchema, 'body'), authController.signup);
export default route;
