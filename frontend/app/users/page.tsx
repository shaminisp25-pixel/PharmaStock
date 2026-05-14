'use client';

import React from 'react';
import { Card, Button, Badge, Select, Input, Modal } from '@/components/ui';
import { AppLayout, PageHeader, Section, Sidebar, SidebarItem } from '@/components/layout';

export default function UsersPage() {
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [editingUser, setEditingUser] = React.useState<number | null>(null);

  const users = [
    {
      id: 1,
      name: 'John Pharmacy Manager',
      email: 'john@pharmastock.com',
      role: 'manager',
      warehouse: 'Main',
      status: 'active',
      lastLogin: '2024-05-12',
    },
    {
      id: 2,
      name: 'Sarah Store Officer',
      email: 'sarah@pharmastock.com',
      role: 'officer',
      warehouse: 'Storage A',
      status: 'active',
      lastLogin: '2024-05-11',
    },
    {
      id: 3,
      name: 'Mike Admin',
      email: 'mike@pharmastock.com',
      role: 'admin',
      warehouse: 'Main',
      status: 'active',
      lastLogin: '2024-05-12',
    },
    {
      id: 4,
      name: 'Lisa Inspector',
      email: 'lisa@pharmastock.com',
      role: 'inspector',
      warehouse: 'All',
      status: 'inactive',
      lastLogin: '2024-04-28',
    },
    {
      id: 5,
      name: 'Tom Operator',
      email: 'tom@pharmastock.com',
      role: 'officer',
      warehouse: 'Storage B',
      status: 'active',
      lastLogin: '2024-05-10',
    },
  ];

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      admin: 'danger',
      manager: 'primary',
      officer: 'secondary',
      inspector: 'accent',
    };
    return colors[role] || 'secondary';
  };

  const getRoleIcon = (role: string) => {
    const icons: Record<string, string> = {
      admin: '👑',
      manager: '📋',
      officer: '👨‍💼',
      inspector: '🔍',
    };
    return icons[role] || '👤';
  };

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'success' : 'warning';
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AppLayout
      sidebar={
        <Sidebar>
          <SidebarItem label="Dashboard" icon="📊" href="/dashboard" />
          <SidebarItem label="Drugs" icon="💊" href="/drugs" />
          <SidebarItem label="Batches" icon="🎫" href="/batches" />
          <SidebarItem label="Alerts" icon="⚠️" href="/alerts" />
          <SidebarItem label="Users" active icon="👥" href="/users" />
        </Sidebar>
      }
      header={
        <div className="flex items-center justify-between px-8 py-4">
          <h1 className="text-xl font-bold text-text-primary">PharmaStock</h1>
        </div>
      }
    >
      <PageHeader
        title="User Management"
        subtitle="Manage team members, roles, and permissions"
        actions={
          <Button variant="primary" onClick={() => setShowAddModal(true)}>
            + Add User
          </Button>
        }
      />

      {/* Statistics */}
      <Section title="Team Overview">
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Total Users', count: users.length, icon: '👥' },
            { label: 'Active', count: users.filter(u => u.status === 'active').length, icon: '✓' },
            { label: 'Managers', count: users.filter(u => u.role === 'manager').length, icon: '📋' },
            { label: 'Admins', count: users.filter(u => u.role === 'admin').length, icon: '👑' },
          ].map((stat, idx) => (
            <Card key={idx} className="p-4 text-center">
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-bold text-primary-500 mb-1">{stat.count}</div>
              <div className="text-sm text-text-secondary">{stat.label}</div>
            </Card>
          ))}
        </div>
      </Section>

      {/* Search and Filter */}
      <Section title="Search Users">
        <Card className="p-6">
          <Input
            label="Search by name or email"
            placeholder="Enter user name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Card>
      </Section>

      {/* Users Table */}
      <Section title="Team Members">
        <Card className="overflow-hidden">
          <table className="w-full">
            <thead className="bg-off-white border-b border-border">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Role</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Warehouse</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Last Login</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-border hover:bg-off-white transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="text-2xl">{getRoleIcon(user.role)}</div>
                      <div className="font-medium text-text-primary">{user.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-text-secondary">{user.email}</td>
                  <td className="px-6 py-4 text-sm">
                    <Badge variant={getRoleColor(user.role)}>
                      {user.role.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-text-secondary">{user.warehouse}</td>
                  <td className="px-6 py-4 text-sm">
                    <Badge variant={getStatusColor(user.status)}>
                      {user.status.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-text-secondary">{user.lastLogin}</td>
                  <td className="px-6 py-4 text-sm space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingUser(user.id)}
                    >
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm">Remove</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </Section>

      {/* Role Reference */}
      <Section title="Role Permissions Reference">
        <div className="grid grid-cols-2 gap-4">
          {[
            {
              role: 'Admin',
              permissions: ['Full system access', 'User management', 'Audit logs'],
              color: 'danger',
            },
            {
              role: 'Manager',
              permissions: ['Drug CRUD', 'Batch management', 'Reports', 'Alert resolution'],
              color: 'primary',
            },
            {
              role: 'Officer',
              permissions: ['View inventory', 'Dispatch batches', 'Import data', 'Create alerts'],
              color: 'secondary',
            },
            {
              role: 'Inspector',
              permissions: ['View all data', 'Audit logs', 'Reports', 'No edit access'],
              color: 'accent',
            },
          ].map((item, idx) => (
            <Card key={idx} className="p-6">
              <h3 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
                <span>{getRoleIcon(item.role.toLowerCase())}</span>
                {item.role}
              </h3>
              <ul className="space-y-2">
                {item.permissions.map((perm, pidx) => (
                  <li key={pidx} className="text-sm text-text-secondary flex items-center gap-2">
                    <span className="text-success-500">✓</span>
                    {perm}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </Section>

      {/* Add User Modal */}
      {showAddModal && (
        <Modal
          title="Add New User"
          subtitle="Create a new team member account"
          onClose={() => setShowAddModal(false)}
        >
          <div className="space-y-4 mb-6">
            <Input label="Full Name" placeholder="Enter full name" />
            <Input label="Email" type="email" placeholder="Enter email address" />
            <Select
              label="Role"
              options={[
                { value: 'officer', label: 'Officer' },
                { value: 'manager', label: 'Manager' },
                { value: 'inspector', label: 'Inspector' },
              ]}
            />
            <Select
              label="Warehouse"
              options={[
                { value: 'main', label: 'Main' },
                { value: 'storage-a', label: 'Storage A' },
                { value: 'storage-b', label: 'Storage B' },
              ]}
            />
          </div>
          <div className="flex gap-3">
            <Button variant="primary">Create User</Button>
            <Button variant="outline" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
          </div>
        </Modal>
      )}
    </AppLayout>
  );
}
