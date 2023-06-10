import { Router } from "express";
import EquipamentoController from "../Controller/EquipamentoController";
import { autenticarJWT } from "../../lib/authJwt";

const Rota = Router();

Rota.get("/", autenticarJWT, EquipamentoController.show);
Rota.put("/:id", autenticarJWT, EquipamentoController.edit);
Rota.delete("/:id", autenticarJWT, EquipamentoController.delete);
Rota.post("/", autenticarJWT, EquipamentoController.create);

export default Rota;