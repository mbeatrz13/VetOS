import { useState } from "react";
import { Search, FileText, PawPrint, Calendar, Pill, TestTube, Stethoscope } from "lucide-react";

interface RegistroProntuario {
  data: string;
  tipo: string;
  veterinario: string;
  descricao: string;
  icon: any;
}

interface Prontuario {
  animal: string;
  tutor: string;
  especie: string;
  raca: string;
  nascimento: string;
  peso: string;
  registros: RegistroProntuario[];
}

export function Prontuarios() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProntuario, setSelectedProntuario] = useState<Prontuario | null>(null);

  const prontuarios: Prontuario[] = [
    {
      animal: "Rex",
      tutor: "João Silva",
      especie: "Cão",
      raca: "Labrador",
      nascimento: "2020-05-15",
      peso: "28kg",
      registros: [
        {
          data: "2026-03-19 10:30",
          tipo: "Consulta",
          veterinario: "Dr. Carlos",
          descricao: "Check-up geral. Animal saudável, vacinação em dia. Recomendado retorno em 6 meses.",
          icon: Stethoscope
        },
        {
          data: "2026-02-10 14:00",
          tipo: "Vacinação",
          veterinario: "Dra. Ana",
          descricao: "Aplicação de vacina antirrábica. Animal reagiu bem. Próxima dose em 1 ano.",
          icon: Pill
        },
        {
          data: "2026-01-15 09:00",
          tipo: "Exame",
          veterinario: "Dr. Carlos",
          descricao: "Hemograma completo. Resultados dentro da normalidade.",
          icon: TestTube
        },
      ]
    },
    {
      animal: "Mia",
      tutor: "Maria Santos",
      especie: "Gato",
      raca: "Persa",
      nascimento: "2021-08-20",
      peso: "4kg",
      registros: [
        {
          data: "2026-03-19 11:00",
          tipo: "Vacinação",
          veterinario: "Dra. Ana",
          descricao: "Vacinação antirrábica. Animal reagiu bem ao procedimento.",
          icon: Pill
        },
        {
          data: "2025-12-05 15:30",
          tipo: "Consulta",
          veterinario: "Dra. Ana",
          descricao: "Consulta de rotina. Orientações sobre alimentação e higiene.",
          icon: Stethoscope
        },
      ]
    },
    {
      animal: "Luna",
      tutor: "Ana Oliveira",
      especie: "Gato",
      raca: "Siamês",
      nascimento: "2022-11-10",
      peso: "3kg",
      registros: [
        {
          data: "2026-03-19 14:00",
          tipo: "Consulta",
          veterinario: "Dra. Ana",
          descricao: "Perda de apetite e letargia. Possível infecção. Exames solicitados.",
          icon: Stethoscope
        },
        {
          data: "2026-03-19 14:15",
          tipo: "Exame",
          veterinario: "Dra. Ana",
          descricao: "Hemograma e bioquímica solicitados. Aguardando resultados.",
          icon: TestTube
        },
      ]
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Prontuários</h1>
        <p className="text-[var(--color-text-secondary)]">Histórico médico dos animais</p>
      </div>

      {/* Search */}
      <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nome do animal ou tutor..."
            className="w-full pl-10 pr-4 py-3 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-clinico-border)] transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de Animais */}
        <div className="lg:col-span-1 space-y-3">
          <h2 className="font-semibold mb-4">Animais</h2>
          {prontuarios.map((prontuario, index) => (
            <div
              key={index}
              onClick={() => setSelectedProntuario(prontuario)}
              className={`
                bg-[var(--color-bg-secondary)] border rounded-xl p-4 cursor-pointer transition-all
                ${selectedProntuario?.animal === prontuario.animal 
                  ? 'border-[var(--color-clinico-border)] bg-[var(--color-clinico)]/10' 
                  : 'border-[var(--color-border)] hover:border-[var(--color-border-light)]'
                }
              `}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[var(--color-clinico)] flex items-center justify-center">
                  <PawPrint className="w-6 h-6 text-[var(--color-clinico-light)]" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{prontuario.animal}</h3>
                  <p className="text-sm text-[var(--color-text-secondary)] truncate">{prontuario.tutor}</p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-[var(--color-border)]">
                <p className="text-xs text-[var(--color-text-secondary)]">
                  {prontuario.especie} • {prontuario.raca}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Detalhes do Prontuário */}
        <div className="lg:col-span-2">
          {selectedProntuario ? (
            <div className="space-y-6">
              {/* Informações do Animal */}
              <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl p-6">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-[var(--color-clinico)] flex items-center justify-center">
                    <PawPrint className="w-8 h-8 text-[var(--color-clinico-light)]" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-1">{selectedProntuario.animal}</h2>
                    <p className="text-[var(--color-text-secondary)] mb-3">Tutor: {selectedProntuario.tutor}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-[var(--color-text-secondary)] mb-1">Espécie</p>
                        <p className="font-medium">{selectedProntuario.especie}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[var(--color-text-secondary)] mb-1">Raça</p>
                        <p className="font-medium">{selectedProntuario.raca}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[var(--color-text-secondary)] mb-1">Nascimento</p>
                        <p className="font-medium">{new Date(selectedProntuario.nascimento).toLocaleDateString('pt-BR')}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[var(--color-text-secondary)] mb-1">Peso Atual</p>
                        <p className="font-medium">{selectedProntuario.peso}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Histórico */}
              <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">Histórico de Atendimentos</h3>
                <div className="space-y-4">
                  {selectedProntuario.registros.map((registro, index) => {
                    const Icon = registro.icon;
                    return (
                      <div
                        key={index}
                        className="border-l-2 border-[var(--color-clinico-border)] pl-4 pb-4 last:pb-0"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-[var(--color-clinico)] flex items-center justify-center flex-shrink-0">
                            <Icon className="w-5 h-5 text-[var(--color-clinico-light)]" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="font-semibold">{registro.tipo}</h4>
                                <p className="text-sm text-[var(--color-text-secondary)]">
                                  {registro.veterinario}
                                </p>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                                <Calendar className="w-4 h-4" />
                                <span>{new Date(registro.data).toLocaleString('pt-BR')}</span>
                              </div>
                            </div>
                            <p className="text-sm bg-[var(--color-bg-card)] rounded-lg p-3 border border-[var(--color-border)]">
                              {registro.descricao}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl p-12 text-center">
              <FileText className="w-16 h-16 text-[var(--color-text-muted)] mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Selecione um animal</h3>
              <p className="text-[var(--color-text-secondary)]">
                Escolha um animal da lista para visualizar seu prontuário
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
