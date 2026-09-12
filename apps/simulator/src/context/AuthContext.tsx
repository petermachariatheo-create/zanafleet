import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Persona, Role, User } from '../types';

interface SimulatorUser extends User {
  memberships: Array<{ workspaceId: string; role: string; earnings: number; joinedAt: Date }>;
  isAvailable: boolean;
  walletBalance: number;
  pendingPayouts: number;
  totalJobs: number;
  successRate: number;
}

const fleetWorkspaces = [
  { workspaceId: 'ws-0001', role: 'FLEET_MANAGER', earnings: 45000, joinedAt: new Date() },
  { workspaceId: 'ws-0002', role: 'FLEET_MANAGER', earnings: 45000, joinedAt: new Date() },
];

// Mock users for each role
const mockUsers: Record<Role, SimulatorUser> = {
  ADMIN: {
    id: 'actor-admin-001',
    name: 'Sarah Admin',
    phone: '+254700000001',
    role: 'ADMIN',
    workspaceId: '00000000-0000-0000-0000-000000000001',
    avatar: '👩‍💼',
    token: 'mock-admin-token',
    memberships: [
      ...fleetWorkspaces,
      { workspaceId: 'ws-0003', role: 'ADMIN', earnings: 0, joinedAt: new Date() },
      { workspaceId: 'ws-0004', role: 'ADMIN', earnings: 0, joinedAt: new Date() },
      { workspaceId: 'ws-0005', role: 'ADMIN', earnings: 0, joinedAt: new Date() },
    ],
    isAvailable: true,
    walletBalance: 0,
    pendingPayouts: 0,
    totalJobs: 0,
    successRate: 100,
  },
  OPS: {
    id: 'actor-ops-001',
    name: 'John Ops',
    phone: '+254700000002',
    role: 'OPS',
    workspaceId: '00000000-0000-0000-0000-000000000001',
    avatar: '👨‍💻',
    token: 'mock-ops-token',
    memberships: fleetWorkspaces,
    isAvailable: true,
    walletBalance: 45000,
    pendingPayouts: 0,
    totalJobs: 120,
    successRate: 99,
  },
  BUSINESS_OWNER: {
    id: 'actor-owner-001',
    name: 'Mike Business',
    phone: '+254700000003',
    role: 'BUSINESS_OWNER',
    workspaceId: '00000000-0000-0000-0000-000000000001',
    avatar: '🏪',
    totalEarnings: 45000,
    token: 'mock-business-token',
    memberships: [
      { workspaceId: 'ws-0001', role: 'BUSINESS_OWNER', earnings: 45000, joinedAt: new Date() },
      { workspaceId: 'ws-0004', role: 'BUSINESS_OWNER', earnings: 45000, joinedAt: new Date() },
    ],
    isAvailable: true,
    walletBalance: 78000,
    pendingPayouts: 12000,
    totalJobs: 184,
    successRate: 98,
  },
  RIDER: {
    id: 'actor-rider-001',
    name: 'Jane Rider',
    phone: '+254700000004',
    role: 'RIDER',
    workspaceId: '00000000-0000-0000-0000-000000000001',
    avatar: '🏍️',
    totalEarnings: 12500,
    token: 'mock-rider-token',
    memberships: [
      { workspaceId: 'ws-0001', role: 'RIDER', earnings: 12500, joinedAt: new Date() },
      { workspaceId: 'ws-0002', role: 'RIDER', earnings: 12500, joinedAt: new Date() },
    ],
    isAvailable: true,
    walletBalance: 12500,
    pendingPayouts: 3500,
    totalJobs: 234,
    successRate: 96.5,
  },
  CUSTOMER: {
    id: 'actor-customer-001',
    name: 'Alice Customer',
    phone: '+254700000005',
    role: 'CUSTOMER',
    workspaceId: '00000000-0000-0000-0000-000000000001',
    avatar: '👤',
    token: 'mock-customer-token',
    memberships: [{ workspaceId: 'ws-0005', role: 'CONTRACTOR', earnings: 0, joinedAt: new Date() }],
    isAvailable: true,
    walletBalance: 8900,
    pendingPayouts: 2100,
    totalJobs: 56,
    successRate: 92.1,
  },
};

const personaRoles: Record<Persona, Role> = {
  rider: 'RIDER',
  'fleet-manager': 'OPS',
  'business-owner': 'BUSINESS_OWNER',
  'marketplace-contractor': 'CUSTOMER',
  admin: 'ADMIN',
};

interface AuthContextType {
  isAuthenticated: boolean;
  currentUser: SimulatorUser | null;
  workspaceId: string;
  token: string | null;
  login: (persona: Persona) => void;
  logout: () => void;
  switchRole: (role: Role) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<SimulatorUser | null>(null);
  const [workspaceId, setWorkspaceId] = useState('');
  const [token, setToken] = useState<string | null>(null);

  const login = (persona: Persona) => {
    const user = mockUsers[personaRoles[persona]];
    setCurrentUser(user);
    setToken(user.token || null);
    setWorkspaceId(user.workspaceId);
  };

  const logout = () => {
    setCurrentUser(null);
    setToken(null);
  };

  const switchRole = (role: Role) => {
    const newUser = mockUsers[role];
    setCurrentUser(newUser);
    setToken(newUser.token || null);
    setWorkspaceId(newUser.workspaceId);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!currentUser,
        currentUser,
        workspaceId,
        token,
        login,
        logout,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
