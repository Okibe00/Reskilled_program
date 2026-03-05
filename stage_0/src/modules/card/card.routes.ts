import { Router } from 'express';
import {
  CreateCardSchema,
  UpdateCardSchema,
  CardParamSchema,
  CreateTagSchema,
} from './dto/card.dto.js';
import { authGuard } from '../../common/middleware/auth.middleware.js';
import { validateUser } from '../../common/middleware/validation.middleware.js';
import cardController from './card.controller.js';

const route = Router();

/**
 * @swagger
 * /card:
 *   post:
 *     summary: create a new card
 *     tags:
 *       - Card
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - positionIndex
 *               - columnId
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 3
 *               content:
 *                 type: string
 *                 minLength: 3
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *               positionIndex:
 *                 type: integer
 *                 minimum: 1
 *               columnId:
 *                 type: string
 *                 format: uuid
 *             example:
 *               title: "Write docs"
 *               content: "Add swagger comments"
 *               dueDate: "2026-03-10T00:00:00.000Z"
 *               positionIndex: 2
 *               columnId: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       201:
 *         description: Card created successfully
 */
route.post(
  '/card',
  authGuard,
  validateUser(CreateCardSchema, 'body'),
  cardController.createCard
);

/**
 * @swagger
 * /card/{id}:
 *   patch:
 *     summary: update an existing card
 *     tags:
 *       - Card
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID of the card to modify
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
 *               content:
 *                 type: string
 *                 minLength: 3
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *               positionIndex:
 *                 type: integer
 *                 minimum: 1
 *             example:
 *               title: "Updated title"
 *               content: "More details"
 *               dueDate: "2026-03-15T00:00:00.000Z"
 *               positionIndex: 3
 *     responses:
 *       200:
 *         description: Card updated successfully
 */
route.patch(
  '/card/:id',
  authGuard,
  validateUser(UpdateCardSchema, 'body'),
  cardController.updateCard
);

/**
 * @swagger
 * /card/{id}:
 *   delete:
 *     summary: delete a card
 *     tags:
 *       - Card
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID of the card to remove
 *     responses:
 *       204:
 *         description: Card deleted successfully (no content)
 */
route.delete(
  '/card/:id',
  authGuard,
  validateUser(CardParamSchema, 'param'),
  cardController.deleteCard
);

/**
 * @swagger
 * /column/{id}/cards:
 *   get:
 *     summary: retrieve all cards for a given column
 *     tags:
 *       - Card
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID of the column
 *     responses:
 *       200:
 *         description: list of cards in the column
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     format: uuid
 *                   title:
 *                     type: string
 *                   content:
 *                     type: string
 *                   dueDate:
 *                     type: string
 *                     format: date-time
 *                   positionIndex:
 *                     type: integer
 *                   columnId:
 *                     type: string
 *                     format: uuid
 *                 example:
 *                   id: "123e4567-e89b-12d3-a456-426614174001"
 *                   title: "Card title"
 *                   content: "Optional description"
 *                   dueDate: "2026-03-10T00:00:00.000Z"
 *                   positionIndex: 1
 *                   columnId: "123e4567-e89b-12d3-a456-426614174000"
 */
route.get(
  '/column/:id/cards',
  authGuard,
  validateUser(CardParamSchema, 'param'),
  cardController.getCardInColumn
);

/**
 * @swagger
 * /tag/{id}/assign:
 *   post:
 *     summary: assign a tag
 *     tags:
 *       - Tag
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID of the card to which the tag will be attached
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - label
 *               - colorHex
 *             properties:
 *               label:
 *                 type: string
 *                 minLength: 3
 *               colorHex:
 *                 type: string
 *                 pattern: '^#?[0-9A-Fa-f]{6}$'
 *             example:
 *               label: "Urgent"
 *               colorHex: "#ff0000"
 *     responses:
 *       201:
 *         description: Tag assigned successfully
 */
route.post(
  '/tag/:id/assign',
  authGuard,
  validateUser(CardParamSchema, 'param'),
  validateUser(CreateTagSchema, 'body'),
  cardController.assignTag
);

export default route;
