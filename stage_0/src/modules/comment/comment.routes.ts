import { Router } from 'express';
import {
  CommentParamSchema,
  CommentQuerySchema,
  CreateCommentSchema,
  RepliesCommentQuerySchema,
  UpdateCommentSchema,
  deleteCommentQuerySchema,
} from './dto/comment.dto.js';
import { authGuard } from '../../common/middleware/auth.middleware.js';
import { validateUser } from '../../common/middleware/validation.middleware.js';
import commentController from './comment.controller.js';

const routes = Router();
/**
 * @swagger
 * /comments:
 *   post:
 *     summary: Create a new comment
 *     tags:
 *       - Comment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *               - userId
 *               - cardId
 *             properties:
 *               content:
 *                 type: string
 *                 minLength: 3
 *                 description: The content of the comment
 *               userId:
 *                 type: string
 *                 format: uuid
 *                 description: ID of the user creating the comment
 *               parentId:
 *                 type: string
 *                 format: uuid
 *                 nullable: true
 *                 description: ID of the parent comment (for threaded replies)
 *               cardId:
 *                 type: string
 *                 format: uuid
 *                 description: ID of the card the comment belongs to
 *             example:
 *               content: "This feature needs improvement"
 *               userId: "123e4567-e89b-12d3-a456-426614174000"
 *               parentId: "223e4567-e89b-12d3-a456-426614174000"
 *               cardId: "323e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       201:
 *         description: Comment created successfully
 *       400:
 *         description: Validation error
 */
routes.post(
  '/comments',
  authGuard,
  validateUser(CreateCommentSchema, 'body'),
  commentController.createComment
);

/**
 * @swagger
 * /comments:
 *   get:
 *     summary: Fetch comments with pagination and optional parent filtering
 *     tags:
 *       - Comment
 *     parameters:
 *       - in: query
 *         name: cardId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the card to fetch comments for
 *       - in: query
 *         name: parentId
 *         required: false
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the parent comment (used to fetch replies)
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
 *         description: Number of comments per page
 *       - in: query
 *         name: replyLimit
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 3
 *         description: Number of replies to include per comment
 *     responses:
 *       200:
 *         description: Comments fetched successfully
 *       400:
 *         description: Invalid query parameters
 */
routes.get(
  '/comments',
  validateUser(CommentQuerySchema, 'query'),
  commentController.findPaginatedComments
);

/**
 * @swagger
 * /comments/replies:
 *   get:
 *     summary: Fetch replies for a specific comment with pagination
 *     tags:
 *       - Comment
 *     parameters:
 *       - in: query
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the parent comment to fetch replies for
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
 *         description: Number of replies per page
 *     responses:
 *       200:
 *         description: Replies fetched successfully
 *       400:
 *         description: Invalid query parameters
 *       404:
 *         description: Comment not found
 */
routes.get(
  '/comments/replies',
  validateUser(RepliesCommentQuerySchema, 'query'),
  commentController.findPaginatedReplies
);
/**
 * @swagger
 * /comments/delete:
 *   delete:
 *     summary: Delete a comment
 *     tags:
 *       - Comment
 *     parameters:
 *       - in: query
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the comment to delete
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *       400:
 *         description: Invalid or missing commentId
 *       404:
 *         description: Comment not found
 */
routes.delete(
  '/comments/delete',
  /*authGuard,*/
  validateUser(deleteCommentQuerySchema, 'query'),
  commentController.deleteComment
);
/**
 * @swagger
 * /comments/{id}:
 *   patch:
 *     summary: Update a comment
 *     tags:
 *       - Comment
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the comment to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 minLength: 3
 *                 description: Updated content of the comment
 *               userId:
 *                 type: string
 *                 format: uuid
 *                 description: ID of the user updating the comment
 *               parentId:
 *                 type: string
 *                 format: uuid
 *                 nullable: true
 *                 description: ID of the parent comment (for threaded replies)
 *               cardId:
 *                 type: string
 *                 format: uuid
 *                 description: ID of the card the comment belongs to
 *             example:
 *               content: "Updated comment content"
 *               parentId: "223e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       200:
 *         description: Comment updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Comment not found
 */
routes.patch(
  '/comments/:id',
  /*authGuard,*/ validateUser(UpdateCommentSchema, 'body'),
  validateUser(CommentParamSchema, 'param'),
  commentController.updateComment
);

export default routes;
