import { createBrowserRouter } from "react-router";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { Layout } from "./components/Layout";
import { Tutores } from "./pages/recepcao/Tutores";
import { Animais } from "./pages/recepcao/Animais";
import { Agenda } from "./pages/recepcao/Agenda";
import { Atendimentos } from "./pages/clinico/Atendimentos";
import { Prontuarios } from "./pages/clinico/Prontuarios";
import { Prescricoes } from "./pages/clinico/Prescricoes";
import { Exames } from "./pages/clinico/Exames";
import { Estoque } from "./pages/admin/Estoque";
import { Funcionarios } from "./pages/admin/Funcionarios";
import { Relatorios } from "./pages/admin/Relatorios";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "tutores", Component: Tutores },
      { path: "animais", Component: Animais },
      { path: "agenda", Component: Agenda },
      { path: "atendimentos", Component: Atendimentos },
      { path: "prontuarios", Component: Prontuarios },
      { path: "prescricoes", Component: Prescricoes },
      { path: "exames", Component: Exames },
      { path: "estoque", Component: Estoque },
      { path: "funcionarios", Component: Funcionarios },
      { path: "relatorios", Component: Relatorios },
    ],
  },
]);
