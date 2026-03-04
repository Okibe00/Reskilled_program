import { Router } from 'express';
import {
  CreateColumnSchema,
  UpdateColumnSchema,
  ColumnParamSchema,
} from './dto/column.dto.js';
import { authGuard } from '../../common/middleware/auth.middleware.js';
import { validateUser } from '../../common/middleware/validation.middleware.js';
import columnController from './column.controller.js';

const route = Router();

/**
 * @swagger
 * /column:
 *   post:
 *     summary: create a new column
 *     tags:
 *       - Column
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - boardId
 *               - positionIndex
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 3
 *               boardId:
 *                 type: string
 *                 format: uuid
 *               positionIndex:
 *                 type: integer
 *                 minimum: 1
 *             example:
 *               name: "To do"
 *               boardId: "123e4567-e89b-12d3-a456-426614174000"
 *               positionIndex: 1
 *     responses:
 *       201:
 *         description: Column created successfully
 */
route.post(
  '/column',
  validateUser(CreateColumnSchema, 'body'),
  columnController.createColumn
);

/**
 * @swagger
 * /column/{id}:
 *   patch:
 *     summary: update a column
 *     tags:
 *       - Column
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID of the column to modify
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 minLength:
 *               positionIndex:
 *                 type: integer
 *                 minimum: 1
 *             example:
 *               name: "In review"
 *               positionIndex: 2
 *     responses:
 *       200:
 *         description: Column updated successfully
 */
route.patch(
  '/column/:id',
  validateUser(UpdateColumnSchema, 'param'),
  validateUser(UpdateColumnSchema, 'body'),
  columnController.updateColumn
);

/**
 * @swagger
 * /column/{id}:
 *   delete:
 *     summary: delete a column
 *     tags:
 *       - Column
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID of the column to remove
 *     responses:
 *       204:
 *         description: Column deleted successfully (no content)
 */
route.delete(
  '/column/:id',
  validateUser(ColumnParamSchema, 'param'),
  columnController.deleteColumn
);

export default route;
