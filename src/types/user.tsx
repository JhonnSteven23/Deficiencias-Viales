export type UserRole = 'user' | 'authority' | 'admin';

export interface User {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  photoURL?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface UserStats {
  totalReports: number;
  resolvedReports: number;
  pendingReports: number;
  inProgressReports: number;
}

// Permisos por rol
export const ROLE_PERMISSIONS = {
  user: {
    canCreateReports: true,
    canViewOwnReports: true,
    canViewAllReports: false,
    canManageUsers: false,
    canAssignReports: false,
    canResolveReports: false,
  },
  authority: {
    canCreateReports: true,
    canViewOwnReports: true,
    canViewAllReports: true,
    canManageUsers: false,
    canAssignReports: true,
    canResolveReports: true,
  },
  admin: {
    canCreateReports: true,
    canViewOwnReports: true,
    canViewAllReports: true,
    canManageUsers: true,
    canAssignReports: true,
    canResolveReports: true,
  },
} as const;

export function hasPermission(
  userRole: UserRole, 
  permission: keyof typeof ROLE_PERMISSIONS.user
): boolean {
  return ROLE_PERMISSIONS[userRole][permission];
}