import { useState } from "react";
import { Search, Plus, Edit, Trash2, PawPrint, Calendar, Weight } from "lucide-react";
import { useAnimals } from "../../../hooks/useAnimals";
import { useTutors } from "../../../hooks/useTutor";
import { AnimalPayload } from "../../../services/animal.service";

export function Animais() {
  const { animals, loading, error, fetchAnimals, createAnimal, updateAnimal, deleteAnimal } = useAnimals();
  const { tutores } = useTutors();
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingAnimal, setEditingAnimal] = useState<typeof animals[0] | null>(null);

  const filteredAnimais = animals.filter(animal =>
    animal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    animal.species.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (animal.tutor_name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
  );

  const handleAdd = () => {
    setEditingAnimal(null);
    setShowModal(true);
  };

  const handleEdit = (animal: typeof animals[0]) => {
    setEditingAnimal(animal);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Tem certeza que deseja excluir este animal?")) {
      await deleteAnimal(id);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload: AnimalPayload = {
      name: formData.get("name") as string,
      tutor: Number(formData.get("tutor")),
      species: formData.get("species") as string,
      breed: formData.get("breed") as string,
      date_of_birth: formData.get("date_of_birth") as string || undefined,
      weight: formData.get("weight") ? Number(formData.get("weight")) : undefined,
    };

    if (editingAnimal) {
      await updateAnimal(editingAnimal.id, payload);
    } else {
      await createAnimal(payload);
    }
    setShowModal(false);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    fetchAnimals(value || undefined);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Animais</h1>
          <p className="text-[var(--color-text-secondary)]">Cadastro e gerenciamento de animais</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--color-recepcao)] hover:bg-[var(--color-recepcao-border)] text-[var(--color-recepcao-light)] rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          Novo Animal
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
            placeholder="Buscar por nome, espécie ou tutor..."
            className="w-full pl-10 pr-4 py-3 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-recepcao-border)] transition-colors"
          />
        </div>
      </div>

      {loading && <p className="text-center text-[var(--color-text-secondary)]">Carregando...</p>}
      {error && <p className="text-center text-[var(--color-error)]">Erro: {error}</p>}

      {/* Animals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAnimais.map((animal) => (
          <div
            key={animal.id}
            className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl overflow-hidden hover:border-[var(--color-border-light)] transition-all"
          >
            <div className="h-32 bg-gradient-to-br from-[var(--color-recepcao)] to-[var(--color-recepcao-border)] flex items-center justify-center">
              <PawPrint className="w-16 h-16 text-[var(--color-recepcao-light)] opacity-50" />
            </div>

            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-xl font-semibold mb-1">{animal.name}</h3>
                  <p className="text-sm text-[var(--color-text-secondary)]">{animal.species} • {animal.breed || "—"}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(animal)}
                    className="p-2 hover:bg-[var(--color-bg-card)] rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4 text-[var(--color-text-secondary)]" />
                  </button>
                  <button
                    onClick={() => handleDelete(animal.id)}
                    className="p-2 hover:bg-[var(--color-bg-card)] rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-[var(--color-error)]" />
                  </button>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                  <Calendar className="w-4 h-4" />
                  <span>{animal.date_of_birth ? new Date(animal.date_of_birth).toLocaleDateString('pt-BR') : "—"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                  <Weight className="w-4 h-4" />
                  <span>{animal.weight ? `${animal.weight}kg` : "—"}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-[var(--color-border)]">
                <p className="text-sm text-[var(--color-text-secondary)]">
                  Tutor: <span className="text-[var(--color-text-primary)]">{animal.tutor_name || "—"}</span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-semibold mb-6">
              {editingAnimal ? 'Editar Animal' : 'Novo Animal'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-[var(--color-text-secondary)]">Nome</label>
                  <input
                    name="name"
                    type="text"
                    defaultValue={editingAnimal?.name}
                    required
                    className="w-full px-4 py-3 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-recepcao-border)] transition-colors"
                    placeholder="Nome do animal"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-[var(--color-text-secondary)]">Tutor</label>
                  <select
                    name="tutor"
                    defaultValue={editingAnimal?.tutor}
                    required
                    className="w-full px-4 py-3 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-recepcao-border)] transition-colors"
                  >
                    <option value="">Selecione o tutor</option>
                    {tutores.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-[var(--color-text-secondary)]">Espécie</label>
                  <input
                    name="species"
                    type="text"
                    defaultValue={editingAnimal?.species}
                    required
                    className="w-full px-4 py-3 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-recepcao-border)] transition-colors"
                    placeholder="Ex: Cão, Gato"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-[var(--color-text-secondary)]">Raça</label>
                  <input
                    name="breed"
                    type="text"
                    defaultValue={editingAnimal?.breed ?? ""}
                    className="w-full px-4 py-3 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-recepcao-border)] transition-colors"
                    placeholder="Raça do animal"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-[var(--color-text-secondary)]">Data de Nascimento</label>
                  <input
                    name="date_of_birth"
                    type="date"
                    defaultValue={editingAnimal?.date_of_birth ?? ""}
                    className="w-full px-4 py-3 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-recepcao-border)] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-[var(--color-text-secondary)]">Peso (kg)</label>
                  <input
                    name="weight"
                    type="number"
                    step="0.1"
                    defaultValue={editingAnimal?.weight ?? ""}
                    className="w-full px-4 py-3 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-recepcao-border)] transition-colors"
                    placeholder="Ex: 28"
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
