import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger.js';
import userRoutes from './modules/user/user.routes.js';
import authRoutes from './modules/auth/auth.routes.js';
import boardRoutes from './modules/board/board.routes.js';
import { globalErrorHandler } from './common/middleware/error.middleware.js';
const PORT = 8080;
const app = express();

//Middleware
app.use(express.json());

//Swagger documenation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//Routes
app.use(userRoutes);
app.use(authRoutes);
app.use(boardRoutes);

//global error handler
app.use(globalErrorHandler);

app.listen(PORT, () => {
  console.log('Welcome okibe ogomola onmeje');
});
