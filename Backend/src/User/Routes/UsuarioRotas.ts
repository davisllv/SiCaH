import { Router } from "express";
import UsuarioController from "../Controller/UsuarioController";
import { autenticarJWT } from "../../lib/authJwt";

const Rota = Router();

Rota.get("/", autenticarJWT, UsuarioController.index);
Rota.get("/:id", autenticarJWT, UsuarioController.show);
Rota.put("/:id", autenticarJWT, UsuarioController.edit);
Rota.delete("/:id", autenticarJWT, UsuarioController.delete);
Rota.post("/", UsuarioController.create);
Rota.post("/login", UsuarioController.login);


export default Rota;