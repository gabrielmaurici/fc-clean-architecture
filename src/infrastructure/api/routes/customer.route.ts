import express, { Request, Response } from "express";
import CreateCustomerUseCase from "../../../usecase/customer/create/create.customer.usecase";
import ListCustomerUseCase from "../../../usecase/customer/list/list.customer.usecase";
import CustomerRepository from "../../customer/repository/sequelize/customer.repository";
import CustomerPresenter from "../presenters/customer.presenter";
import { InputFindCustomerDto } from "../../../usecase/customer/find/find.customer.dto";
import FindCustomerUseCase from "../../../usecase/customer/find/find.customer.usecase";
import UpdateCustomerUseCase from "../../../usecase/customer/update/update.customer.usecase";
import { InputUpdateCustomerDto } from "../../../usecase/customer/update/update.customer.dto";

export const customerRoute = express.Router();

customerRoute.post("/", async (req: Request, res: Response) => {
  const usecase = new CreateCustomerUseCase(new CustomerRepository());
  try {
    const customerDto = {
      name: req.body.name,
      address: {
        street: req.body.address.street,
        city: req.body.address.city,
        number: req.body.address.number,
        zip: req.body.address.zip,
      },
    };
    const output = await usecase.execute(customerDto);
    res.send(output);
  } catch (err) {
    res.status(500).send(err);
  }
});

customerRoute.get("/", async (req: Request, res: Response) => {
  const usecase = new ListCustomerUseCase(new CustomerRepository());
  const output = await usecase.execute({});

  res.format({
    json: async () => res.send(output),
    xml: async () => res.send(CustomerPresenter.listXML(output)),
  });
});


customerRoute.get("/:id", async (req: Request, res: Response) => {
  const id: InputFindCustomerDto = {
    id: req.params.id
  };
  const usecase = new FindCustomerUseCase(new CustomerRepository())
  const output = await usecase.execute(id);

  res.format({
    json: async () => res.send(output),
    xml: async () => res.send(CustomerPresenter.findXML(output)),
  });
});

customerRoute.put("/", async (req: Request, res: Response) => {
  const usecase = new UpdateCustomerUseCase(new CustomerRepository());
  try {
    const productDto: InputUpdateCustomerDto = {
      id: req.body.id,
      name: req.body.name,
      address: {
        street: req.body.address.street,
        number: req.body.address.number,
        zip: req.body.address.zip,
        city: req.body.address.city,
      }
    };
    const output = await usecase.execute(productDto);
    res.send(output);
  } catch (err) {
    res.status(500).send(err);
  }
});