import { useState } from "react";
import { Search, Plus, TestTube, PawPrint, Calendar, FileText, AlertCircle } from "lucide-react";
import { useExams } from "../../../hooks/useExams";

export function Exames() {
  const { exams, loading, error } = useExams();
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedExame, setSelectedExame] = useState<typeof exams[0] | null>(null);

  const handleViewDetails = (exame: typeof exams[0]) => {
    setSelectedExame(exame);
    setShowModal(true);
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-[var(--color-error)]/10 border border-[var(--color-error)] rounded-xl p-6">
          <p className="text-[var(--color-error)]">Erro ao carregar exames: {error}</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "concluído": return "bg-[var(--color-success)]/20 text-[var(--color-success)]";
      case "em análise": return "bg-[var(--color-warning)]/20 text-[var(--color-warning)]";
      case "solicitado": return "bg-[var(--color-clinico)]/20 text-[var(--color-clinico-light)]";
      default: return "bg-[var(--color-text-muted)]/20 text-[var(--color-text-secondary)]";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "concluído": return FileText;
      case "em análise": return AlertCircle;
      case "solicitado": return TestTube;
      default: return TestTube;
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <p className="text-[var(--color-text-secondary)]">Carregando exames...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Exames</h1>
          <p className="text-[var(--color-text-secondary)]">Solicitação e resultados de exames</p>
        </div>
        <button
          onClick={() => { setSelectedExame(null); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--color-clinico)] hover:bg-[var(--color-clinico-border)] text-[var(--color-clinico-light)] rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          Solicitar Exame
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[var(--color-clinico)] flex items-center justify-center">
              <TestTube className="w-5 h-5 text-[var(--color-clinico-light)]" />
            </div>
            <div>
              <p className="text-2xl font-bold">{exams.filter(e => e.status === 'solicitado').length}</p>
              <p className="text-sm text-[var(--color-text-secondary)]">Solicitados</p>
            </div>
          </div>
        </div>

        <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[var(--color-warning)] flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold">{exams.filter(e => e.status === 'em análise').length}</p>
              <p className="text-sm text-[var(--color-text-secondary)]">Em Análise</p>
            </div>
          </div>
        </div>

        <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[var(--color-success)] flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold">{exams.filter(e => e.status === 'concluído').length}</p>
              <p className="text-sm text-[var(--color-text-secondary)]">Concluídos</p>
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
              placeholder="Buscar por animal, tipo de exame ou tutor..."
              className="w-full pl-10 pr-4 py-3 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-clinico-border)] transition-colors"
            />
          </div>
          <select className="px-4 py-3 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-clinico-border)] transition-colors">
            <option>Todos os status</option>
            <option>Solicitado</option>
            <option>Em análise</option>
            <option>Concluído</option>
          </select>
        </div>
      </div>

      {/* Exames List */}
      <div className="space-y-4">
        {exams.map((exam) => {
          const StatusIcon = getStatusIcon(exam.status);
          return (
            <div
              key={exam.id}
              onClick={() => handleViewDetails(exam)}
              className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl p-6 hover:border-[var(--color-clinico-border)] transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-[var(--color-clinico)] flex items-center justify-center">
                    <TestTube className="w-6 h-6 text-[var(--color-clinico-light)]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">{exam.exam_type}</h3>
                    <div className="flex items-center gap-4 text-sm text-[var(--color-text-secondary)]">
                      <div className="flex items-center gap-1">
                        <PawPrint className="w-4 h-4" />
                        <span>Consulta #{exam.consultation}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(exam.status)}`}>
                    {exam.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-[var(--color-text-secondary)] mb-1">Data da Solicitação</p>
                  <p className="font-medium">{new Date(exam.request_date).toLocaleDateString('pt-BR')}</p>
                </div>
                {exam.result_date && (
                  <div>
                    <p className="text-sm text-[var(--color-text-secondary)] mb-1">Data do Resultado</p>
                    <p className="font-medium">{new Date(exam.result_date).toLocaleDateString('pt-BR')}</p>
                  </div>
                )}
                {exam.notes && (
                  <div className="md:col-span-2">
                    <p className="text-sm text-[var(--color-text-secondary)] mb-1">Observações</p>
                    <p className="font-medium">{exam.notes}</p>
                  </div>
                )}
                {exam.results && (
                  <div className="md:col-span-2">
                    <p className="text-sm text-[var(--color-text-secondary)] mb-1">Resultados</p>
                    <div className="bg-[var(--color-success)]/10 border border-[var(--color-success)]/30 rounded-lg p-3">
                      <p className="text-sm">{exam.results}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-semibold mb-6">
              {selectedExame ? 'Detalhes do Exame' : 'Solicitar Exame'}
            </h2>

            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-[var(--color-text-secondary)]">
                    Tipo de Exame
                  </label>
                  <input
                    type="text"
                    defaultValue={selectedExame?.exam_type}
                    disabled={!!selectedExame}
                    className="w-full px-4 py-3 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-clinico-border)] transition-colors disabled:opacity-50"
                    placeholder="Tipo de exame"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-[var(--color-text-secondary)]">
                    Status
                  </label>
                  <select
                    defaultValue={selectedExame?.status}
                    className="w-full px-4 py-3 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-clinico-border)] transition-colors"
                  >
                    <option value="solicitado">Solicitado</option>
                    <option value="em análise">Em Análise</option>
                    <option value="concluído">Concluído</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-[var(--color-text-secondary)]">
                  Observações / Justificativa
                </label>
                <textarea
                  defaultValue={selectedExame?.notes || ''}
                  disabled={!!selectedExame && !selectedExame.results}
                  className="w-full px-4 py-3 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-clinico-border)] transition-colors resize-none disabled:opacity-50"
                  rows={3}
                  placeholder="Motivo da solicitação, sintomas observados..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-[var(--color-text-secondary)]">
                  Resultados
                </label>
                <textarea
                  defaultValue={selectedExame?.results || ''}
                  className="w-full px-4 py-3 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-clinico-border)] transition-colors resize-none"
                  rows={4}
                  placeholder="Registrar resultados do exame..."
                />
              </div>

              {selectedExame && (
                <div className="bg-[var(--color-clinico)]/10 border border-[var(--color-clinico-border)] rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Informações da Solicitação</h4>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    Data: {new Date(selectedExame.request_date).toLocaleDateString('pt-BR')}
                  </p>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    Tipo: {selectedExame.exam_type}
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
