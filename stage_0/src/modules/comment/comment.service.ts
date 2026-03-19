import prisma from '../../config/database.js';
import { CreateCommentDto, UpdateCommentDto } from './dto/comment.dto.js';
import { appEvents, EVENTS } from '../../common/events/event-emitter.js';
import { PrismaClient, Comment } from '@prisma/client';

export class CommentService {
  constructor(
    private prisma: PrismaClient,
    private eventManager: typeof appEvents
  ) {}

  async create(data: CreateCommentDto): Promise<Comment> {
    const newComment = await this.prisma.comment.create({
      data,
      include: {
        user: {
          select: { id: true, name: true },
        },
      },
    });
    if (newComment) {
      this.eventManager.emit(EVENTS.COMMENT_ADDED, newComment);
    }
    return newComment;
  }
  async update(data: UpdateCommentDto, id: string): Promise<Comment> {
    return await this.prisma.comment.update({
      where: {
        id,
      },
      data,
    });
  }
  async delete(id: string): Promise<Comment> {
    const deletedComment = await this.prisma.comment.delete({
      where: { id },
    });
    return deletedComment;
  }

  async getPaginatedComments(
    cardId: string,
    page: number = 1,
    limit: number = 10,
    replyLimit: number = 5
  ) {
    const skip = (page - 1) * limit;

    const comments = await this.prisma.comment.findMany({
      where: {
        cardId: cardId,
        parentId: null,
      },
      take: limit,
      skip: skip,
      orderBy: { createdAt: 'desc' }, // Newest threads first

      include: {
        user: { select: { name: true } },

        replies: {
          take: replyLimit,
          orderBy: { createdAt: 'asc' },
          include: {
            user: { select: { name: true } },
          },
        },

        _count: {
          select: { replies: true },
        },
      },
    });

    const totalLevel1Comments = await prisma.comment.count({
      where: { cardId: cardId, parentId: null },
    });
    const totalPages = Math.ceil(totalLevel1Comments / limit)
      ? Math.ceil(totalLevel1Comments / limit)
      : 1;
    return {
      comments,
      meta: {
        total: totalLevel1Comments,
        page,
        limit,
        totalPages,
      },
    };
  }

  async getPaginatedReplies(
    commentId: string,
    page: number = 1,
    limit: number = 10
  ) {
    const skip = (page - 1) * limit;

    const replies = await prisma.comment.findMany({
      where: { parentId: commentId },
      take: limit,
      skip: skip,
      orderBy: { createdAt: 'asc' },
      include: {
        user: { select: { name: true } },
      },
    });

    const totalReplies = await prisma.comment.count({
      where: { parentId: commentId },
    });

    return {
      replies,
      meta: {
        total: totalReplies,
        page,
        limit,
        totalPages: Math.ceil(totalReplies / limit),
      },
    };
  }
}

export default new CommentService(prisma, appEvents);
