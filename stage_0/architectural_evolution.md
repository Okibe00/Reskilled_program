
---

# Architecture Document: Kanban API

**Context:** Building a collaborative board requires handling highly concurrent, state-heavy, and order-dependent data. This document outlines the core architectural decisions made to ensure data integrity, system performance, and real-time synchronization.

---

## 1. Ordering Strategy: Lexicographical Sorting (LexoRank)

**The Challenge:** Maintaining the specific, user-defined order of cards within lists without causing database deadlocks or requiring massive `UPDATE` queries when a single card is moved.

**The Solution:** The project implemented **LexoRank**, a lexicographical (string-based) sorting algorithm.

* **How it works:** Instead of sequential integers (1, 2, 3), cards are assigned alphabetic string values (e.g., `a`, `c`). When a card is dropped between two existing cards, the system calculates the lexicographical midpoint (e.g., `b`). If no direct midpoint exists, the algorithm appends a character (e.g., `an`), acting like a decimal point.
* **Why we chose it:** It provides mathematically infinite space between items. Moving or deleting a card is always an **O(1)** operation requiring exactly **one** database write. Sibling cards are never updated, ensuring maximum performance and eliminating the risk of database table locks at scale.

---

## 2. Conflict Handling: Optimistic Concurrency Control (OCC)

**The Challenge:** Preventing the "lost update" problem where two users edit the same card simultaneously, causing one user's changes to silently overwrite the other's, while still supporting fast, optimistic UI updates on the frontend.

**The Solution:** We implemented **Optimistic Concurrency Control** using a strict integer versioning system.

* **How it works:** Every card has a `@version` integer field starting at `1`. When the frontend sends an update (e.g., changing a description), it must include the version number it currently holds. The database attempts to update the row using a strict `WHERE id = ? AND version = ?` clause. On success, the version increments.
* **Why we chose it:** It guarantees atomic, database-level safety. If User B tries to save changes to `version 1` after User A has already bumped it to `version 2`, the database physically cannot find the row to update. The operation fails safely, and the API returns a `409 Conflict`, instructing the frontend to roll back its optimistic UI update and fetch the latest data.

---

## 3. Real-Time Approach: Event-Driven WebSockets

**The Challenge:** Ensuring all connected clients see card movements, creations, and updates instantly without refreshing the page, without tightly coupling the HTTP API to the WebSocket server.

**The Solution:** A **Decoupled Event-Driven Architecture** utilizing Node.js `EventEmitter` and a WebSocket Gateway (Socket.io).

* **How it works:** Our core HTTP Services (e.g., `CardService`) execute their database logic and simply emit a local, internal Node.js event (e.g., `appEvents.emit('CARD_MOVED', payload)`). A separate WebSocket Gateway listens to these generic events and broadcasts them exclusively to clients subscribed to the relevant `boardId` room.
* **Why we chose it:** Total separation of concerns. The HTTP APIs, background jobs, and test suites can trigger real-time UI updates without ever knowing that WebSockets exist. This makes the codebase highly testable and allows us to easily swap out the real-time transport layer in the future if needed.

---
