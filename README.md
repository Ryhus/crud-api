# Product Catalog API

This API is built with Node.js and Fastify and is structured into separate layers:

- **Routes layer** – handles HTTP endpoints
- **Products service** – contains business logic
- **Repository** – manages data storage

The server can run in two modes:

1. **Solo mode** – a single instance handles all requests.
2. **Distributed mode** – multiple instances are spawned using Node.js Cluster, one per CPU core. Each instance listens on a separate port, and incoming requests are distributed using a round-robin load balancing algorithm.

## 📦 Installation

1. Clone the repository and install dependencies:

```bash
npm install
```

2. Create a .env file and set the PORT variable:

```bash
PORT=4000
```

3. Run the app in development mode:

```bash
npm run start:dev
```

4. Build and run the app in production mode:

```bash
npm run start:prod
```

5. Run the app in distributed mode (multi-instance):

```bash
npm run start:multi
```

## ✨ Endpoints

All endpoints are prefixed with /api/products.

---

### GET /api/products

Retrieve all products.

**Response:**

- `200 OK` – returns an array of products

---

### GET /api/products/{productId}

Retrieve a product by ID.

**Response:**

- `200 OK` – product found
- `400 Bad Request` – invalid `productId` (not a UUID)
- `404 Not Found` – product not found

---

### POST /api/products

Create a new product.

**Request Body:**

```json
{
  "name": "string",
  "description": "string",
  "price": 100,
  "category": "electronics",
  "inStock": true
}
```

**Response:**

- `201 Created` – product found
- `400 Bad Request` – missing required fields or invalid data (e.g. price ≤ 0)

---

### PUT /api/products/{productId}

Update an existing product.

**Request Body:**
Partial or full product object.

**Response:**

- `200 OK` – product found
- `400 Bad Request` – invalid productId (not a UUID)
- `404 Not Found` – product not found

---

### DELETE /api/products/{productId}

Delete a product.

**Response:**

- `204 No Content` – product deleted
- `400 Bad Request` – invalid productId (not a UUID)
- `404 Not Found` – product not found

### Product Schema

```json
{
  "id": "string (uuid)",
  "name": "string",
  "description": "string",
  "price": "number (> 0)",
  "category": ["electronics", "books" "clothing"],
  "inStock": "boolean"
}
```
