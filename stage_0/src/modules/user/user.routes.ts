import { Router } from 'express';
import UserController from './user.controller.js';
import { CreateUserSchema } from './dto/user.dto.js';
import { validate } from '../../common/middleware/validation.middleware.js';
const router = Router();
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/users', UserController.getAll);

/**
 * @swagger
 * /user:
 *   post:
 *     summary: Create a user.
 *     tags:
 *        - Users
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *              schema:
 *                  type: object
 *                  required: true
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
 *                     password: StrongPassword
 *     responses:
 *       201:
 *         description: Success
 */
router.post('/user', validate(CreateUserSchema), UserController.create);

export default router;
