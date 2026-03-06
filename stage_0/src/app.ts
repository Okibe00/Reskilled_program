import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger.js';
import userRoutes from './modules/user/user.routes.js';
import authRoutes from './modules/auth/auth.routes.js';
import boardRoutes from './modules/board/board.routes.js';
import columnRoutes from './modules/column/column.routes.js';
import cardRoutes from './modules/card/card.routes.js';
import { globalErrorHandler } from './common/middleware/error.middleware.js';
const PORT = process.env.PORT || 1000;
const app = express();

//Middleware
app.use(express.json());

//Swagger documenation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/api-docs.json', (req, res) => {
  res.json(swaggerSpec);
});
//Routes
app.use(userRoutes);
app.use(authRoutes);
app.use(boardRoutes);
app.use(columnRoutes);
app.use(cardRoutes);

//global error handler
app.use(globalErrorHandler);

app.listen(PORT, () => {
  console.log(`Welcome!, listening on port ${PORT}`);
});
