import { Navigate } from 'react-router';
import { useAuth } from '../../hooks/useAuth';
import { pagePermissions, hasPermission } from '../../config/permissions';

interface PermissionGuardProps {
  children: React.ReactNode;
  requiredPath: string;
}

export function PermissionGuard({ children, requiredPath }: PermissionGuardProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-dark)]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[var(--color-primary)] border-t-[var(--color-secondary)] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[var(--color-text-secondary)]">Carregando...</p>
        </div>
      </div>
    );
  }

  const permission = pagePermissions.find(p => p.path === requiredPath);
  
  if (!permission) {
    return <>{children}</>;
  }

  if (!hasPermission(user?.role as any, permission)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-dark)]">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-[var(--color-error)]/20 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-[var(--color-error)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">Acesso Negado</h2>
          <p className="text-[var(--color-text-secondary)] mb-6">Você não tem permissão para acessar esta página.</p>
          <a href="/" className="inline-block px-6 py-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary-light)] text-white rounded-lg transition-colors">
            Voltar ao Dashboard
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
