import { OutputFindProductDto } from "../../../usecase/product/find/find.product.dto";
import { OutputUpdateProductDto } from "../../../usecase/product/update/update.product.dto";
import { app, sequelize } from "../express";
import request from "supertest";

describe("E2E test for product", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("should create a product", async () => {
    const response = await request(app)
      .post("/product")
      .send({
        type: "a",
        name: "Macbook Pro M3 Pro",
        price: 13000
      });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Macbook Pro M3 Pro");
    expect(response.body.price).toBe(13000);
  });

  it("should not create a product", async () => {
    const response = await request(app).post("/product").send({
      name: "Macbook Pro M3 Pro",
    });
    expect(response.status).toBe(500);
  });

  it("should list all products", async () => {
    const response = await request(app)
      .post("/product")
      .send({
        type: "a",
        name: "Macbook Pro M3 Pro",
        price: 13000
      });
    expect(response.status).toBe(200);
    const response2 = await request(app)
      .post("/product")
      .send({
        type: "a",
        name: "Iphone 15 Pro Max",
        price: 8000
      });
    expect(response2.status).toBe(200);

    const listResponse = await request(app).get("/product").send();

    expect(listResponse.status).toBe(200);
    expect(listResponse.body.products.length).toBe(2);
    const product = listResponse.body.products[0];
    expect(product.name).toBe("Macbook Pro M3 Pro");
    expect(product.price).toBe(13000);
    const product2 = listResponse.body.products[1];
    expect(product2.name).toBe("Iphone 15 Pro Max");
    expect(product2.price).toBe(8000);

    const listResponseXML = await request(app)
    .get("/product")
    .set("Accept", "application/xml")
    .send();

    expect(listResponseXML.status).toBe(200);
    expect(listResponseXML.text).toContain(`<?xml version="1.0" encoding="UTF-8"?>`);
    expect(listResponseXML.text).toContain(`<products>`);
    expect(listResponseXML.text).toContain(`<product>`);
    expect(listResponseXML.text).toContain(`<name>Macbook Pro M3 Pro</name>`);
    expect(listResponseXML.text).toContain(`<price>13000</price>`);
    expect(listResponseXML.text).toContain(`</product>`);
    expect(listResponseXML.text).toContain(`<product>`);
    expect(listResponseXML.text).toContain(`<name>Iphone 15 Pro Max</name>`);
    expect(listResponseXML.text).toContain(`<price>8000</price>`);
    expect(listResponseXML.text).toContain(`</product>`);
    expect(listResponseXML.text).toContain(`</products>`);
  });

  it("should find a product", async () => {
    const response = await request(app)
      .post("/product")
      .send({
        type: "a",
        name: "Macbook Pro M3 Pro",
        price: 13000
      });
    expect(response.status).toBe(200);
    
    const id = response.body.id;
    const findResponse = await request(app).get(`/product/${id}`).send();

    expect(findResponse.status).toBe(200);
    const product: OutputFindProductDto = findResponse.body;
    expect(product.id).toBe(id);
    expect(product.name).toBe("Macbook Pro M3 Pro");
    expect(product.price).toBe(13000);

    const findResponseXML = await request(app)
    .get("/product")
    .set("Accept", "application/xml")
    .send();

    expect(findResponseXML.status).toBe(200);
    expect(findResponseXML.text).toContain(`<?xml version="1.0" encoding="UTF-8"?>`);
    expect(findResponseXML.text).toContain(`<id>${id}</id>`);
    expect(findResponseXML.text).toContain(`<name>Macbook Pro M3 Pro</name>`);
    expect(findResponseXML.text).toContain(`<price>13000</price>`);
  });

  it("should update a product", async () => {
    const responseCreate = await request(app)
      .post("/product")
      .send({
        type: "a",
        name: "Macbook Pro M3 Pro",
        price: 13000
      });

    expect(responseCreate.status).toBe(200);
    
    const id = responseCreate.body.id;
    const responseUpdate = await request(app)
      .put("/product")
      .send({
        id: id,
        name: "Macbook Air",
        price: 8000
      });

    expect(responseUpdate.statusCode).toBe(200);
    const product: OutputUpdateProductDto = responseUpdate.body;
    expect(product.id).toBe(id);
    expect(product.name).toBe("Macbook Air");
    expect(product.price).toBe(8000);
  });

  it("should not update a product", async () => {
    const responseCreate = await request(app)
      .post("/product")
      .send({
        type: "a",
        name: "Macbook Pro M3 Pro",
        price: 13000
      });

    expect(responseCreate.status).toBe(200);
    
    const responseUpdate = await request(app)
      .put("/product")
      .send({
        name: "Macbook Air",
        price: 8000
      });

    expect(responseUpdate.statusCode).toBe(500);
  });
});