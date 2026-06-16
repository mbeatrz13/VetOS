import { useState } from "react";
import { Search, Plus, Package, AlertTriangle, TrendingDown, Edit, Trash2, Loader } from "lucide-react";
import { useProducts } from "../../../hooks/useProducts";
import type { ProductAPI } from "../../../services/product.service";

export function Estoque() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingProduto, setEditingProduto] = useState<ProductAPI | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  const { products, loading, error, fetchProducts, createProduct, updateProduct, deleteProduct } = useProducts();

  const produtosBaixoEstoque = products.filter(p => p.quantity < p.minimum_stock);
  const valorTotalEstoque = products.reduce((acc, p) => acc + (p.quantity * p.unit_price), 0);

  const filteredProdutos = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    setEditingProduto(null);
    setShowModal(true);
  };

  const handleEdit = (produto: ProductAPI) => {
    setEditingProduto(produto);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitLoading(true);
    try {
      const formData = new FormData(e.currentTarget);
      const data = {
        name: formData.get("name") as string,
        category: formData.get("category") as string,
        quantity: parseInt(formData.get("quantity") as string),
        minimum_stock: parseInt(formData.get("minimum_stock") as string),
        unit: formData.get("unit") as string,
        expiry_date: (formData.get("expiry_date") as string) || undefined,
        unit_price: parseFloat(formData.get("unit_price") as string),
      };

      if (editingProduto) {
        await updateProduct(editingProduto.id, data);
      } else {
        await createProduct(data);
      }
      setShowModal(false);
    } catch (err) {
      console.error("Erro ao salvar produto:", err);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Tem certeza que deseja deletar este produto?")) {
      try {
        await deleteProduct(id);
      } catch (err) {
        console.error("Erro ao deletar produto:", err);
      }
    }
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

      {error && (
        <div className="bg-[var(--color-error)]/10 border border-[var(--color-error)] rounded-xl p-6">
          <p className="text-[var(--color-error)]">Erro ao carregar produtos: {error}</p>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader className="w-6 h-6 text-[var(--color-admin)] animate-spin" />
          <span className="ml-2 text-[var(--color-text-secondary)]">Carregando produtos...</span>
        </div>
      )}

      {!loading && products.length === 0 ? (
        <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl p-12 text-center">
          <Package className="w-12 h-12 text-[var(--color-text-muted)] mx-auto mb-3" />
          <p className="text-[var(--color-text-secondary)]">Nenhum produto cadastrado</p>
        </div>
      ) : (
        <>
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[var(--color-admin)] flex items-center justify-center">
              <Package className="w-5 h-5 text-[var(--color-admin-light)]" />
            </div>
            <div>
              <p className="text-2xl font-bold">{products.length}</p>
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
              {filteredProdutos.map((produto) => {
                const isLowStock = produto.quantity < produto.minimum_stock;
                const diasParaVencer = produto.expiry_date ? Math.floor((new Date(produto.expiry_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : null;
                const venceEmBreve = diasParaVencer !== null && diasParaVencer < 90;

                return (
                  <tr key={produto.id} className="hover:bg-[var(--color-bg-card)] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[var(--color-admin)] flex items-center justify-center">
                          <Package className="w-5 h-5 text-[var(--color-admin-light)]" />
                        </div>
                        <div>
                          <p className="font-medium">{produto.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-[var(--color-admin)]/20 text-[var(--color-admin-light)]">
                        {produto.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`font-medium ${isLowStock ? 'text-[var(--color-warning)]' : ''}`}>
                          {produto.quantity} {produto.unit}
                        </span>
                        {isLowStock && <AlertTriangle className="w-4 h-4 text-[var(--color-warning)]" />}
                      </div>
                      <p className="text-xs text-[var(--color-text-secondary)]">Mín: {produto.minimum_stock}</p>
                    </td>
                    <td className="px-6 py-4">
                      {produto.expiry_date ? (
                        <>
                          <p className={venceEmBreve ? 'text-[var(--color-warning)]' : ''}>
                            {new Date(produto.expiry_date).toLocaleDateString('pt-BR')}
                          </p>
                          {venceEmBreve && (
                            <p className="text-xs text-[var(--color-warning)]">{diasParaVencer} dias</p>
                          )}
                        </>
                      ) : (
                        <p className="text-[var(--color-text-muted)]">N/A</p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium">R$ {produto.unit_price.toFixed(2)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(produto)}
                          className="p-2 hover:bg-[var(--color-bg-secondary)] rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4 text-[var(--color-text-secondary)]" />
                        </button>
                        <button
                          onClick={() => handleDelete(produto.id)}
                          className="p-2 hover:bg-[var(--color-bg-secondary)] rounded-lg transition-colors"
                        >
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
        </>
      )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-semibold mb-6">
              {editingProduto ? 'Editar Produto' : 'Novo Produto'}
            </h2>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2 text-[var(--color-text-secondary)]">
                    Nome do Produto
                  </label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={editingProduto?.name}
                    required
                    className="w-full px-4 py-3 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-admin-border)] transition-colors"
                    placeholder="Nome do produto"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-[var(--color-text-secondary)]">
                    Categoria
                  </label>
                  <select
                    name="category"
                    defaultValue={editingProduto?.category}
                    required
                    className="w-full px-4 py-3 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-admin-border)] transition-colors"
                  >
                    <option value="">Selecione uma categoria</option>
                    <option value="Medicamento">Medicamento</option>
                    <option value="Vacina">Vacina</option>
                    <option value="Material">Material</option>
                    <option value="Alimento">Alimento</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-[var(--color-text-secondary)]">
                    Quantidade
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    defaultValue={editingProduto?.quantity}
                    required
                    min="0"
                    className="w-full px-4 py-3 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-admin-border)] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-[var(--color-text-secondary)]">
                    Estoque Mínimo
                  </label>
                  <input
                    type="number"
                    name="minimum_stock"
                    defaultValue={editingProduto?.minimum_stock}
                    required
                    min="0"
                    className="w-full px-4 py-3 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-admin-border)] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-[var(--color-text-secondary)]">
                    Unidade
                  </label>
                  <input
                    type="text"
                    name="unit"
                    defaultValue={editingProduto?.unit}
                    required
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
                    name="expiry_date"
                    defaultValue={editingProduto?.expiry_date ? editingProduto.expiry_date.split('T')[0] : ''}
                    className="w-full px-4 py-3 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-admin-border)] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-[var(--color-text-secondary)]">
                    Valor Unitário (R$)
                  </label>
                  <input
                    type="number"
                    name="unit_price"
                    step="0.01"
                    defaultValue={editingProduto?.unit_price}
                    required
                    min="0"
                    className="w-full px-4 py-3 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-admin-border)] transition-colors"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  disabled={submitLoading}
                  className="flex-1 px-4 py-3 bg-[var(--color-bg-card)] hover:bg-[var(--color-border)] rounded-lg transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="flex-1 px-4 py-3 bg-[var(--color-admin)] hover:bg-[var(--color-admin-border)] text-[var(--color-admin-light)] rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitLoading && <Loader className="w-4 h-4 animate-spin" />}
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
