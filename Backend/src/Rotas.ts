import { Router } from "express";
import UsuarioRotas from "./User/Routes/UsuarioRotas";

const Rota = Router();

Rota.use("/usuarios", UsuarioRotas);

export default Rota;
