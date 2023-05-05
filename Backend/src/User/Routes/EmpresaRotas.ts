import { Router } from "express";
import EmpresaController from "../Controller/EmpresaController";
import { autenticarJWT } from "../../lib/authJwt";

const Rota = Router();

Rota.get("/", autenticarJWT, EmpresaController.index);
Rota.get("/:id", autenticarJWT, EmpresaController.show);
Rota.put("/:id", autenticarJWT, EmpresaController.edit);
Rota.delete("/:id", autenticarJWT, EmpresaController.delete);
Rota.post("/", autenticarJWT, EmpresaController.create);

export default Rota;
