export interface User {
  id: string;
  email: string;
  role: 'USER' | 'ADMIN' | 'SUPERADMIN';
  organizationName: string;
  ownerId: string | null;
  createdAt: string;
}