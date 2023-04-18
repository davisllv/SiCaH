import express, { Express } from "express";
import Rotas from "./Rotas";

class App {
  Server: Express;

  constructor() {
    this.Server = express();
    this.Rotas();
  }

  Rotas(): void {
    this.Server.use(Rotas);
  }
}

export default new App().Server;
