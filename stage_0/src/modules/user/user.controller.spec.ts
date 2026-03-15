// import request from 'supertest';
// import jwt from 'jsonwebtoken';
// import app from '../../app.js';
// import { prismaMock } from '../../__mock__/prisma.mock.js';

// describe('User Controller (Integration)', () => {
//   const mockToken = jwt.sign(
//     { id: 1, email: 'admin@test.com' },
//     process.env.JWT_SECRET!
//   );

//   it('GET /users - should return 401 if no token is provided', async () => {
//     const response = await request(app).get('/users');
//     expect(response.status).toBe(401);
//   });

//   it('GET /users - should return users when authenticated', async () => {
//     prismaMock.user.findMany.mockResolvedValue([]);

//     const response = await request(app)
//       .get('/users')
//       .set('Authorization', `Bearer ${mockToken}`);

//     expect(response.status).toBe(200);
//     expect(Array.isArray(response.body)).toBe(true);
//   });
// });
