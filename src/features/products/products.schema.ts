const productSchema = {
  type: "object",
  properties: {
    id: { type: "string" },
    name: { type: "string" },
    description: { type: "string" },
    price: { type: "number" },
    category: { type: "string" },
    inStock: { type: "boolean" },
  },
};

const productsErrorSchema = {
  type: "object",
  properties: {
    statusCode: { type: "number" },
    error: { type: "string" },
    message: { type: "string" },
    code: { type: "string" },
  },
};

export const createProductsShema = {
  body: {
    type: "object",
    required: ["name", "description", "price", "category", "inStock"],
    properties: {
      name: { type: "string" },
      description: { type: "string" },
      price: { type: "number", minimum: 1 },
      category: { type: "string", enum: ["electronics", "books", "clothing"] },
      inStock: { type: "boolean" },
    },
  },
  response: {
    201: productSchema,
  },
};

export const getProductbyIDSchema = {
  params: {
    type: "object",
    required: ["id"],
    properties: {
      id: { type: "string", format: "uuid" },
    },
  },
  response: {
    200: productSchema,
    404: productsErrorSchema,
    204: { type: "null" },
  },
};
