import app from './app.js';
import http from 'http';
import { BoardGateway } from './gateways/board.gateway.js';

const PORT = process.env.PORT || 1000;
const server = http.createServer(app);
new BoardGateway(server);

app.listen(PORT, () => {
  console.log(`Welcome!, listening on port ${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});
