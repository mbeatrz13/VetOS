import { useState } from "react";
import { Search, Plus, UserCog, Mail, Phone, Edit, Trash2, Calendar } from "lucide-react";

interface Funcionario {
  id: number;
  nome: string;
  cargo: string;
  email: string;
  telefone: string;
  admissao: string;
  status: "ativo" | "férias" | "afastado";
  foto?: string;
}

export function Funcionarios() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingFuncionario, setEditingFuncionario] = useState<Funcionario | null>(null);

  const [funcionarios] = useState<Funcionario[]>([
    {
      id: 1,
      nome: "Dr. Carlos Silva",
      cargo: "Veterinário",
      email: "carlos@vetos.com",
      telefone: "(11) 98765-1111",
      admissao: "2020-01-15",
      status: "ativo"
    },
    {
      id: 2,
      nome: "Dra. Ana Santos",
      cargo: "Veterinária",
      email: "ana@vetos.com",
      telefone: "(11) 98765-2222",
      admissao: "2021-03-10",
      status: "ativo"
    },
    {
      id: 3,
      nome: "Maria Oliveira",
      cargo: "Recepcionista",
      email: "maria@vetos.com",
      telefone: "(11) 98765-3333",
      admissao: "2022-05-20",
      status: "ativo"
    },
    {
      id: 4,
      nome: "João Costa",
      cargo: "Auxiliar Veterinário",
      email: "joao@vetos.com",
      telefone: "(11) 98765-4444",
      admissao: "2022-08-01",
      status: "ativo"
    },
    {
      id: 5,
      nome: "Dr. Roberto Lima",
      cargo: "Veterinário",
      email: "roberto@vetos.com",
      telefone: "(11) 98765-5555",
      admissao: "2019-11-05",
      status: "férias"
    },
  ]);

  const handleAdd = () => {
    setEditingFuncionario(null);
    setShowModal(true);
  };

  const handleEdit = (funcionario: Funcionario) => {
    setEditingFuncionario(funcionario);
    setShowModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ativo": return "bg-[var(--color-success)]/20 text-[var(--color-success)]";
      case "férias": return "bg-[var(--color-warning)]/20 text-[var(--color-warning)]";
      case "afastado": return "bg-[var(--color-error)]/20 text-[var(--color-error)]";
      default: return "bg-[var(--color-text-muted)]/20 text-[var(--color-text-secondary)]";
    }
  };

  const getCargoColor = (cargo: string) => {
    if (cargo.includes("Veterinári")) return "bg-[var(--color-clinico)]/20 text-[var(--color-clinico-light)]";
    if (cargo.includes("Recepcionista")) return "bg-[var(--color-recepcao)]/20 text-[var(--color-recepcao-light)]";
    return "bg-[var(--color-admin)]/20 text-[var(--color-admin-light)]";
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Funcionários</h1>
          <p className="text-[var(--color-text-secondary)]">Gerenciamento de equipe</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--color-admin)] hover:bg-[var(--color-admin-border)] text-[var(--color-admin-light)] rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          Novo Funcionário
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[var(--color-admin)] flex items-center justify-center">
              <UserCog className="w-5 h-5 text-[var(--color-admin-light)]" />
            </div>
            <div>
              <p className="text-2xl font-bold">{funcionarios.length}</p>
              <p className="text-sm text-[var(--color-text-secondary)]">Total</p>
            </div>
          </div>
        </div>

        <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[var(--color-success)] flex items-center justify-center">
              <UserCog className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold">{funcionarios.filter(f => f.status === 'ativo').length}</p>
              <p className="text-sm text-[var(--color-text-secondary)]">Ativos</p>
            </div>
          </div>
        </div>

        <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[var(--color-clinico)] flex items-center justify-center">
              <UserCog className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold">{funcionarios.filter(f => f.cargo.includes('Veterinári')).length}</p>
              <p className="text-sm text-[var(--color-text-secondary)]">Veterinários</p>
            </div>
          </div>
        </div>

        <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[var(--color-warning)] flex items-center justify-center">
              <UserCog className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold">{funcionarios.filter(f => f.status === 'férias').length}</p>
              <p className="text-sm text-[var(--color-text-secondary)]">Em Férias</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nome ou cargo..."
              className="w-full pl-10 pr-4 py-3 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-admin-border)] transition-colors"
            />
          </div>
          <select className="px-4 py-3 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-admin-border)] transition-colors">
            <option>Todos os cargos</option>
            <option>Veterinário</option>
            <option>Recepcionista</option>
            <option>Auxiliar</option>
          </select>
          <select className="px-4 py-3 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-admin-border)] transition-colors">
            <option>Todos os status</option>
            <option>Ativo</option>
            <option>Férias</option>
            <option>Afastado</option>
          </select>
        </div>
      </div>

      {/* Funcionários Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {funcionarios.map((funcionario) => (
          <div
            key={funcionario.id}
            className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl p-6 hover:border-[var(--color-border-light)] transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-[var(--color-admin)] flex items-center justify-center text-[var(--color-admin-light)] font-semibold text-lg">
                  {funcionario.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <h3 className="font-semibold mb-0.5">{funcionario.nome}</h3>
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${getCargoColor(funcionario.cargo)}`}>
                    {funcionario.cargo}
                  </span>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(funcionario.status)}`}>
                {funcionario.status}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                <Mail className="w-4 h-4" />
                <span className="truncate">{funcionario.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                <Phone className="w-4 h-4" />
                <span>{funcionario.telefone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                <Calendar className="w-4 h-4" />
                <span>Admissão: {new Date(funcionario.admissao).toLocaleDateString('pt-BR')}</span>
              </div>
            </div>

            <div className="flex gap-2 pt-3 border-t border-[var(--color-border)]">
              <button
                onClick={() => handleEdit(funcionario)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[var(--color-bg-card)] hover:bg-[var(--color-border)] rounded-lg transition-colors text-sm"
              >
                <Edit className="w-4 h-4" />
                Editar
              </button>
              <button className="px-3 py-2 bg-[var(--color-bg-card)] hover:bg-[var(--color-border)] rounded-lg transition-colors">
                <Trash2 className="w-4 h-4 text-[var(--color-error)]" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-semibold mb-6">
              {editingFuncionario ? 'Editar Funcionário' : 'Novo Funcionário'}
            </h2>

            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2 text-[var(--color-text-secondary)]">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    defaultValue={editingFuncionario?.nome}
                    className="w-full px-4 py-3 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-admin-border)] transition-colors"
                    placeholder="Nome completo"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-[var(--color-text-secondary)]">
                    Cargo
                  </label>
                  <select
                    defaultValue={editingFuncionario?.cargo}
                    className="w-full px-4 py-3 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-admin-border)] transition-colors"
                  >
                    <option>Veterinário</option>
                    <option>Auxiliar Veterinário</option>
                    <option>Recepcionista</option>
                    <option>Administrador</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-[var(--color-text-secondary)]">
                    Status
                  </label>
                  <select
                    defaultValue={editingFuncionario?.status}
                    className="w-full px-4 py-3 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-admin-border)] transition-colors"
                  >
                    <option value="ativo">Ativo</option>
                    <option value="férias">Férias</option>
                    <option value="afastado">Afastado</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-[var(--color-text-secondary)]">
                    Email
                  </label>
                  <input
                    type="email"
                    defaultValue={editingFuncionario?.email}
                    className="w-full px-4 py-3 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-admin-border)] transition-colors"
                    placeholder="email@exemplo.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-[var(--color-text-secondary)]">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    defaultValue={editingFuncionario?.telefone}
                    className="w-full px-4 py-3 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-admin-border)] transition-colors"
                    placeholder="(11) 98765-4321"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-[var(--color-text-secondary)]">
                    Data de Admissão
                  </label>
                  <input
                    type="date"
                    defaultValue={editingFuncionario?.admissao}
                    className="w-full px-4 py-3 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-admin-border)] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-[var(--color-text-secondary)]">
                    CRMV (para veterinários)
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-admin-border)] transition-colors"
                    placeholder="CRMV-SP 12345"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-3 bg-[var(--color-bg-card)] hover:bg-[var(--color-border)] rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-3 bg-[var(--color-admin)] hover:bg-[var(--color-admin-border)] text-[var(--color-admin-light)] rounded-lg transition-colors"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
