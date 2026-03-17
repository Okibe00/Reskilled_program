/**
 * @openapi
 * tags:
 *   - name: Real-Time Events (WebSockets)
 *     description: Socket.io connection details and event payloads
 *
 * paths:
 *   /socket.io/:
 *     get:
 *       tags: ["Real-Time Events (WebSockets)"]
 *       summary: How to connect to the WebSocket Server
 *       description: |
 *         **Connection URL:** `ws://<host>:3000`
 *
 *         **Authentication**
 *
 *         You must pass your JWT token during the handshake.
 *
 *         ```javascript
 *         import { io } from "socket.io-client";
 *
 *         const socket = io("http://localhost:3000", {
 *           auth: { token: "YOUR_JWT_TOKEN" }
 *         });
 *         ```
 *       responses:
 *         101:
 *           description: Switching Protocols (Connected)
 *         401:
 *           description: Authentication error (Invalid or missing token)
 *
 *   /socket.io/events/emit:
 *     post:
 *       tags: ["Real-Time Events (WebSockets)"]
 *       summary: Events the Client can Emit
 *       description: |
 *         These are the events your frontend can send to the server.
 *
 *         ### join_board
 *         Subscribes the user to board updates.
 *
 *         Example:
 *         `socket.emit('join_board', 'fc5e8ee3-c2a8-4b3d-86ae-422e6d3448a7')`
 *
 *         ### leave_board
 *         Unsubscribe from board updates.
 *
 *         Example:
 *         `socket.emit('leave_board', 'fc5e8ee3-c2a8-4b3d-86ae-422e6d3448a7')`
 *
 *       responses:
 *         200:
 *           description: Event acknowledged
 *
 *   /socket.io/events/listen:
 *     get:
 *       tags: ["Real-Time Events (WebSockets)"]
 *       summary: Events the Client Should Listen For
 *       description: |
 *         Events broadcast by the server.
 *
 *         ### card:created
 *         Fired when a card is added.
 *
 *         ### card:moved
 *         Fired when a card is moved.
 * 
 *         ### comment:added
 *         Fired when a comment is added.
 *
 *         Example payload:
 *
 *         ```json
 *         {
 *           "id": "fc5e8ee3-c2a8-4b3d-86ae-422e6d3448a7",
 *           "title": "Update README",
 *           "content": "something super important"
 *         }
 *         ```
 *
 *         Example listener:
 *
 *         `socket.on('card:moved', (card) => { ... })`
 *
 *       responses:
 *         200:
 *           description: Event received
 */