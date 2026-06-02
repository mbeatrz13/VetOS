import { useState } from "react";
import { Plus, Search, Stethoscope, PawPrint, Calendar, FileText } from "lucide-react";

interface Atendimento {
  id: number;
  data: string;
  animal: string;
  tutor: string;
  veterinario: string;
  tipo: string;
  sintomas: string;
  diagnostico?: string;
  status: "em andamento" | "concluído" | "aguardando exames";
}

export function Atendimentos() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedAtendimento, setSelectedAtendimento] = useState<Atendimento | null>(null);

  const [atendimentos] = useState<Atendimento[]>([
    {
      id: 1,
      data: "2026-03-19 10:30",
      animal: "Rex",
      tutor: "João Silva",
      veterinario: "Dr. Carlos",
      tipo: "Consulta de rotina",
      sintomas: "Check-up geral",
      diagnostico: "Animal saudável, vacinação em dia",
      status: "concluído"
    },
    {
      id: 2,
      data: "2026-03-19 11:00",
      animal: "Mia",
      tutor: "Maria Santos",
      veterinario: "Dra. Ana",
      tipo: "Vacinação",
      sintomas: "Vacinação antirrábica",
      status: "em andamento"
    },
    {
      id: 3,
      data: "2026-03-19 14:00",
      animal: "Luna",
      tutor: "Ana Oliveira",
      veterinario: "Dra. Ana",
      tipo: "Consulta",
      sintomas: "Perda de apetite, letargia",
      diagnostico: "Possível infecção, exames solicitados",
      status: "aguardando exames"
    },
  ]);

  const handleViewDetails = (atendimento: Atendimento) => {
    setSelectedAtendimento(atendimento);
    setShowModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "concluído": return "bg-[var(--color-success)]/20 text-[var(--color-success)]";
      case "em andamento": return "bg-[var(--color-warning)]/20 text-[var(--color-warning)]";
      case "aguardando exames": return "bg-[var(--color-clinico)]/20 text-[var(--color-clinico-light)]";
      default: return "bg-[var(--color-text-muted)]/20 text-[var(--color-text-secondary)]";
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Atendimentos</h1>
          <p className="text-[var(--color-text-secondary)]">Registro e gerenciamento de atendimentos</p>
        </div>
        <button
          onClick={() => { setSelectedAtendimento(null); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--color-clinico)] hover:bg-[var(--color-clinico-border)] text-[var(--color-clinico-light)] rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          Novo Atendimento
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-[var(--color-clinico)] flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-[var(--color-clinico-light)]" />
            </div>
            <div>
              <p className="text-2xl font-bold">{atendimentos.length}</p>
              <p className="text-sm text-[var(--color-text-secondary)]">Total Hoje</p>
            </div>
          </div>
        </div>

        <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-[var(--color-warning)] flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold">{atendimentos.filter(a => a.status === 'em andamento').length}</p>
              <p className="text-sm text-[var(--color-text-secondary)]">Em Andamento</p>
            </div>
          </div>
        </div>

        <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-[var(--color-success)] flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold">{atendimentos.filter(a => a.status === 'concluído').length}</p>
              <p className="text-sm text-[var(--color-text-secondary)]">Concluídos</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por animal, tutor ou veterinário..."
            className="w-full pl-10 pr-4 py-3 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-clinico-border)] transition-colors"
          />
        </div>
      </div>

      {/* Atendimentos List */}
      <div className="space-y-4">
        {atendimentos.map((atendimento) => (
          <div
            key={atendimento.id}
            onClick={() => handleViewDetails(atendimento)}
            className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl p-6 hover:border-[var(--color-clinico-border)] transition-all cursor-pointer"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-[var(--color-clinico)] flex items-center justify-center">
                  <Stethoscope className="w-6 h-6 text-[var(--color-clinico-light)]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">{atendimento.tipo}</h3>
                  <div className="flex items-center gap-4 text-sm text-[var(--color-text-secondary)]">
                    <div className="flex items-center gap-1">
                      <PawPrint className="w-4 h-4" />
                      <span>{atendimento.animal}</span>
                    </div>
                    <span>•</span>
                    <span>{atendimento.tutor}</span>
                  </div>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(atendimento.status)}`}>
                {atendimento.status}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-[var(--color-text-secondary)] mb-1">Veterinário</p>
                <p className="font-medium">{atendimento.veterinario}</p>
              </div>
              <div>
                <p className="text-sm text-[var(--color-text-secondary)] mb-1">Data/Hora</p>
                <p className="font-medium">{atendimento.data}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-[var(--color-text-secondary)] mb-1">Sintomas</p>
                <p className="font-medium">{atendimento.sintomas}</p>
              </div>
              {atendimento.diagnostico && (
                <div className="md:col-span-2">
                  <p className="text-sm text-[var(--color-text-secondary)] mb-1">Diagnóstico</p>
                  <p className="font-medium">{atendimento.diagnostico}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-semibold mb-6">
              {selectedAtendimento ? 'Detalhes do Atendimento' : 'Novo Atendimento'}
            </h2>

            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-[var(--color-text-secondary)]">
                    Animal
                  </label>
                  <select 
                    defaultValue={selectedAtendimento?.animal}
                    className="w-full px-4 py-3 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-clinico-border)] transition-colors"
                  >
                    <option>Selecione o animal</option>
                    <option>Rex - João Silva</option>
                    <option>Mia - Maria Santos</option>
                    <option>Bob - Pedro Costa</option>
                    <option>Luna - Ana Oliveira</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-[var(--color-text-secondary)]">
                    Veterinário
                  </label>
                  <select 
                    defaultValue={selectedAtendimento?.veterinario}
                    className="w-full px-4 py-3 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-clinico-border)] transition-colors"
                  >
                    <option>Dr. Carlos</option>
                    <option>Dra. Ana</option>
                    <option>Dr. Roberto</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-[var(--color-text-secondary)]">
                    Tipo de Atendimento
                  </label>
                  <select 
                    defaultValue={selectedAtendimento?.tipo}
                    className="w-full px-4 py-3 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-clinico-border)] transition-colors"
                  >
                    <option>Consulta de rotina</option>
                    <option>Vacinação</option>
                    <option>Emergência</option>
                    <option>Cirurgia</option>
                    <option>Retorno</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-[var(--color-text-secondary)]">
                    Status
                  </label>
                  <select 
                    defaultValue={selectedAtendimento?.status}
                    className="w-full px-4 py-3 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-clinico-border)] transition-colors"
                  >
                    <option value="em andamento">Em andamento</option>
                    <option value="concluído">Concluído</option>
                    <option value="aguardando exames">Aguardando exames</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-[var(--color-text-secondary)]">
                  Sintomas / Motivo da Consulta
                </label>
                <textarea
                  defaultValue={selectedAtendimento?.sintomas}
                  className="w-full px-4 py-3 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-clinico-border)] transition-colors resize-none"
                  rows={4}
                  placeholder="Descreva os sintomas apresentados..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-[var(--color-text-secondary)]">
                  Diagnóstico
                </label>
                <textarea
                  defaultValue={selectedAtendimento?.diagnostico}
                  className="w-full px-4 py-3 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-clinico-border)] transition-colors resize-none"
                  rows={4}
                  placeholder="Diagnóstico e observações..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-[var(--color-text-secondary)]">
                  Tratamento Prescrito
                </label>
                <textarea
                  className="w-full px-4 py-3 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-clinico-border)] transition-colors resize-none"
                  rows={3}
                  placeholder="Medicamentos e orientações..."
                />
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
                  className="flex-1 px-4 py-3 bg-[var(--color-clinico)] hover:bg-[var(--color-clinico-border)] text-[var(--color-clinico-light)] rounded-lg transition-colors"
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
