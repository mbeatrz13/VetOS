export type UserRole = 'admin' | 'vet' | 'receptionist';

export interface PagePermission {
  path: string;
  label: string;
  requiredRoles: UserRole[];
}

export const pagePermissions: PagePermission[] = [
  // Dashboard - all roles
  { path: '/', label: 'Dashboard', requiredRoles: ['admin', 'vet', 'receptionist'] },
  
  // Reception pages - admin & receptionist
  { path: '/tutores', label: 'Tutores', requiredRoles: ['admin', 'receptionist'] },
  { path: '/animais', label: 'Animais', requiredRoles: ['admin', 'receptionist'] },
  { path: '/agenda', label: 'Agenda', requiredRoles: ['admin', 'receptionist'] },
  
  // Clinical pages - admin & vet
  { path: '/atendimentos', label: 'Atendimentos', requiredRoles: ['admin', 'vet'] },
  { path: '/prontuarios', label: 'Prontuários', requiredRoles: ['admin', 'vet'] },
  { path: '/prescricoes', label: 'Prescrições', requiredRoles: ['admin', 'vet'] },
  { path: '/exames', label: 'Exames', requiredRoles: ['admin', 'vet'] },
  
  // Admin pages - admin only
  { path: '/estoque', label: 'Estoque', requiredRoles: ['admin'] },
  { path: '/funcionarios', label: 'Funcionários', requiredRoles: ['admin'] },
  { path: '/relatorios', label: 'Relatórios', requiredRoles: ['admin'] },
];

export function hasPermission(userRole: UserRole | undefined, pagePermission: PagePermission): boolean {
  if (!userRole) return false;
  return pagePermission.requiredRoles.includes(userRole);
}

export function getAccessiblePages(userRole: UserRole | undefined): PagePermission[] {
  if (!userRole) return [];
  return pagePermissions.filter(page => hasPermission(userRole, page));
}
