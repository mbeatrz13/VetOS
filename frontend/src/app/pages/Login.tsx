import { useState } from "react";
import { useNavigate } from "react-router";
import { PawPrint, Mail, Lock, Sun, Moon } from "lucide-react";
import { login } from "../../services/auth.service";
import { useTheme } from "../../contexts/ThemeContext";

export function Login() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(username, password);
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-dark)] p-4 relative">
      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className="fixed top-6 right-6 p-2 hover:bg-[var(--color-bg-card)] rounded-lg transition-colors"
        title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      >
        {theme === 'dark' ? (
          <Sun className="w-5 h-5 text-[var(--color-secondary)]" />
        ) : (
          <Moon className="w-5 h-5 text-[var(--color-primary)]" />
        )}
      </button>

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
              <label htmlFor="username" className="block text-sm font-medium mb-2 text-[var(--color-text-secondary)]">
                Username
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" />
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="seu-username"
                  className="w-full pl-10 pr-4 py-3 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-secondary)] transition-colors"
                  required
                  disabled={loading}
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
                  disabled={loading}
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-500 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[var(--color-secondary)] hover:bg-[var(--color-secondary-light)] disabled:opacity-50 disabled:cursor-not-allowed text-[var(--color-primary)] font-semibold rounded-lg transition-colors"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-[var(--color-border)]">
            <p className="text-sm text-center text-[var(--color-text-muted)]">
              Credenciais de teste:<br/>
              Admin: admin / admin123<br/>
              Vet: dr_carlos_silva / vet123<br/>
              Rec: rec_1 / rec123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
