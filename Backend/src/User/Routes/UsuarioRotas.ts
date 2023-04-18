import { Router } from "express";
import UsuarioController from "../Controller/UsuarioController";

const Rota = Router();

Rota.get("/", UsuarioController.index);

Rota.get("/:id", UsuarioController.show);

export default Rota;
