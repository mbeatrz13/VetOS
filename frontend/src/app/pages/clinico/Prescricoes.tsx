import { useState } from "react";
import { Search, Plus, Pill, PawPrint, Calendar, Clock } from "lucide-react";

interface Prescricao {
  id: number;
  data: string;
  animal: string;
  tutor: string;
  veterinario: string;
  medicamento: string;
  dosagem: string;
  frequencia: string;
  duracao: string;
  observacoes: string;
}

export function Prescricoes() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedPrescricao, setSelectedPrescricao] = useState<Prescricao | null>(null);

  const [prescricoes] = useState<Prescricao[]>([
    {
      id: 1,
      data: "2026-03-19",
      animal: "Rex",
      tutor: "João Silva",
      veterinario: "Dr. Carlos",
      medicamento: "Amoxicilina",
      dosagem: "500mg",
      frequencia: "2x ao dia",
      duracao: "7 dias",
      observacoes: "Administrar junto com alimento"
    },
    {
      id: 2,
      data: "2026-03-19",
      animal: "Luna",
      tutor: "Ana Oliveira",
      veterinario: "Dra. Ana",
      medicamento: "Prednisolona",
      dosagem: "5mg",
      frequencia: "1x ao dia",
      duracao: "5 dias",
      observacoes: "Administrar pela manhã, em jejum"
    },
    {
      id: 3,
      data: "2026-03-18",
      animal: "Mia",
      tutor: "Maria Santos",
      veterinario: "Dra. Ana",
      medicamento: "Vermífugo",
      dosagem: "1 comprimido",
      frequencia: "Dose única",
      duracao: "1 dia",
      observacoes: "Repetir após 15 dias"
    },
  ]);

  const handleViewDetails = (prescricao: Prescricao) => {
    setSelectedPrescricao(prescricao);
    setShowModal(true);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Prescrições</h1>
          <p className="text-[var(--color-text-secondary)]">Gerenciamento de prescrições médicas</p>
        </div>
        <button
          onClick={() => { setSelectedPrescricao(null); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--color-clinico)] hover:bg-[var(--color-clinico-border)] text-[var(--color-clinico-light)] rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nova Prescrição
        </button>
      </div>

      {/* Search */}
      <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por animal, medicamento ou tutor..."
            className="w-full pl-10 pr-4 py-3 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-clinico-border)] transition-colors"
          />
        </div>
      </div>

      {/* Prescricoes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {prescricoes.map((prescricao) => (
          <div
            key={prescricao.id}
            onClick={() => handleViewDetails(prescricao)}
            className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl p-6 hover:border-[var(--color-clinico-border)] transition-all cursor-pointer"
          >
            <div className="flex items-start gap-3 mb-4">
              <div className="w-12 h-12 rounded-lg bg-[var(--color-clinico)] flex items-center justify-center">
                <Pill className="w-6 h-6 text-[var(--color-clinico-light)]" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold mb-1 truncate">{prescricao.medicamento}</h3>
                <p className="text-sm text-[var(--color-text-secondary)] truncate">{prescricao.dosagem}</p>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <PawPrint className="w-4 h-4 text-[var(--color-text-secondary)]" />
                <span className="text-[var(--color-text-secondary)]">{prescricao.animal} - {prescricao.tutor}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-[var(--color-text-secondary)]" />
                <span className="text-[var(--color-text-secondary)]">{prescricao.frequencia}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-[var(--color-text-secondary)]" />
                <span className="text-[var(--color-text-secondary)]">{prescricao.duracao}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-[var(--color-border)]">
              <p className="text-xs text-[var(--color-text-secondary)]">
                Prescritor: {prescricao.veterinario}
              </p>
              <p className="text-xs text-[var(--color-text-secondary)]">
                Data: {new Date(prescricao.data).toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-semibold mb-6">
              {selectedPrescricao ? 'Detalhes da Prescrição' : 'Nova Prescrição'}
            </h2>

            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-[var(--color-text-secondary)]">
                    Animal
                  </label>
                  <select
                    defaultValue={selectedPrescricao?.animal}
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
                    defaultValue={selectedPrescricao?.veterinario}
                    className="w-full px-4 py-3 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-clinico-border)] transition-colors"
                  >
                    <option>Dr. Carlos</option>
                    <option>Dra. Ana</option>
                    <option>Dr. Roberto</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-[var(--color-text-secondary)]">
                    Medicamento
                  </label>
                  <input
                    type="text"
                    defaultValue={selectedPrescricao?.medicamento}
                    className="w-full px-4 py-3 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-clinico-border)] transition-colors"
                    placeholder="Nome do medicamento"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-[var(--color-text-secondary)]">
                    Dosagem
                  </label>
                  <input
                    type="text"
                    defaultValue={selectedPrescricao?.dosagem}
                    className="w-full px-4 py-3 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-clinico-border)] transition-colors"
                    placeholder="Ex: 500mg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-[var(--color-text-secondary)]">
                    Frequência
                  </label>
                  <input
                    type="text"
                    defaultValue={selectedPrescricao?.frequencia}
                    className="w-full px-4 py-3 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-clinico-border)] transition-colors"
                    placeholder="Ex: 2x ao dia"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-[var(--color-text-secondary)]">
                    Duração do Tratamento
                  </label>
                  <input
                    type="text"
                    defaultValue={selectedPrescricao?.duracao}
                    className="w-full px-4 py-3 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-clinico-border)] transition-colors"
                    placeholder="Ex: 7 dias"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-[var(--color-text-secondary)]">
                  Observações / Instruções
                </label>
                <textarea
                  defaultValue={selectedPrescricao?.observacoes}
                  className="w-full px-4 py-3 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-clinico-border)] transition-colors resize-none"
                  rows={4}
                  placeholder="Instruções de uso, observações importantes..."
                />
              </div>

              {selectedPrescricao && (
                <div className="bg-[var(--color-clinico)]/10 border border-[var(--color-clinico-border)] rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Informações da Prescrição</h4>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    Data: {new Date(selectedPrescricao.data).toLocaleDateString('pt-BR')}
                  </p>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    Prescritor: {selectedPrescricao.veterinario}
                  </p>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-3 bg-[var(--color-bg-card)] hover:bg-[var(--color-border)] rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                {!selectedPrescricao && (
                  <button
                    type="button"
                    className="flex-1 px-4 py-3 bg-[var(--color-bg-card)] hover:bg-[var(--color-border)] rounded-lg transition-colors"
                  >
                    Imprimir
                  </button>
                )}
                <button
                  type="submit"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-3 bg-[var(--color-clinico)] hover:bg-[var(--color-clinico-border)] text-[var(--color-clinico-light)] rounded-lg transition-colors"
                >
                  {selectedPrescricao ? 'Fechar' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
