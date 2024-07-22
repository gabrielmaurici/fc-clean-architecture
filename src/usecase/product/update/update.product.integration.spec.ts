import { Sequelize } from "sequelize-typescript";
import UpdateProductUseCase from "./update.product.usecase";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import CreateProductUseCase from "../create/create.product.usecase";

const input = {
  id: "",
  name: "Macbook Pro M3 Pro",
  price: 13000
};

describe("Integration test for product update use case", () => {
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


  it("should update a product", async () => {
    const productRepository = new ProductRepository();
    const productUpdateUseCase = new UpdateProductUseCase(productRepository);
    const productCreateUseCase = new CreateProductUseCase(productRepository);
    const createInput = {
      type: "a",
      name: "Macbook Pro M3 Pro",
      price : 13000
    }

    const productCreate = await productCreateUseCase.execute(createInput);
    input.id = productCreate.id;
    const output = await productUpdateUseCase.execute(input);

    expect(output).toEqual(input);
  });
});
