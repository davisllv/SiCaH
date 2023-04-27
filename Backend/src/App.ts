import express, { Express } from "express";
const cors = require("cors");
import Rotas from "./Rotas";
import morgan from "morgan";

class App {
  Server: Express;

  constructor() {
    this.Server = express();
    this.Server.use(express.json());
    this.Server.use(morgan('dev'))
    this.Server.use(cors({
      allowedHeaders: ["authorization", "Content-Type"], // you can change the headers
      exposedHeaders: ["authorization"], // you can change the headers
      origin: "*",
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      preflightContinue: false
    }));
    this.Rotas();
  }

  Rotas (): void {
    this.Server.use(Rotas);
  }
}

export default new App().Server;
