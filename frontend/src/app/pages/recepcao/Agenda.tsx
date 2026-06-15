import { useState, useEffect } from "react";
import { Calendar as CalendarIcon, Plus, Clock, PawPrint, User, Search, Edit, X } from "lucide-react";
import { useAppointments } from "../../../hooks/useAppointments";
import { useAnimals } from "../../../hooks/useAnimals";
import { veterinarianService, VeterinarianAPI } from "../../../services/employee.service";
import { AppointmentPayload } from "../../../services/appointment.service";

export function Agenda() {
  const { appointments, loading, error, fetchAppointments, fetchToday, createAppointment, updateAppointment, deleteAppointment } = useAppointments();
  const { animals } = useAnimals();
  const [vets, setVets] = useState<VeterinarianAPI[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    veterinarianService.list().then(setVets).catch(() => {});
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-[var(--color-success)]/20 text-[var(--color-success)]";
      case "scheduled": return "bg-[var(--color-warning)]/20 text-[var(--color-warning)]";
      case "completed": return "bg-[var(--color-secondary)]/20 text-[var(--color-secondary)]";
      case "cancelled": return "bg-[var(--color-error)]/20 text-[var(--color-error)]";
      default: return "bg-[var(--color-text-muted)]/20 text-[var(--color-text-secondary)]";
    }
  };

  const getTypeLabel = (type: string) => {
    const map: Record<string, string> = {
      consultation: "Consulta", follow_up: "Retorno", surgery: "Cirurgia", vaccine: "Vacinação", exam: "Exame"
    };
    return map[type] || type;
  };

  const handleConfirm = async (id: number) => {
    await updateAppointment(id, { status: "confirmed" });
  };

  const handleCancel = async (id: number) => {
    await updateAppointment(id, { status: "cancelled" });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload: AppointmentPayload = {
      animal: Number(formData.get("animal")),
      veterinarian: Number(formData.get("veterinarian")),
      date: formData.get("date") as string,
      time: formData.get("time") as string,
      type: formData.get("type") as string,
      status: "scheduled",
      notes: formData.get("notes") as string || undefined,
    };
    await createAppointment(payload);
    setShowModal(false);
  };

  const filteredAppointments = appointments.filter(a =>
    (a.animal_name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
    (a.tutor_name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
    (a.vet_name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
  );

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
              <p className="text-2xl font-bold">{appointments.length}</p>
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
              <p className="text-2xl font-bold">{appointments.filter(a => a.status === 'scheduled').length}</p>
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
              <p className="text-2xl font-bold">{appointments.filter(a => a.status === 'confirmed').length}</p>
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
              <p className="text-2xl font-bold">{appointments.filter(a => a.status === 'completed').length}</p>
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

      {loading && <p className="text-center text-[var(--color-text-secondary)]">Carregando...</p>}
      {error && <p className="text-center text-[var(--color-error)]">Erro: {error}</p>}

      {/* Consultas */}
      <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Consultas de Hoje</h2>
        <div className="space-y-3">
          {filteredAppointments.map((consulta) => (
            <div
              key={consulta.id}
              className="bg-[var(--color-bg-card)] border border-[var(--color-border-light)] rounded-lg p-4 hover:border-[var(--color-recepcao-border)] transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-16 text-center">
                  <div className="text-2xl font-bold text-[var(--color-recepcao-light)]">{consulta.time?.slice(0, 5)}</div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <h3 className="font-semibold mb-1">{getTypeLabel(consulta.type)}</h3>
                      <div className="flex items-center gap-4 text-sm text-[var(--color-text-secondary)]">
                        <div className="flex items-center gap-2">
                          <PawPrint className="w-4 h-4" />
                          <span>{consulta.animal_name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span>{consulta.tutor_name}</span>
                        </div>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(consulta.status)}`}>
                      {consulta.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-[var(--color-text-secondary)]">Veterinário: {consulta.vet_name}</p>
                    <div className="flex gap-2">
                      {consulta.status === 'scheduled' && (
                        <button
                          onClick={() => handleConfirm(consulta.id)}
                          className="px-3 py-1.5 text-sm bg-[var(--color-bg-secondary)] hover:bg-[var(--color-border)] rounded-lg transition-colors"
                        >
                          Confirmar
                        </button>
                      )}
                      <button
                        onClick={() => handleCancel(consulta.id)}
                        className="p-1.5 hover:bg-[var(--color-bg-secondary)] rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4 text-[var(--color-error)]" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {filteredAppointments.length === 0 && !loading && (
            <p className="text-center text-[var(--color-text-secondary)] py-8">Nenhuma consulta para hoje.</p>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl p-6 w-full max-w-2xl">
            <h2 className="text-2xl font-semibold mb-6">Agendar Consulta</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-[var(--color-text-secondary)]">Animal</label>
                  <select name="animal" required className="w-full px-4 py-3 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-recepcao-border)] transition-colors">
                    <option value="">Selecione o animal</option>
                    {animals.map(a => (
                      <option key={a.id} value={a.id}>{a.name} - {a.tutor_name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-[var(--color-text-secondary)]">Veterinário</label>
                  <select name="veterinarian" required className="w-full px-4 py-3 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-recepcao-border)] transition-colors">
                    <option value="">Selecione o veterinário</option>
                    {vets.map(v => (
                      <option key={v.employee_id} value={v.employee_id}>{v.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-[var(--color-text-secondary)]">Data</label>
                  <input name="date" type="date" required className="w-full px-4 py-3 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-recepcao-border)] transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-[var(--color-text-secondary)]">Hora</label>
                  <input name="time" type="time" required className="w-full px-4 py-3 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-recepcao-border)] transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-[var(--color-text-secondary)]">Tipo</label>
                  <select name="type" required className="w-full px-4 py-3 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-recepcao-border)] transition-colors">
                    <option value="consultation">Consulta</option>
                    <option value="follow_up">Retorno</option>
                    <option value="vaccine">Vacinação</option>
                    <option value="surgery">Cirurgia</option>
                    <option value="exam">Exame</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-[var(--color-text-secondary)]">Observações</label>
                <textarea name="notes" className="w-full px-4 py-3 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-recepcao-border)] transition-colors resize-none" rows={3} placeholder="Observações..." />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-3 bg-[var(--color-bg-card)] hover:bg-[var(--color-border)] rounded-lg transition-colors">Cancelar</button>
                <button type="submit" className="flex-1 px-4 py-3 bg-[var(--color-recepcao)] hover:bg-[var(--color-recepcao-border)] text-[var(--color-recepcao-light)] rounded-lg transition-colors">Agendar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
