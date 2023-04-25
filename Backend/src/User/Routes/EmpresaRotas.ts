import { Router } from "express";
import EmpresaController from "../Controller/EmpresaController";

const Rota = Router();

Rota.get("/", EmpresaController.index);
Rota.get("/:id", EmpresaController.show);
Rota.put("/:id", EmpresaController.edit);
Rota.delete("/:id", EmpresaController.delete);
Rota.post("/", EmpresaController.create);

export default Rota;
