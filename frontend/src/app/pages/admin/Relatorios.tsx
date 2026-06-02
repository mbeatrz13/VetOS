import { useState } from "react";
import { BarChart3, Download, Calendar, TrendingUp, Users, PawPrint, Package, DollarSign } from "lucide-react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export function Relatorios() {
  const [periodo, setPeriodo] = useState("mes");

  // Dados mock para os gráficos
  const atendimentosPorMes = [
    { mes: "Jan", atendimentos: 45, receita: 12500 },
    { mes: "Fev", atendimentos: 52, receita: 14200 },
    { mes: "Mar", atendimentos: 61, receita: 16800 },
  ];

  const atendimentosPorTipo = [
    { nome: "Consulta", valor: 45, cor: "#5DCAA5" },
    { nome: "Vacinação", valor: 28, cor: "#3C3489" },
    { nome: "Cirurgia", valor: 12, cor: "#712B13" },
    { nome: "Emergência", valor: 8, cor: "#FF6B6B" },
  ];

  const especiesPorAtendimento = [
    { nome: "Cães", valor: 62, cor: "#5DCAA5" },
    { nome: "Gatos", valor: 31, cor: "#3C3489" },
    { nome: "Outros", valor: 7, cor: "#712B13" },
  ];

  const produtosMaisVendidos = [
    { produto: "Ração Premium", vendas: 45 },
    { produto: "Vacina Antirrábica", vendas: 38 },
    { produto: "Vermífugo", vendas: 32 },
    { produto: "Antipulgas", vendas: 28 },
    { produto: "Shampoo", vendas: 22 },
  ];

  const resumoMensal = [
    { label: "Atendimentos", valor: "156", icon: BarChart3, color: "recepcao" },
    { label: "Novos Tutores", valor: "23", icon: Users, color: "recepcao" },
    { label: "Animais Cadastrados", valor: "31", icon: PawPrint, color: "clinico" },
    { label: "Receita Total", valor: "R$ 43.500", icon: DollarSign, color: "admin" },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Relatórios</h1>
          <p className="text-[var(--color-text-secondary)]">Análises e estatísticas</p>
        </div>
        <div className="flex gap-3">
          <select
            value={periodo}
            onChange={(e) => setPeriodo(e.target.value)}
            className="px-4 py-2 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-admin-border)] transition-colors"
          >
            <option value="semana">Última Semana</option>
            <option value="mes">Último Mês</option>
            <option value="trimestre">Último Trimestre</option>
            <option value="ano">Último Ano</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 bg-[var(--color-admin)] hover:bg-[var(--color-admin-border)] text-[var(--color-admin-light)] rounded-lg transition-colors">
            <Download className="w-5 h-5" />
            Exportar
          </button>
        </div>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {resumoMensal.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg bg-[var(--color-${item.color})] flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 text-[var(--color-${item.color}-light)]`} />
                </div>
                <TrendingUp className="w-5 h-5 text-[var(--color-success)]" />
              </div>
              <div>
                <p className="text-3xl font-bold mb-1">{item.valor}</p>
                <p className="text-sm text-[var(--color-text-secondary)]">{item.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Gráficos principais */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Atendimentos por Mês */}
        <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Atendimentos por Mês</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={atendimentosPorMes}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="mes" stroke="#C2C0B6" />
              <YAxis stroke="#C2C0B6" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1A1A1A',
                  border: '1px solid #333',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Bar dataKey="atendimentos" fill="#5DCAA5" name="Atendimentos" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Receita por Mês */}
        <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Receita por Mês</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={atendimentosPorMes}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="mes" stroke="#C2C0B6" />
              <YAxis stroke="#C2C0B6" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1A1A1A',
                  border: '1px solid #333',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="receita" stroke="#FF6B6B" name="Receita (R$)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gráficos de Pizza */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Atendimentos por Tipo */}
        <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Atendimentos por Tipo</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={atendimentosPorTipo}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ nome, valor }) => `${nome}: ${valor}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="valor"
              >
                {atendimentosPorTipo.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.cor} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1A1A1A',
                  border: '1px solid #333',
                  borderRadius: '8px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Espécies Atendidas */}
        <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Espécies Atendidas</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={especiesPorAtendimento}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ nome, valor }) => `${nome}: ${valor}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="valor"
              >
                {especiesPorAtendimento.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.cor} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1A1A1A',
                  border: '1px solid #333',
                  borderRadius: '8px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Produtos Mais Vendidos */}
      <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Produtos Mais Vendidos</h3>
        <div className="space-y-3">
          {produtosMaisVendidos.map((produto, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-lg bg-[var(--color-admin)] flex items-center justify-center text-[var(--color-admin-light)] font-semibold text-sm">
                {index + 1}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium">{produto.produto}</span>
                  <span className="text-sm text-[var(--color-text-secondary)]">{produto.vendas} vendas</span>
                </div>
                <div className="h-2 bg-[var(--color-bg-card)] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[var(--color-admin)]"
                    style={{ width: `${(produto.vendas / produtosMaisVendidos[0].vendas) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Botões de Relatórios Específicos */}
      <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Relatórios Detalhados</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <button className="flex items-center justify-center gap-2 px-4 py-3 bg-[var(--color-bg-card)] hover:bg-[var(--color-border)] rounded-lg transition-colors">
            <BarChart3 className="w-5 h-5 text-[var(--color-recepcao-light)]" />
            <span>Relatório de Consultas</span>
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-3 bg-[var(--color-bg-card)] hover:bg-[var(--color-border)] rounded-lg transition-colors">
            <Package className="w-5 h-5 text-[var(--color-admin-light)]" />
            <span>Relatório de Estoque</span>
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-3 bg-[var(--color-bg-card)] hover:bg-[var(--color-border)] rounded-lg transition-colors">
            <DollarSign className="w-5 h-5 text-[var(--color-success)]" />
            <span>Relatório Financeiro</span>
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-3 bg-[var(--color-bg-card)] hover:bg-[var(--color-border)] rounded-lg transition-colors">
            <Users className="w-5 h-5 text-[var(--color-clinico-light)]" />
            <span>Relatório de Tutores</span>
          </button>
        </div>
      </div>
    </div>
  );
}
