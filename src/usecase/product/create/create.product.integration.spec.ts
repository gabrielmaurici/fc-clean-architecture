import { Sequelize } from "sequelize-typescript";
import CreateProductUseCase from "./create.product.usecase";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";

const input = {
  type: "a",
  name: "Macbook Pro M3 Pro",
  price: 13000
};

describe("Unit test create product use case", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([ProductModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });


  it("should create a product", async () => {
    const productRepository = new ProductRepository();
    const productCreateUseCase = new CreateProductUseCase(productRepository);

    const output = await productCreateUseCase.execute(input);

    expect(output).toEqual({
      id: expect.any(String),
      name: "Macbook Pro M3 Pro",
      price: 13000
    });
  });

  it("should thrown an error when name is empty and price is less than zero", async () => {
    const productRepository = new ProductRepository();
    const productCreateUseCase = new CreateProductUseCase(productRepository);

    input.price = -1;
    input.name = "";
    await expect(productCreateUseCase.execute(input)).rejects.toThrow(
      "product: Name is required,product: Price must be greater than zero"
    );
  });
});
