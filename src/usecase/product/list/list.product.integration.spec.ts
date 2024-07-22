import { Sequelize } from "sequelize-typescript";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import ListProductUseCase from "./list.product.usecase";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import CreateProductUseCase from "../create/create.product.usecase";

describe("Integration test for listing product use case", () => {
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

  it("should list a product", async () => {
    const repository = new ProductRepository();
    const productListUseCase = new ListProductUseCase(repository);
    const producCreateUseCase = new CreateProductUseCase(repository);

    const productA = {
      type: "a",
      name: "Macbook Pro M3 Pro",
      price: 13000
    };
    const productB = {
      type: "b",
      name: "Iphone 15 Pro Max",
      price: 8000
    };
    await producCreateUseCase.execute(productA);
    await producCreateUseCase.execute(productB);
    const output = await productListUseCase.execute();

    expect(output.products.length).toBe(2);
    expect(output.products[0].name).toBe(productA.name);
    expect(output.products[0].price).toBe(productA.price);
    expect(output.products[1].name).toBe(productB.name);
    expect(output.products[1].price).toBe(productB.price * 2);
  });
});