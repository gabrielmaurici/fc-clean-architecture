import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import Product from "../../../domain/product/entity/product";
import FindProductUseCase from "./find.product.usecase";

describe("Integration test find product use case", () => {
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

  it("should find a product", async () => {
    const productRepository = new ProductRepository();
    const productFindUseCase = new FindProductUseCase(productRepository);

    const product = new Product("123", "Macbook Pro M3 Pro", 13000);
    productRepository.create(product);
    
    const input = { id: "123" };
    const output = {
      id: "123",
      name: "Macbook Pro M3 Pro",
      price: 13000
    };

    const productDb = await productFindUseCase.execute(input)

    expect(output).toEqual(productDb);
  });
});
