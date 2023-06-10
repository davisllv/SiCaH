import { Router } from "express";
import UsuarioRotas from "./User/Routes/UsuarioRotas";
import EmpresaRotas from "./User/Routes/EmpresaRotas";
import EquipamentoRotas from "./User/Routes/EquipamentoRotas";


const Rota = Router();
Rota.use("/usuario", UsuarioRotas);
Rota.use("/equipamento", EquipamentoRotas);
Rota.use("/empresa", EmpresaRotas);

export default Rota;
