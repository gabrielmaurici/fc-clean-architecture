import Product from "../../../domain/product/entity/product";
import FindProductUseCase from "./find.product.usecase";

const product = new Product("123", "Macbook Pro M3 Pro", 13000);

const MockRepository = () => {
  return {
    find: jest.fn().mockReturnValue(Promise.resolve(product)),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  };
};

describe("Unit test find product use case", () => {
  it("should find a product", async () => {
    const productRepository = MockRepository();
    const productFindUseCase = new FindProductUseCase(productRepository);

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
