import { createBrowserRouter } from "react-router";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { Layout } from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { PermissionGuard } from "./components/PermissionGuard";
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
    Component: () => (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, Component: Dashboard },
      {
        path: "tutores",
        Component: () => (
          <PermissionGuard requiredPath="/tutores">
            <Tutores />
          </PermissionGuard>
        ),
      },
      {
        path: "animais",
        Component: () => (
          <PermissionGuard requiredPath="/animais">
            <Animais />
          </PermissionGuard>
        ),
      },
      {
        path: "agenda",
        Component: () => (
          <PermissionGuard requiredPath="/agenda">
            <Agenda />
          </PermissionGuard>
        ),
      },
      {
        path: "atendimentos",
        Component: () => (
          <PermissionGuard requiredPath="/atendimentos">
            <Atendimentos />
          </PermissionGuard>
        ),
      },
      {
        path: "prontuarios",
        Component: () => (
          <PermissionGuard requiredPath="/prontuarios">
            <Prontuarios />
          </PermissionGuard>
        ),
      },
      {
        path: "prescricoes",
        Component: () => (
          <PermissionGuard requiredPath="/prescricoes">
            <Prescricoes />
          </PermissionGuard>
        ),
      },
      {
        path: "exames",
        Component: () => (
          <PermissionGuard requiredPath="/exames">
            <Exames />
          </PermissionGuard>
        ),
      },
      {
        path: "estoque",
        Component: () => (
          <PermissionGuard requiredPath="/estoque">
            <Estoque />
          </PermissionGuard>
        ),
      },
      {
        path: "funcionarios",
        Component: () => (
          <PermissionGuard requiredPath="/funcionarios">
            <Funcionarios />
          </PermissionGuard>
        ),
      },
      {
        path: "relatorios",
        Component: () => (
          <PermissionGuard requiredPath="/relatorios">
            <Relatorios />
          </PermissionGuard>
        ),
      },
    ],
  },
]);
