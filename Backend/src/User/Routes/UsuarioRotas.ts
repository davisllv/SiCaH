import { Router } from "express";
import UsuarioController from "../Controller/UsuarioController";

const Rota = Router();

Rota.get("/", UsuarioController.index);
Rota.get("/:id", UsuarioController.show);
Rota.put("/:id", UsuarioController.edit);
Rota.delete("/:id", UsuarioController.delete);
Rota.post("/", UsuarioController.create);

export default Rota;
