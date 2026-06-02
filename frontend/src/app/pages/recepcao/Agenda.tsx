import { useState } from "react";
import { Calendar as CalendarIcon, Plus, Clock, PawPrint, User, Search, Edit, X } from "lucide-react";

interface Consulta {
  id: number;
  data: string;
  hora: string;
  animal: string;
  tutor: string;
  veterinario: string;
  tipo: string;
  status: "agendada" | "confirmada" | "concluida" | "cancelada";
}

export function Agenda() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [consultas] = useState<Consulta[]>([
    {
      id: 1,
      data: "2026-03-19",
      hora: "09:00",
      animal: "Rex",
      tutor: "João Silva",
      veterinario: "Dr. Carlos",
      tipo: "Consulta",
      status: "confirmada"
    },
    {
      id: 2,
      data: "2026-03-19",
      hora: "10:00",
      animal: "Mia",
      tutor: "Maria Santos",
      veterinario: "Dra. Ana",
      tipo: "Vacinação",
      status: "agendada"
    },
    {
      id: 3,
      data: "2026-03-19",
      hora: "11:00",
      animal: "Bob",
      tutor: "Pedro Costa",
      veterinario: "Dr. Carlos",
      tipo: "Retorno",
      status: "agendada"
    },
    {
      id: 4,
      data: "2026-03-19",
      hora: "14:00",
      animal: "Luna",
      tutor: "Ana Oliveira",
      veterinario: "Dra. Ana",
      tipo: "Consulta",
      status: "confirmada"
    },
    {
      id: 5,
      data: "2026-03-19",
      hora: "15:30",
      animal: "Max",
      tutor: "João Silva",
      veterinario: "Dr. Carlos",
      tipo: "Emergência",
      status: "agendada"
    },
  ]);

  const todayConsultas = consultas.filter(c => c.data === "2026-03-19");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmada": return "bg-[var(--color-success)]/20 text-[var(--color-success)]";
      case "agendada": return "bg-[var(--color-warning)]/20 text-[var(--color-warning)]";
      case "concluida": return "bg-[var(--color-secondary)]/20 text-[var(--color-secondary)]";
      case "cancelada": return "bg-[var(--color-error)]/20 text-[var(--color-error)]";
      default: return "bg-[var(--color-text-muted)]/20 text-[var(--color-text-secondary)]";
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case "Emergência": return "text-[var(--color-error)]";
      case "Vacinação": return "text-[var(--color-secondary)]";
      case "Retorno": return "text-[var(--color-warning)]";
      default: return "text-[var(--color-text-primary)]";
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Agenda</h1>
          <p className="text-[var(--color-text-secondary)]">Gerenciamento de consultas e agendamentos</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--color-recepcao)] hover:bg-[var(--color-recepcao-border)] text-[var(--color-recepcao-light)] rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          Agendar Consulta
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[var(--color-recepcao)] flex items-center justify-center">
              <CalendarIcon className="w-5 h-5 text-[var(--color-recepcao-light)]" />
            </div>
            <div>
              <p className="text-2xl font-bold">{todayConsultas.length}</p>
              <p className="text-sm text-[var(--color-text-secondary)]">Hoje</p>
            </div>
          </div>
        </div>
        
        <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[var(--color-warning)] flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold">{todayConsultas.filter(c => c.status === 'agendada').length}</p>
              <p className="text-sm text-[var(--color-text-secondary)]">Agendadas</p>
            </div>
          </div>
        </div>

        <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[var(--color-success)] flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold">{todayConsultas.filter(c => c.status === 'confirmada').length}</p>
              <p className="text-sm text-[var(--color-text-secondary)]">Confirmadas</p>
            </div>
          </div>
        </div>

        <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[var(--color-secondary)] flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold">{todayConsultas.filter(c => c.status === 'concluida').length}</p>
              <p className="text-sm text-[var(--color-text-secondary)]">Concluídas</p>
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
            className="w-full pl-10 pr-4 py-3 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-recepcao-border)] transition-colors"
          />
        </div>
      </div>

      {/* Consultas de Hoje */}
      <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Consultas de Hoje - 19/03/2026</h2>
        <div className="space-y-3">
          {todayConsultas.map((consulta) => (
            <div
              key={consulta.id}
              className="bg-[var(--color-bg-card)] border border-[var(--color-border-light)] rounded-lg p-4 hover:border-[var(--color-recepcao-border)] transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-16 text-center">
                    <div className="text-2xl font-bold text-[var(--color-recepcao-light)]">{consulta.hora}</div>
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <h3 className={`font-semibold mb-1 ${getTipoColor(consulta.tipo)}`}>
                        {consulta.tipo}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-[var(--color-text-secondary)]">
                        <div className="flex items-center gap-2">
                          <PawPrint className="w-4 h-4" />
                          <span>{consulta.animal}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span>{consulta.tutor}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(consulta.status)}`}>
                        {consulta.status}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-sm text-[var(--color-text-secondary)]">
                      Veterinário: {consulta.veterinario}
                    </p>
                    <div className="flex gap-2">
                      <button className="px-3 py-1.5 text-sm bg-[var(--color-bg-secondary)] hover:bg-[var(--color-border)] rounded-lg transition-colors">
                        Confirmar
                      </button>
                      <button className="p-1.5 hover:bg-[var(--color-bg-secondary)] rounded-lg transition-colors">
                        <Edit className="w-4 h-4 text-[var(--color-text-secondary)]" />
                      </button>
                      <button className="p-1.5 hover:bg-[var(--color-bg-secondary)] rounded-lg transition-colors">
                        <X className="w-4 h-4 text-[var(--color-error)]" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl p-6 w-full max-w-2xl">
            <h2 className="text-2xl font-semibold mb-6">Agendar Consulta</h2>

            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-[var(--color-text-secondary)]">
                    Animal
                  </label>
                  <select className="w-full px-4 py-3 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-recepcao-border)] transition-colors">
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
                  <select className="w-full px-4 py-3 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-recepcao-border)] transition-colors">
                    <option>Selecione o veterinário</option>
                    <option>Dr. Carlos</option>
                    <option>Dra. Ana</option>
                    <option>Dr. Roberto</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-[var(--color-text-secondary)]">
                    Data
                  </label>
                  <input
                    type="date"
                    defaultValue="2026-03-19"
                    className="w-full px-4 py-3 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-recepcao-border)] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-[var(--color-text-secondary)]">
                    Hora
                  </label>
                  <input
                    type="time"
                    className="w-full px-4 py-3 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-recepcao-border)] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-[var(--color-text-secondary)]">
                    Tipo de Atendimento
                  </label>
                  <select className="w-full px-4 py-3 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-recepcao-border)] transition-colors">
                    <option>Consulta</option>
                    <option>Retorno</option>
                    <option>Vacinação</option>
                    <option>Cirurgia</option>
                    <option>Emergência</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-[var(--color-text-secondary)]">
                    Status
                  </label>
                  <select className="w-full px-4 py-3 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-recepcao-border)] transition-colors">
                    <option>Agendada</option>
                    <option>Confirmada</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-[var(--color-text-secondary)]">
                  Observações
                </label>
                <textarea
                  className="w-full px-4 py-3 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-recepcao-border)] transition-colors resize-none"
                  rows={3}
                  placeholder="Observações sobre a consulta..."
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
                  className="flex-1 px-4 py-3 bg-[var(--color-recepcao)] hover:bg-[var(--color-recepcao-border)] text-[var(--color-recepcao-light)] rounded-lg transition-colors"
                >
                  Agendar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
