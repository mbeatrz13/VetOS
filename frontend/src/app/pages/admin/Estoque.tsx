import { useState } from "react";
import { Search, Plus, Package, AlertTriangle, TrendingDown, Edit, Trash2 } from "lucide-react";

interface Produto {
  id: number;
  nome: string;
  categoria: string;
  quantidade: number;
  minimo: number;
  unidade: string;
  validade: string;
  fornecedor: string;
  preco: number;
}

export function Estoque() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingProduto, setEditingProduto] = useState<Produto | null>(null);

  const [produtos] = useState<Produto[]>([
    {
      id: 1,
      nome: "Amoxicilina 500mg",
      categoria: "Medicamento",
      quantidade: 45,
      minimo: 20,
      unidade: "caixas",
      validade: "2026-12-31",
      fornecedor: "Farmácia Vet",
      preco: 85.00
    },
    {
      id: 2,
      nome: "Ração Premium Cães",
      categoria: "Alimento",
      quantidade: 12,
      minimo: 15,
      unidade: "sacos",
      validade: "2026-08-30",
      fornecedor: "Pet Food Ltda",
      preco: 120.00
    },
    {
      id: 3,
      nome: "Vacina Antirrábica",
      categoria: "Vacina",
      quantidade: 8,
      minimo: 10,
      unidade: "doses",
      validade: "2026-06-15",
      fornecedor: "Lab Veterinário",
      preco: 35.00
    },
    {
      id: 4,
      nome: "Luvas Cirúrgicas",
      categoria: "Material",
      quantidade: 150,
      minimo: 50,
      unidade: "unidades",
      validade: "2027-01-20",
      fornecedor: "Med Supply",
      preco: 2.50
    },
    {
      id: 5,
      nome: "Seringas 10ml",
      categoria: "Material",
      quantidade: 25,
      minimo: 30,
      unidade: "pacotes",
      validade: "2027-03-10",
      fornecedor: "Med Supply",
      preco: 15.00
    },
  ]);

  const produtosBaixoEstoque = produtos.filter(p => p.quantidade < p.minimo);
  const valorTotalEstoque = produtos.reduce((acc, p) => acc + (p.quantidade * p.preco), 0);

  const handleAdd = () => {
    setEditingProduto(null);
    setShowModal(true);
  };

  const handleEdit = (produto: Produto) => {
    setEditingProduto(produto);
    setShowModal(true);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Estoque</h1>
          <p className="text-[var(--color-text-secondary)]">Gerenciamento de produtos e materiais</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--color-admin)] hover:bg-[var(--color-admin-border)] text-[var(--color-admin-light)] rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          Novo Produto
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[var(--color-admin)] flex items-center justify-center">
              <Package className="w-5 h-5 text-[var(--color-admin-light)]" />
            </div>
            <div>
              <p className="text-2xl font-bold">{produtos.length}</p>
              <p className="text-sm text-[var(--color-text-secondary)]">Produtos</p>
            </div>
          </div>
        </div>

        <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[var(--color-warning)] flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold">{produtosBaixoEstoque.length}</p>
              <p className="text-sm text-[var(--color-text-secondary)]">Estoque Baixo</p>
            </div>
          </div>
        </div>

        <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[var(--color-success)] flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold">R$ {valorTotalEstoque.toFixed(2)}</p>
              <p className="text-sm text-[var(--color-text-secondary)]">Valor Total</p>
            </div>
          </div>
        </div>
      </div>

      {/* Alerta de Estoque Baixo */}
      {produtosBaixoEstoque.length > 0 && (
        <div className="bg-[var(--color-warning)]/10 border border-[var(--color-warning)] rounded-xl p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-[var(--color-warning)] flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold mb-2 text-[var(--color-warning)]">Produtos com Estoque Baixo</h3>
              <div className="space-y-1">
                {produtosBaixoEstoque.map(produto => (
                  <p key={produto.id} className="text-sm text-[var(--color-text-secondary)]">
                    • {produto.nome}: {produto.quantidade} {produto.unidade} (mínimo: {produto.minimo})
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filter */}
      <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nome ou categoria..."
              className="w-full pl-10 pr-4 py-3 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-admin-border)] transition-colors"
            />
          </div>
          <select className="px-4 py-3 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-admin-border)] transition-colors">
            <option>Todas as categorias</option>
            <option>Medicamento</option>
            <option>Vacina</option>
            <option>Material</option>
            <option>Alimento</option>
          </select>
        </div>
      </div>

      {/* Produtos Table */}
      <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[var(--color-bg-card)] border-b border-[var(--color-border)]">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold">Produto</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Categoria</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Quantidade</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Validade</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Valor Unit.</th>
                <th className="px-6 py-4 text-right text-sm font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {produtos.map((produto) => {
                const isLowStock = produto.quantidade < produto.minimo;
                const diasParaVencer = Math.floor((new Date(produto.validade).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                const venceEmBreve = diasParaVencer < 90;

                return (
                  <tr key={produto.id} className="hover:bg-[var(--color-bg-card)] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[var(--color-admin)] flex items-center justify-center">
                          <Package className="w-5 h-5 text-[var(--color-admin-light)]" />
                        </div>
                        <div>
                          <p className="font-medium">{produto.nome}</p>
                          <p className="text-sm text-[var(--color-text-secondary)]">{produto.fornecedor}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-[var(--color-admin)]/20 text-[var(--color-admin-light)]">
                        {produto.categoria}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`font-medium ${isLowStock ? 'text-[var(--color-warning)]' : ''}`}>
                          {produto.quantidade} {produto.unidade}
                        </span>
                        {isLowStock && <AlertTriangle className="w-4 h-4 text-[var(--color-warning)]" />}
                      </div>
                      <p className="text-xs text-[var(--color-text-secondary)]">Mín: {produto.minimo}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className={venceEmBreve ? 'text-[var(--color-warning)]' : ''}>
                        {new Date(produto.validade).toLocaleDateString('pt-BR')}
                      </p>
                      {venceEmBreve && (
                        <p className="text-xs text-[var(--color-warning)]">{diasParaVencer} dias</p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium">R$ {produto.preco.toFixed(2)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(produto)}
                          className="p-2 hover:bg-[var(--color-bg-secondary)] rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4 text-[var(--color-text-secondary)]" />
                        </button>
                        <button className="p-2 hover:bg-[var(--color-bg-secondary)] rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4 text-[var(--color-error)]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-semibold mb-6">
              {editingProduto ? 'Editar Produto' : 'Novo Produto'}
            </h2>

            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2 text-[var(--color-text-secondary)]">
                    Nome do Produto
                  </label>
                  <input
                    type="text"
                    defaultValue={editingProduto?.nome}
                    className="w-full px-4 py-3 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-admin-border)] transition-colors"
                    placeholder="Nome do produto"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-[var(--color-text-secondary)]">
                    Categoria
                  </label>
                  <select
                    defaultValue={editingProduto?.categoria}
                    className="w-full px-4 py-3 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-admin-border)] transition-colors"
                  >
                    <option>Medicamento</option>
                    <option>Vacina</option>
                    <option>Material</option>
                    <option>Alimento</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-[var(--color-text-secondary)]">
                    Fornecedor
                  </label>
                  <input
                    type="text"
                    defaultValue={editingProduto?.fornecedor}
                    className="w-full px-4 py-3 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-admin-border)] transition-colors"
                    placeholder="Nome do fornecedor"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-[var(--color-text-secondary)]">
                    Quantidade
                  </label>
                  <input
                    type="number"
                    defaultValue={editingProduto?.quantidade}
                    className="w-full px-4 py-3 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-admin-border)] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-[var(--color-text-secondary)]">
                    Estoque Mínimo
                  </label>
                  <input
                    type="number"
                    defaultValue={editingProduto?.minimo}
                    className="w-full px-4 py-3 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-admin-border)] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-[var(--color-text-secondary)]">
                    Unidade
                  </label>
                  <input
                    type="text"
                    defaultValue={editingProduto?.unidade}
                    className="w-full px-4 py-3 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-admin-border)] transition-colors"
                    placeholder="Ex: caixas, unidades"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-[var(--color-text-secondary)]">
                    Validade
                  </label>
                  <input
                    type="date"
                    defaultValue={editingProduto?.validade}
                    className="w-full px-4 py-3 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-admin-border)] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-[var(--color-text-secondary)]">
                    Valor Unitário (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    defaultValue={editingProduto?.preco}
                    className="w-full px-4 py-3 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-admin-border)] transition-colors"
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
                  className="flex-1 px-4 py-3 bg-[var(--color-admin)] hover:bg-[var(--color-admin-border)] text-[var(--color-admin-light)] rounded-lg transition-colors"
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
