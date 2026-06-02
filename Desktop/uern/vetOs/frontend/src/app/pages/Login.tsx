import { useState } from "react";
import { useNavigate } from "react-router";
import { PawPrint, Mail, Lock } from "lucide-react";

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login - qualquer credencial funciona
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-dark)] p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-[var(--color-primary)] mb-4">
            <PawPrint className="w-12 h-12 text-[var(--color-secondary)]" />
          </div>
          <h1 className="text-4xl font-bold mb-2">
            <span className="text-[var(--color-primary-light)]">Vet</span>
            <span className="text-[var(--color-accent)]">.</span>
            <span className="text-[var(--color-secondary)]">OS</span>
          </h1>
          <p className="text-[var(--color-text-secondary)]">Sistema de Gestão Veterinária</p>
        </div>

        {/* Login Form */}
        <div className="bg-[var(--color-bg-secondary)] rounded-xl border border-[var(--color-border)] p-8">
          <h2 className="text-2xl font-semibold mb-6">Entrar</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2 text-[var(--color-text-secondary)]">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full pl-10 pr-4 py-3 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-secondary)] transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2 text-[var(--color-text-secondary)]">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-secondary)] transition-colors"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[var(--color-secondary)] hover:bg-[var(--color-secondary-light)] text-[var(--color-primary)] font-semibold rounded-lg transition-colors"
            >
              Entrar
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-[var(--color-border)]">
            <p className="text-sm text-center text-[var(--color-text-muted)]">
              Use qualquer email e senha para acessar o sistema
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
