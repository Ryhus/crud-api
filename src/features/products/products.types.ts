export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: "electronics" | "books" | "clothing";
  inStock: boolean;
}

export interface ProductsRepo {
  findAll(): Product[];
  create(product: Product): Product;
  findByID(id: string): Product | undefined;
  delete(id: string): Product | undefined;
  update(product: Product): Product | undefined;
}
