'use client';

import React from 'react';
import { Card, Button, Badge, Select } from '@/components/ui';
import { AppLayout, PageHeader, Section, Sidebar, SidebarItem } from '@/components/layout';

export default function ReportsPage() {
  const [reportType, setReportType] = React.useState('expiry');
  const [isExporting, setIsExporting] = React.useState(false);
  const [dateRange, setDateRange] = React.useState('30days');
  const [warehouse, setWarehouse] = React.useState('all');

  const reports = [
    {
      name: 'Expiry Report',
      description: 'Drugs expiring within 90 days',
      icon: '⏰',
      lastGenerated: '2024-05-12',
      count: '23 items',
    },
    {
      name: 'Dispatch Report',
      description: 'Recent batch dispatches',
      icon: '📤',
      lastGenerated: '2024-05-11',
      count: '156 records',
    },
    {
      name: 'Stock Report',
      description: 'Current inventory levels',
      icon: '📊',
      lastGenerated: '2024-05-12',
      count: '284 drugs',
    },
    {
      name: 'Temperature Report',
      description: 'Temperature-sensitive drugs',
      icon: '🌡️',
      lastGenerated: '2024-05-10',
      count: '45 drugs',
    },
  ];

  return (
    <AppLayout
      sidebar={
        <Sidebar>
          <SidebarItem label="Dashboard" icon="📊" href="/dashboard" />
          <SidebarItem label="Reports" active icon="📋" href="/reports" />
          <SidebarItem label="Batches" icon="🎫" href="/batches" />
          <SidebarItem label="Drugs" icon="💊" href="/drugs" />
          <SidebarItem label="Alerts" icon="⚠️" href="/alerts" />
        </Sidebar>
      }
      header={
        <div className="flex items-center justify-between px-8 py-4">
          <h1 className="text-xl font-bold text-text-primary">PharmaStock</h1>
        </div>
      }
    >
      <PageHeader
        title="Reports"
        subtitle="Generate and export business reports"
        actions={
          <Button
            variant="primary"
            isLoading={isExporting}
            onClick={() => setIsExporting(true)}
          >
            📥 Export Report
          </Button>
        }
      />

      {/* Report Templates */}
      <Section title="Available Reports" subtitle="Select a report to generate">
        <div className="grid grid-cols-2 gap-4">
          {reports.map((report, idx) => (
            <Card
              key={idx}
              className="p-6 cursor-pointer hover:shadow-md transition-shadow hover:border-primary"
              onClick={() => setReportType(report.name.toLowerCase())}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="text-4xl">{report.icon}</div>
                <Badge variant="default">{report.count}</Badge>
              </div>
              <h3 className="font-semibold text-text-primary mb-2">{report.name}</h3>
              <p className="text-sm text-text-secondary mb-4">{report.description}</p>
              <div className="flex items-center justify-between text-xs text-text-muted">
                <span>Last generated: {report.lastGenerated}</span>
                <Button variant="ghost" size="sm">Generate →</Button>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* Report Filters */}
      <Section title="Report Filters" subtitle="Customize your report">
        <Card className="p-6">
          <div className="grid grid-cols-3 gap-6">
            <Select
              label="Report Type"
              options={[
                { value: 'expiry', label: 'Expiry' },
                { value: 'dispatch', label: 'Dispatch' },
                { value: 'stock', label: 'Stock' },
              ]}
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
            />
            <Select
              label="Date Range"
              options={[
                { value: '7days', label: 'Last 7 days' },
                { value: '30days', label: 'Last 30 days' },
                { value: '90days', label: 'Last 90 days' },
                { value: 'custom', label: 'Custom' },
              ]}
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            />
            <Select
              label="Warehouse"
              options={[
                { value: 'all', label: 'All Warehouses' },
                { value: 'main', label: 'Main' },
                { value: 'storage-a', label: 'Storage A' },
              ]}
              value={warehouse}
              onChange={(e) => setWarehouse(e.target.value)}
            />
          </div>
          <div className="mt-6 flex gap-3">
            <Button variant="primary">Generate Report</Button>
            <Button variant="outline">Preview</Button>
          </div>
        </Card>
      </Section>

      {/* Recent Reports */}
      <Section title="Generated Reports" subtitle="Your recent reports">
        <Card className="overflow-hidden">
          <table className="w-full">
            <thead className="bg-off-white border-b border-border">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Report</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Generated</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Type</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3].map((item) => (
                <tr key={item} className="border-b border-border hover:bg-off-white">
                  <td className="px-6 py-4 text-sm text-text-primary font-medium">
                    Report #{1000 + item}
                  </td>
                  <td className="px-6 py-4 text-sm text-text-secondary">
                    2024-05-{12 - item}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <Badge variant="secondary">
                      {['Expiry', 'Dispatch', 'Stock'][item - 1]}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-sm space-x-2">
                    <Button variant="ghost" size="sm">View</Button>
                    <Button variant="ghost" size="sm">Download</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </Section>
    </AppLayout>
  );
}
