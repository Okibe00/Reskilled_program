import { Router } from 'express';
import {
  CreateBoardSchema,
  UpdateBoardSchema,
  BoardParamSchema,
} from './dto/board.dto.js';
import { authGuard } from '../../common/middleware/auth.middleware.js';
import { validateUser } from '../../common/middleware/validation.middleware.js';
import boardController from './board.controller.js';

const route = Router();

/**
 * @swagger
 * /board/all:
 *   get:
 *     summary: Fetch all boards with pagination
 *     tags:
 *       - Board
 *     parameters:
 *       - in: query
 *         name: page
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 10
 *         description: Number of boards per page
 *     responses:
 *       200:
 *         description: Boards fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                 meta:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *       400:
 *         description: Invalid query parameters
 */
route.get('/board/all', authGuard, boardController.getUserBoard);

/**
 * @swagger
 * /board:
 *   post:
 *     summary: create a new board.
 *     tags:
 *       - Board
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - userId
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 3
 *               userId:
 *                 type: string
 *                 format: uuid
 *               description:
 *                 type: string
 *                 minLength: 3
 *             example:
 *               title: "Project"
 *               userId: "123e4567-e89b-12d3-a456-426614174000"
 *               description: "This is a board for project tasks"
 *     responses:
 *       201:
 *         description: Board created
 */
route.post(
  '/board',
  authGuard,
  validateUser(CreateBoardSchema, 'body'),
  boardController.createBoard
);

/**
 * @swagger
 * /board/{id}:
 *   patch:
 *     summary: update an existing board
 *     tags:
 *       - Board
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID of the board to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 3
 *               description:
 *                 type: string
 *                 minLength: 2
 *             example:
 *               title: "New board name"
 *               description: "Updated description"
 *     responses:
 *       200:
 *         description: Board updated successfully
 */
route.patch(
  '/board/:id',
  authGuard,
  validateUser(BoardParamSchema, 'params'),
  validateUser(UpdateBoardSchema, 'body'),
  boardController.updateBoard
);

/**
 * @swagger
 * /board/{id}:
 *   delete:
 *     summary: delete a board
 *     tags:
 *       - Board
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID of the board to delete
 *     responses:
 *        200:
 *          description: Board deleted
 *        400:
 *          description: Failed to delete board
 */
route.delete(
  '/board/:id',
  authGuard,
  validateUser(BoardParamSchema, 'params'),
  boardController.deleteBoard
);
export default route;
