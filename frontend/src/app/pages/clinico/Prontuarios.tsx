import { useState } from "react";
import { Search, FileText, PawPrint, Calendar, Pill, TestTube, Stethoscope, AlertCircle } from "lucide-react";
import { useMedicalRecords } from "../../../hooks/useMedicalRecords";

export function Prontuarios() {
  const { medicalRecords, loading, error } = useMedicalRecords();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRecord, setSelectedRecord] = useState<typeof medicalRecords[0] | null>(null);

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-[var(--color-error)]/10 border border-[var(--color-error)] rounded-xl p-6">
          <p className="text-[var(--color-error)]">Erro ao carregar prontuários: {error}</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <p className="text-[var(--color-text-secondary)]">Carregando prontuários...</p>
        </div>
      </div>
    );
  }

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
          <h2 className="font-semibold mb-4">Registros Médicos</h2>
          {medicalRecords.map((record, index) => (
            <div
              key={record.id}
              onClick={() => setSelectedRecord(record)}
              className={`
                bg-[var(--color-bg-secondary)] border rounded-xl p-4 cursor-pointer transition-all
                ${selectedRecord?.id === record.id 
                  ? 'border-[var(--color-clinico-border)] bg-[var(--color-clinico)]/10' 
                  : 'border-[var(--color-border)] hover:border-[var(--color-border-light)]'
                }
              `}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[var(--color-clinico)] flex items-center justify-center">
                  <FileText className="w-6 h-6 text-[var(--color-clinico-light)]" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">Prontuário #{record.id}</h3>
                  <p className="text-sm text-[var(--color-text-secondary)] truncate">Animal: {record.animal}</p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-[var(--color-border)]">
                <p className="text-xs text-[var(--color-text-secondary)]">
                  Criado: {new Date(record.created_at).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Detalhes do Prontuário */}
        <div className="lg:col-span-2">
          {selectedRecord ? (
            <div className="space-y-6">
              {/* Informações do Registro */}
              <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl p-6">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-[var(--color-clinico)] flex items-center justify-center">
                    <FileText className="w-8 h-8 text-[var(--color-clinico-light)]" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-1">Prontuário #{selectedRecord.id}</h2>
                    <p className="text-[var(--color-text-secondary)] mb-3">Animal ID: {selectedRecord.animal}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-[var(--color-text-secondary)] mb-1">Criado em</p>
                        <p className="font-medium">{new Date(selectedRecord.created_at).toLocaleDateString('pt-BR')}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[var(--color-text-secondary)] mb-1">Atualizado em</p>
                        <p className="font-medium">{new Date(selectedRecord.updated_at).toLocaleDateString('pt-BR')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Aviso de dados incompletos */}
              <div className="bg-[var(--color-warning)]/10 border border-[var(--color-warning)]/30 rounded-xl p-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-[var(--color-warning)] flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-[var(--color-warning)] mb-1">Dados do Prontuário</h3>
                    <p className="text-sm text-[var(--color-text-secondary)]">
                      Os dados detalhados do prontuário (histórico de consultas, exames, vacinações) estão sendo carregados do sistema.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl p-12 text-center">
              <FileText className="w-16 h-16 text-[var(--color-text-muted)] mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Selecione um prontuário</h3>
              <p className="text-[var(--color-text-secondary)]">
                Escolha um registro da lista para visualizar os detalhes
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
