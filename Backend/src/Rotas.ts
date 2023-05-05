import { Router } from "express";
import UsuarioRotas from "./User/Routes/UsuarioRotas";
import EmpresaRotas from "./User/Routes/EmpresaRotas";

const Rota = Router();
Rota.use("/usuario", UsuarioRotas);

Rota.use("/empresa", EmpresaRotas);

export default Rota;
