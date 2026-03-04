import { Router } from 'express';
import UserController from './user.controller.js';
import {
  CreateUserSchema,
  UpdateUserSchema,
  userParamSchema,
} from './dto/user.dto.js';
import { validateUser } from '../../common/middleware/validation.middleware.js';
import { authGuard } from '../../common/middleware/auth.middleware.js';
const router = Router();
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     security:
 *        - bearerAuth: []
 *     tags:
 *        - Users
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/users', authGuard, UserController.getAll);

/**
 * @swagger
 * /user:
 *   post:
 *     summary: Create a user.
 *     security: 
 *       - bearerAuth: []
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
router.post(
  '/user',
  validateUser(CreateUserSchema, 'body'),
  UserController.create
);
/**
 * @swagger
 * /user/{id}:
 *   patch:
 *     summary: Update a user
 *     description: Updates user details by ID.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Users
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the user to update
 *         schema:
 *           type: string
 *           example: 5a3b897f-0048-40e2-ab45-f73a6f24374c
 *
 *     requestBody:
 *       required: true
 *       description: Updated user information
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: false
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: User not found
 */
router.patch(
  '/user/:id',
  validateUser(userParamSchema, 'param'),
  validateUser(UpdateUserSchema, 'body'),
  UserController.update
);

/**
 * @swagger
 * /user/{id}:
 *   delete:
 *     summary: delete user by ID
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Users
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the user
 *         schema:
 *           type: string
 *           example: 5a3b897f-0048-40e2-ab45-f73a6f24374c
 *     responses:
 *       200:
 *         description: Success
 */
router.delete(
  '/user/:id',
  validateUser(userParamSchema, 'param'),
  UserController.delete
);

export default router;
