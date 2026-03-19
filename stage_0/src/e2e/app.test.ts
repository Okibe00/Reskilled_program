import request from 'supertest';
import app from '../app.js';
import prisma from '../config/database.js';

afterAll(async () => {
  console.log('Resetting database');
  prisma.$transaction([prisma.user.deleteMany(), prisma.board.deleteMany()]);
  console.log('Reset completed');
});

describe('Auth Controller (Integration)', () => {
  let token: string;
  const user = {
    password: 'strongPassword',
    name: 'okibe onmeje',
    email: 'okibe@test.com',
  };
  //first test should be signup
  it('/POST /Auth/Login - should return a token', async () => {
    const response = await request(app).post('/auth/signup').send(user);
    const { data } = response.body;
    expect(response.status).toBe(201);
    expect(data.createdUser.name).toBe('okibe onmeje');
    token = response.body.token;
  });
  it('/POST /Auth/Login - should return status 200', async () => {
    const response = await request(app)
      .post('/auth/login')
      .set(`Authorization`, `Bearer ${token}`)
      .send({
        password: user.password,
        email: user.email,
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
      .set(`Authorization`, `Bearer ${token}`);
    const [first] = response.body;
    console.log(first);
    expect(response.status).toBe(200);
  });
});
