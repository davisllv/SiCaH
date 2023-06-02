import App from "./App";

App.listen(process.env.PORT || 3000, () => {
  console.log(
    "---------------------------------------------------------------------------------------------------------"
  );
  console.log(
    "Servidor da API (Typescript) iniciado na porta 3000 em " + Date()
  );
  console.log(
    "---------------------------------------------------------------------------------------------------------"
  );
});
