import { Link } from "react-router";
import { 
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
  TrendingUp,
  AlertCircle,
  Clock
} from "lucide-react";

export function Dashboard() {
  const stats = [
    { label: "Consultas Hoje", value: "12", icon: Calendar, color: "recepcao" },
    { label: "Animais Cadastrados", value: "248", icon: PawPrint, color: "recepcao" },
    { label: "Atendimentos Mês", value: "156", icon: Stethoscope, color: "clinico" },
    { label: "Produtos em Estoque", value: "89", icon: Package, color: "admin" },
  ];

  const modules = [
    {
      category: "Recepção",
      color: "recepcao",
      items: [
        { path: "/tutores", icon: Users, label: "Tutores", description: "Cadastrar e gerenciar tutores" },
        { path: "/animais", icon: PawPrint, label: "Animais", description: "Cadastrar e gerenciar animais" },
        { path: "/agenda", icon: Calendar, label: "Agenda", description: "Agendar e gerenciar consultas" },
      ]
    },
    {
      category: "Clínico",
      color: "clinico",
      items: [
        { path: "/atendimentos", icon: Stethoscope, label: "Atendimentos", description: "Registrar atendimentos" },
        { path: "/prontuarios", icon: FileText, label: "Prontuários", description: "Consultar prontuários" },
        { path: "/prescricoes", icon: Pill, label: "Prescrições", description: "Prescrever medicamentos" },
        { path: "/exames", icon: TestTube, label: "Exames", description: "Solicitar e registrar exames" },
      ]
    },
    {
      category: "Administrativo",
      color: "admin",
      items: [
        { path: "/estoque", icon: Package, label: "Estoque", description: "Gerenciar estoque" },
        { path: "/funcionarios", icon: UserCog, label: "Funcionários", description: "Gerenciar funcionários" },
        { path: "/relatorios", icon: BarChart3, label: "Relatórios", description: "Gerar relatórios" },
      ]
    }
  ];

  const recentActivities = [
    { type: "consulta", animal: "Rex", tutor: "João Silva", time: "10:30", status: "concluída" },
    { type: "consulta", animal: "Mia", tutor: "Maria Santos", time: "11:00", status: "em andamento" },
    { type: "consulta", animal: "Bob", tutor: "Pedro Costa", time: "11:30", status: "agendada" },
    { type: "exame", animal: "Luna", tutor: "Ana Oliveira", time: "14:00", status: "pendente" },
  ];

  const alerts = [
    { type: "warning", message: "5 produtos com estoque baixo", icon: Package },
    { type: "info", message: "3 consultas agendadas para hoje", icon: Calendar },
    { type: "warning", message: "2 exames com resultados pendentes", icon: TestTube },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-[var(--color-text-secondary)]">Bem-vindo ao Vet.OS - Sistema de Gestão Veterinária</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div 
              key={stat.label}
              className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg bg-[var(--color-${stat.color})] flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 text-[var(--color-${stat.color}-light)]`} />
                </div>
                <TrendingUp className="w-5 h-5 text-[var(--color-success)]" />
              </div>
              <div>
                <p className="text-3xl font-bold mb-1">{stat.value}</p>
                <p className="text-sm text-[var(--color-text-secondary)]">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Alerts */}
      <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Alertas e Notificações</h2>
        <div className="space-y-3">
          {alerts.map((alert, index) => {
            const Icon = alert.icon;
            return (
              <div 
                key={index}
                className="flex items-center gap-3 p-3 rounded-lg bg-[var(--color-bg-card)] border border-[var(--color-border-light)]"
              >
                <AlertCircle className={`w-5 h-5 ${alert.type === 'warning' ? 'text-[var(--color-warning)]' : 'text-[var(--color-secondary)]'}`} />
                <Icon className="w-5 h-5 text-[var(--color-text-secondary)]" />
                <span className="flex-1">{alert.message}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modules Grid */}
      {modules.map((module) => (
        <div key={module.category}>
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-xl font-semibold">{module.category}</h2>
            <div className={`h-px flex-1 bg-[var(--color-${module.color}-border)] opacity-30`} />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {module.items.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="group bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl p-6 hover:border-[var(--color-border-light)] transition-all hover:scale-[1.02]"
                >
                  <div className={`w-12 h-12 rounded-lg bg-[var(--color-${module.color})] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-6 h-6 text-[var(--color-${module.color}-light)]`} />
                  </div>
                  <h3 className="text-lg font-semibold mb-1">{item.label}</h3>
                  <p className="text-sm text-[var(--color-text-secondary)]">{item.description}</p>
                </Link>
              );
            })}
          </div>
        </div>
      ))}

      {/* Recent Activities */}
      <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Atividades Recentes</h2>
        <div className="space-y-3">
          {recentActivities.map((activity, index) => (
            <div 
              key={index}
              className="flex items-center gap-4 p-4 rounded-lg bg-[var(--color-bg-card)] border border-[var(--color-border-light)]"
            >
              <Clock className="w-5 h-5 text-[var(--color-text-secondary)]" />
              <div className="flex-1">
                <p className="font-medium">{activity.animal} - {activity.tutor}</p>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  {activity.type === 'consulta' ? 'Consulta' : 'Exame'} às {activity.time}
                </p>
              </div>
              <span className={`
                px-3 py-1 rounded-full text-xs font-medium
                ${activity.status === 'concluída' ? 'bg-[var(--color-success)]/20 text-[var(--color-success)]' : ''}
                ${activity.status === 'em andamento' ? 'bg-[var(--color-secondary)]/20 text-[var(--color-secondary)]' : ''}
                ${activity.status === 'agendada' ? 'bg-[var(--color-warning)]/20 text-[var(--color-warning)]' : ''}
                ${activity.status === 'pendente' ? 'bg-[var(--color-text-muted)]/20 text-[var(--color-text-secondary)]' : ''}
              `}>
                {activity.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
