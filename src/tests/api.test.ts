import { buildServer } from "../server.js";
import { describe, test, expect } from "vitest";

const testServer = buildServer();

describe("api/products", () => {
  test("GET returns all records", async () => {
    const response = await testServer.inject({
      method: "GET",
      url: "/api/products",
    });

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(JSON.parse(response.body))).toBe(true);
  });

  test("POST creates products", async () => {
    const newProduct = {
      name: "Test",
      description: "Test product",
      price: 100,
      category: "electronics",
      inStock: true,
    };

    const response = await testServer.inject({
      method: "POST",
      url: "/api/products",
      payload: newProduct,
    });

    expect(response.statusCode).toBe(201);
    const createDProduct = JSON.parse(response.body);
    expect(createDProduct.id).toBeDefined();
    expect(createDProduct.name).toBe(newProduct.name);
  });

  test("POST throws on absent required field", async () => {
    const newProduct = {
      name: "Test",
      price: 100,
      category: "electronics",
      inStock: true,
    };

    const response = await testServer.inject({
      method: "POST",
      url: "/api/products",
      payload: newProduct,
    });

    expect(response.statusCode).toBe(400);
  });

  test("POST throws on negative price and 0", async () => {
    const newProduct = {
      name: "Test",
      description: "Test product",
      price: 0,
      category: "electronics",
      inStock: true,
    };

    const responseWithZero = await testServer.inject({
      method: "POST",
      url: "/api/products",
      payload: newProduct,
    });
    expect(responseWithZero.statusCode).toBe(400);

    newProduct.price = -1;
    const responseWithNegative = await testServer.inject({
      method: "POST",
      url: "/api/products",
      payload: newProduct,
    });
    expect(responseWithZero.statusCode).toBe(400);
  });

  test("POST throws on wrong category", async () => {
    const newProduct = {
      name: "Test",
      description: "Test product",
      price: 0,
      category: "electro",
      inStock: true,
    };

    const responseWithZero = await testServer.inject({
      method: "POST",
      url: "/api/products",
      payload: newProduct,
    });
    expect(responseWithZero.statusCode).toBe(400);
  });
});

describe("api/products/id", () => {
  test("GET throws on invalid uuid", async () => {
    const response = await testServer.inject({
      method: "GET",
      url: "/api/products/invalid",
    });

    expect(response.statusCode).toBe(400);
  });

  test("GET returns the product after creating it", async () => {
    const newProduct = {
      name: "Test",
      description: "Test product",
      price: 100,
      category: "electronics",
      inStock: true,
    };

    const response = await testServer.inject({
      method: "POST",
      url: "/api/products",
      payload: newProduct,
    });
    const createdProduct = JSON.parse(response.body);
    expect(response.statusCode).toBe(201);

    const responseGetById = await testServer.inject({
      method: "GET",
      url: "/api/products/" + createdProduct.id,
    });
    expect(responseGetById.statusCode).toBe(200);
  });

  test("GET throws on not found product with valid id", async () => {
    const response = await testServer.inject({
      method: "GET",
      url: "/api/products/f47ac10b-58cc-4372-a567-0e02b2c3d479",
    });
    expect(response.statusCode).toBe(404);
  });

  test("DELETE thows on not found product with valid id", async () => {
    const response = await testServer.inject({
      method: "DELETE",
      url: "/api/products/f47ac10b-58cc-4372-a567-0e02b2c3d479",
    });
    expect(response.statusCode).toBe(404);
  });

  test("DELETE thows on invalid id", async () => {
    const response = await testServer.inject({
      method: "DELETE",
      url: "/api/products/invalid",
    });
    expect(response.statusCode).toBe(400);
  });

  test("DELETE deletes product after creating it", async () => {
    const newProduct = {
      name: "Test",
      description: "Test product",
      price: 100,
      category: "electronics",
      inStock: true,
    };

    const response = await testServer.inject({
      method: "POST",
      url: "/api/products",
      payload: newProduct,
    });
    const createdProduct = JSON.parse(response.body);
    expect(response.statusCode).toBe(201);

    const deleteResponse = await testServer.inject({
      method: "DELETE",
      url: "/api/products/" + createdProduct.id,
    });
    expect(deleteResponse.statusCode).toBe(204);
  });

  test("PUT thows on invalid id", async () => {
    const response = await testServer.inject({
      method: "PUT",
      url: "/api/products/invalid",
    });
    expect(response.statusCode).toBe(400);
  });

  test("PUT thows on not found element with valid id", async () => {
    const response = await testServer.inject({
      method: "PUT",
      url: "/api/products/f47ac10b-58cc-4372-a567-0e02b2c3d479",
    });
    expect(response.statusCode).toBe(404);
  });

  test("PUT updates product after it creation", async () => {
    const newProduct = {
      name: "Test",
      description: "Test product",
      price: 100,
      category: "electronics",
      inStock: true,
    };

    const response = await testServer.inject({
      method: "POST",
      url: "/api/products",
      payload: newProduct,
    });
    const createdProduct = JSON.parse(response.body);
    expect(response.statusCode).toBe(201);

    const updatedPayload = {
      name: "Test",
      description: "Test product",
      price: 50,
      category: "electronics",
      inStock: true,
    };

    const updateResponse = await testServer.inject({
      method: "PUT",
      url: "/api/products/" + createdProduct.id,
      payload: updatedPayload,
    });
    const updatedProduct = JSON.parse(updateResponse.body);
    expect(updateResponse.statusCode).toBe(200);
    expect(updatedProduct.price).toBe(50);
  });
});

test("throw on invalid root", async () => {
  const response = await testServer.inject({
    method: "GET",
    url: "/api/invalid/root",
  });
  expect(response.statusCode).toBe(404);
});
