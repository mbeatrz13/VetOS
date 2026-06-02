import { useState } from "react";
import { Search, Plus, Edit, Trash2, PawPrint, Calendar, Weight } from "lucide-react";

interface Animal {
  id: number;
  nome: string;
  especie: string;
  raca: string;
  idade: string;
  peso: string;
  tutor: string;
  foto?: string;
}

export function Animais() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingAnimal, setEditingAnimal] = useState<Animal | null>(null);

  const [animais] = useState<Animal[]>([
    { id: 1, nome: "Rex", especie: "Cão", raca: "Labrador", idade: "3 anos", peso: "28kg", tutor: "João Silva" },
    { id: 2, nome: "Mia", especie: "Gato", raca: "Persa", idade: "2 anos", peso: "4kg", tutor: "Maria Santos" },
    { id: 3, nome: "Bob", especie: "Cão", raca: "Bulldog", idade: "5 anos", peso: "22kg", tutor: "Pedro Costa" },
    { id: 4, nome: "Luna", especie: "Gato", raca: "Siamês", idade: "1 ano", peso: "3kg", tutor: "Ana Oliveira" },
    { id: 5, nome: "Max", especie: "Cão", raca: "Golden Retriever", idade: "4 anos", peso: "30kg", tutor: "João Silva" },
    { id: 6, nome: "Mel", especie: "Cão", raca: "Poodle", idade: "6 anos", peso: "8kg", tutor: "Pedro Costa" },
  ]);

  const filteredAnimais = animais.filter(animal =>
    animal.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    animal.especie.toLowerCase().includes(searchTerm.toLowerCase()) ||
    animal.tutor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    setEditingAnimal(null);
    setShowModal(true);
  };

  const handleEdit = (animal: Animal) => {
    setEditingAnimal(animal);
    setShowModal(true);
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

      {/* Search and Filter */}
      <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nome, espécie ou tutor..."
              className="w-full pl-10 pr-4 py-3 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-recepcao-border)] transition-colors"
            />
          </div>
          <select className="px-4 py-3 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-recepcao-border)] transition-colors">
            <option>Todas as espécies</option>
            <option>Cão</option>
            <option>Gato</option>
          </select>
        </div>
      </div>

      {/* Animals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAnimais.map((animal) => (
          <div
            key={animal.id}
            className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl overflow-hidden hover:border-[var(--color-border-light)] transition-all"
          >
            {/* Animal Photo/Icon */}
            <div className="h-32 bg-gradient-to-br from-[var(--color-recepcao)] to-[var(--color-recepcao-border)] flex items-center justify-center">
              <PawPrint className="w-16 h-16 text-[var(--color-recepcao-light)] opacity-50" />
            </div>

            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-xl font-semibold mb-1">{animal.nome}</h3>
                  <p className="text-sm text-[var(--color-text-secondary)]">{animal.especie} • {animal.raca}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(animal)}
                    className="p-2 hover:bg-[var(--color-bg-card)] rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4 text-[var(--color-text-secondary)]" />
                  </button>
                  <button className="p-2 hover:bg-[var(--color-bg-card)] rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4 text-[var(--color-error)]" />
                  </button>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                  <Calendar className="w-4 h-4" />
                  <span>{animal.idade}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                  <Weight className="w-4 h-4" />
                  <span>{animal.peso}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-[var(--color-border)]">
                <p className="text-sm text-[var(--color-text-secondary)]">
                  Tutor: <span className="text-[var(--color-text-primary)]">{animal.tutor}</span>
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

            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-[var(--color-text-secondary)]">
                    Nome
                  </label>
                  <input
                    type="text"
                    defaultValue={editingAnimal?.nome}
                    className="w-full px-4 py-3 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-recepcao-border)] transition-colors"
                    placeholder="Nome do animal"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-[var(--color-text-secondary)]">
                    Tutor
                  </label>
                  <select
                    defaultValue={editingAnimal?.tutor}
                    className="w-full px-4 py-3 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-recepcao-border)] transition-colors"
                  >
                    <option>Selecione o tutor</option>
                    <option>João Silva</option>
                    <option>Maria Santos</option>
                    <option>Pedro Costa</option>
                    <option>Ana Oliveira</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-[var(--color-text-secondary)]">
                    Espécie
                  </label>
                  <select
                    defaultValue={editingAnimal?.especie}
                    className="w-full px-4 py-3 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-recepcao-border)] transition-colors"
                  >
                    <option>Selecione a espécie</option>
                    <option>Cão</option>
                    <option>Gato</option>
                    <option>Ave</option>
                    <option>Réptil</option>
                    <option>Outro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-[var(--color-text-secondary)]">
                    Raça
                  </label>
                  <input
                    type="text"
                    defaultValue={editingAnimal?.raca}
                    className="w-full px-4 py-3 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-recepcao-border)] transition-colors"
                    placeholder="Raça do animal"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-[var(--color-text-secondary)]">
                    Idade
                  </label>
                  <input
                    type="text"
                    defaultValue={editingAnimal?.idade}
                    className="w-full px-4 py-3 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-recepcao-border)] transition-colors"
                    placeholder="Ex: 3 anos"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-[var(--color-text-secondary)]">
                    Peso
                  </label>
                  <input
                    type="text"
                    defaultValue={editingAnimal?.peso}
                    className="w-full px-4 py-3 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-recepcao-border)] transition-colors"
                    placeholder="Ex: 28kg"
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
