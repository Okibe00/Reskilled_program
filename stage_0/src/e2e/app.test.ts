import request from 'supertest';
import app from '../app.js';
import prisma from '../config/database.js';
import { appEvents } from '../common/events/event-emitter.js';
import { jest } from '@jest/globals';
let testUser = {
  name: 'okibe  onmeje',
  email: 'send_to_okibe@okibe.space',
  password: 'superStrongPassword',
};
let fetchedData: any;
let token: string;
let createdUser: any;
beforeAll(async () => {
  const res = await request(app).post('/auth/signup').send(testUser);
  token = res.body.data.token;
  createdUser = res.body.data.createdUser;
  jest.spyOn(appEvents, 'emit').mockImplementation(() => true);
});

afterAll(async () => {
  console.log('Resetting database...');
  await prisma.$transaction([
    prisma.comment.deleteMany(),
    prisma.card.deleteMany(),
    prisma.column.deleteMany(),
    prisma.board.deleteMany(),
    prisma.user.deleteMany(),
  ]);
  console.log('Reset completed!');
});

//auth
describe('Auth Controller (Integration) login test', () => {
  it('/POST /Auth/Login - should return status 200', async () => {
    const response = await request(app).post('/auth/login').send({
      password: testUser.password,
      email: testUser.email,
    });
    const { data } = response.body;
    token = data.token;
    expect(response.status).toBe(200);
    expect(data.token).not.toBeNull();
  });
  it('GET /User - should return 401 if no token is provided', async () => {
    const response = await request(app).get('/users');
    expect(response.status).toBe(401);
  });

  it('GET /users - should return users when authenticated', async () => {
    const response = await request(app)
      .get('/users')
      .set(`authorization`, `Bearer ${token}`);
    expect(response.status).toBe(200);
  });
});

describe('Collaborative board integration test - Board, Card, and Comment Flow', () => {
  let boardId: string;
  let sourceListId: string;
  let targetListId: string;
  let cardId: string;
  let currentCardVersion: number;

  it('POST /board - should create a new board', async () => {
    const response = await request(app)
      .post('/board')
      .set('authorization', `Bearer ${token}`)
      .send({ title: 'Engineering Sprint 1', userId: createdUser.id });

    const { data } = response.body;

    expect(response.status).toBe(201);
    expect(data.id).toBeDefined();
    expect(data.title).toBe('Engineering Sprint 1');

    boardId = data.id;
  });

  it('POST /column - should create a source and target list i.e columns', async () => {
    const res1 = await request(app)
      .post('/column')
      .set('authorization', `Bearer ${token}`)
      .send({ name: 'To Do', boardId, positionIndex: 1 });
    sourceListId = res1.body.data.id;

    const res2 = await request(app)
      .post('/column')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'In Progress', boardId, positionIndex: 1 });
    targetListId = res2.body.data.id;

    expect(sourceListId).toBeDefined();
    expect(targetListId).toBeDefined();
  });

  it('POST /card - should create a new card in the source list', async () => {
    const response = await request(app)
      .post('/card')
      .set('authorization', `Bearer ${token}`)
      .send({
        title: 'Implement WebSockets',
        columnId: sourceListId,
        positionIndex: 1,
        content: 'This will allow RT',
      });

    const { data } = response.body;

    expect(response.status).toBe(201);
    expect(data.id).toBeDefined();
    expect(data.rank).toBeDefined();
    expect(data.version).toBe(1);

    cardId = data.id;
    currentCardVersion = data.version;
  });

  it('PUT /card/rank - should successfully move the card to the target list', async () => {
    if (cardId && targetListId) {
      const response = await request(app)
        .put(`/card/rank`)
        .set('authorization', `Bearer ${token}`)
        .query({
          cardId,
          columnId: targetListId,
        });
      const { data } = response.body;

      expect(response.status).toBe(200);
      expect(data.columnId).toBe(targetListId);
      expect(data.version).toBe(2);

      currentCardVersion = data.version;
    }
  });

  it('POST /comments - should add a comment to the card', async () => {
    const response = await request(app)
      .post(`/comments`)
      .set('authorization', `Bearer ${token}`)
      .send({
        userId: createdUser.id,
        cardId: cardId,
        content: 'Moving this to In Progress, starting work now.',
      });

    const { data } = response.body;
    expect(appEvents.emit).toHaveBeenCalled();
    expect(response.status).toBe(201);
    expect(data.content).toBe('Moving this to In Progress, starting work now.');
    expect(data.cardId).toBe(cardId);
    expect(data.id).toBeDefined();
  });
});
