import { useState } from "react";
import { Search, Plus, Edit, Trash2, Mail, Phone, MapPin } from "lucide-react";
import { useTutors } from "../../../hooks/useTutor";
import { TutorPayload } from "../../../services/tutor.service";

export function Tutores() {
  const { tutores, loading, error, fetchTutores, createTutor, updateTutor, deleteTutor } = useTutors();
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingTutor, setEditingTutor] = useState<typeof tutores[0] | null>(null);

  const filteredTutores = tutores.filter(tutor =>
    tutor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (tutor.email?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
  );

  const handleAdd = () => {
    setEditingTutor(null);
    setShowModal(true);
  };

  const handleEdit = (tutor: typeof tutores[0]) => {
    setEditingTutor(tutor);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Tem certeza que deseja excluir este tutor?")) {
      await deleteTutor(id);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload: TutorPayload = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      address: formData.get("address") as string,
    };

    if (editingTutor) {
      await updateTutor(editingTutor.id, payload);
    } else {
      await createTutor(payload);
    }
    setShowModal(false);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    fetchTutores(value || undefined);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Tutores</h1>
          <p className="text-[var(--color-text-secondary)]">Cadastro e gerenciamento de tutores</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--color-recepcao)] hover:bg-[var(--color-recepcao-border)] text-[var(--color-recepcao-light)] rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          Novo Tutor
        </button>
      </div>

      {/* Search */}
      <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Buscar por nome ou email..."
            className="w-full pl-10 pr-4 py-3 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-recepcao-border)] transition-colors"
          />
        </div>
      </div>

      {/* Loading / Error */}
      {loading && <p className="text-center text-[var(--color-text-secondary)]">Carregando...</p>}
      {error && <p className="text-center text-[var(--color-error)]">Erro: {error}</p>}

      {/* Tutores List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTutores.map((tutor) => (
          <div
            key={tutor.id}
            className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl p-6 hover:border-[var(--color-border-light)] transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-[var(--color-recepcao)] flex items-center justify-center text-[var(--color-recepcao-light)] font-semibold text-lg">
                {tutor.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(tutor)}
                  className="p-2 hover:bg-[var(--color-bg-card)] rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4 text-[var(--color-text-secondary)]" />
                </button>
                <button
                  onClick={() => handleDelete(tutor.id)}
                  className="p-2 hover:bg-[var(--color-bg-card)] rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-[var(--color-error)]" />
                </button>
              </div>
            </div>

            <h3 className="text-lg font-semibold mb-3">{tutor.name}</h3>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                <Mail className="w-4 h-4" />
                <span>{tutor.email || "—"}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                <Phone className="w-4 h-4" />
                <span>{tutor.phone || "—"}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                <MapPin className="w-4 h-4" />
                <span>{tutor.address || "—"}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-[var(--color-border)]">
              <span className="text-sm text-[var(--color-text-secondary)]">
                {tutor.animal_count ?? 0} {(tutor.animal_count ?? 0) === 1 ? 'animal' : 'animais'} cadastrado{(tutor.animal_count ?? 0) === 1 ? '' : 's'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-semibold mb-6">
              {editingTutor ? 'Editar Tutor' : 'Novo Tutor'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-[var(--color-text-secondary)]">
                  Nome Completo
                </label>
                <input
                  name="name"
                  type="text"
                  defaultValue={editingTutor?.name}
                  required
                  className="w-full px-4 py-3 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-recepcao-border)] transition-colors"
                  placeholder="Nome do tutor"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-[var(--color-text-secondary)]">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  defaultValue={editingTutor?.email ?? ""}
                  className="w-full px-4 py-3 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-recepcao-border)] transition-colors"
                  placeholder="email@exemplo.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-[var(--color-text-secondary)]">
                  Telefone
                </label>
                <input
                  name="phone"
                  type="tel"
                  defaultValue={editingTutor?.phone ?? ""}
                  className="w-full px-4 py-3 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-recepcao-border)] transition-colors"
                  placeholder="(11) 98765-4321"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-[var(--color-text-secondary)]">
                  Endereço
                </label>
                <textarea
                  name="address"
                  defaultValue={editingTutor?.address ?? ""}
                  className="w-full px-4 py-3 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-recepcao-border)] transition-colors resize-none"
                  placeholder="Rua, número, bairro"
                  rows={3}
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
                  className="flex-1 px-4 py-3 bg-[var(--color-recepcao)] hover:bg-[var(--color-recepcao-border)] text-[var(--color-recepcao-light)] rounded-lg transition-colors"
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
