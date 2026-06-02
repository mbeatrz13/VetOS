import { Outlet, NavLink, useNavigate } from "react-router";
import { 
  LayoutDashboard, 
  Users, 
  PawPrint, 
  Calendar, 
  Stethoscope, 
  FileText, 
  Pill, 
  TestTube, 
  Package, 
  UserCog, 
  BarChart3,
  LogOut,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";

export function Layout() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    navigate("/login");
  };

  const menuItems = [
    { path: "/", icon: LayoutDashboard, label: "Dashboard", end: true },
    { divider: "Recepção", color: "recepcao" },
    { path: "/tutores", icon: Users, label: "Tutores" },
    { path: "/animais", icon: PawPrint, label: "Animais" },
    { path: "/agenda", icon: Calendar, label: "Agenda" },
    { divider: "Clínico", color: "clinico" },
    { path: "/atendimentos", icon: Stethoscope, label: "Atendimentos" },
    { path: "/prontuarios", icon: FileText, label: "Prontuários" },
    { path: "/prescricoes", icon: Pill, label: "Prescrições" },
    { path: "/exames", icon: TestTube, label: "Exames" },
    { divider: "Administrativo", color: "admin" },
    { path: "/estoque", icon: Package, label: "Estoque" },
    { path: "/funcionarios", icon: UserCog, label: "Funcionários" },
    { path: "/relatorios", icon: BarChart3, label: "Relatórios" },
  ];

  return (
    <div className="flex h-screen bg-[var(--color-bg-dark)]">
      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-[var(--color-bg-secondary)] border-r border-[var(--color-border)]
        transform transition-transform duration-200 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-[var(--color-border)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[var(--color-primary)] flex items-center justify-center">
                  <PawPrint className="w-6 h-6 text-[var(--color-secondary)]" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">
                    <span className="text-[var(--color-primary-light)]">Vet</span>
                    <span className="text-[var(--color-accent)]">.</span>
                    <span className="text-[var(--color-secondary)]">OS</span>
                  </h1>
                  <p className="text-xs text-[var(--color-text-secondary)]">Gestão Veterinária</p>
                </div>
              </div>
              <button 
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden text-[var(--color-text-secondary)] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-1">
              {menuItems.map((item, index) => {
                if ('divider' in item) {
                  return (
                    <li key={index} className="pt-4 pb-2 px-3">
                      <div className={`text-xs font-semibold uppercase tracking-wider text-[var(--color-${item.color}-light)]`}>
                        {item.divider}
                      </div>
                      <div className={`h-px mt-2 bg-[var(--color-${item.color}-border)] opacity-30`} />
                    </li>
                  );
                }

                const Icon = item.icon;
                return (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      end={item.end}
                      onClick={() => setSidebarOpen(false)}
                      className={({ isActive }) => `
                        flex items-center gap-3 px-3 py-2.5 rounded-lg
                        transition-colors duration-150
                        ${isActive 
                          ? 'bg-[var(--color-primary)] text-white' 
                          : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-card)] hover:text-white'
                        }
                      `}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-[var(--color-border)]">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-[var(--color-bg-card)]">
              <div className="w-10 h-10 rounded-full bg-[var(--color-secondary)] flex items-center justify-center text-[var(--color-primary)] font-semibold">
                AD
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">Admin</p>
                <p className="text-xs text-[var(--color-text-secondary)] truncate">admin@vet.os</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-[var(--color-bg-secondary)] rounded-lg transition-colors"
                title="Sair"
              >
                <LogOut className="w-4 h-4 text-[var(--color-text-secondary)]" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile header */}
        <header className="lg:hidden bg-[var(--color-bg-secondary)] border-b border-[var(--color-border)] p-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-[var(--color-text-secondary)] hover:text-white"
          >
            <Menu className="w-6 h-6" />
          </button>
        </header>

        {/* Page content */}
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
