'use client';

import React from 'react';
import { Card, Button, Badge, Input, Alert } from '@/components/ui';
import { AppLayout, PageHeader, Section, Sidebar, SidebarItem } from '@/components/layout';

export default function ImportPage() {
  const [isDragging, setIsDragging] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState(0);
  const [isUploading, setIsUploading] = React.useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    // Simulate upload
    setIsUploading(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress >= 100) {
        setUploadProgress(100);
        clearInterval(interval);
        setIsUploading(false);
      } else {
        setUploadProgress(Math.floor(progress));
      }
    }, 300);
  };

  return (
    <AppLayout
      sidebar={
        <Sidebar>
          <SidebarItem label="Dashboard" icon="📊" href="/dashboard" />
          <SidebarItem label="Import" active icon="📥" href="/import" />
          <SidebarItem label="Drugs" icon="💊" href="/drugs" />
          <SidebarItem label="Batches" icon="🎫" href="/batches" />
          <SidebarItem label="Reports" icon="📋" href="/reports" />
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
        title="Import Drugs"
        subtitle="Upload and manage bulk drug inventory"
        actions={
          <Button variant="outline" size="sm" href="/import/template">
            📥 Download Template
          </Button>
        }
      />

      {/* Upload Area */}
      <Section>
        <Card
          className={`p-12 text-center cursor-pointer transition-all border-2 border-dashed ${
            isDragging
              ? 'border-primary bg-primary-light'
              : 'border-border hover:border-primary'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="text-5xl mb-4">📤</div>
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            Drag and drop your file here
          </h3>
          <p className="text-text-secondary mb-6">
            Supports .xlsx, .csv files up to 10MB
          </p>
          <Button variant="primary">Select File</Button>
        </Card>
      </Section>

      {/* Upload Progress */}
      {isUploading && (
        <Section>
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="font-medium text-text-primary">Uploading...</p>
              <span className="text-sm text-text-secondary">{uploadProgress}%</span>
            </div>
            <div className="w-full bg-border rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-primary to-secondary h-full transition-all"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </Card>
        </Section>
      )}

      {/* Recent Imports */}
      <Section title="Recent Imports" subtitle="Your import history">
        <Card className="overflow-hidden">
          <table className="w-full">
            <thead className="bg-off-white border-b border-border">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">File</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Imported</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3].map((item) => (
                <tr key={item} className="border-b border-border hover:bg-off-white">
                  <td className="px-6 py-4 text-sm text-text-primary font-medium">
                    drugs_batch_{item}.xlsx
                  </td>
                  <td className="px-6 py-4 text-sm text-text-secondary">
                    2024-05-{12 + item}
                  </td>
                  <td className="px-6 py-4 text-sm text-text-primary">
                    {50 * item} drugs
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <Badge variant="success">Completed</Badge>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <Button variant="ghost" size="sm">
                      View Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </Section>

      {/* Import Guidelines */}
      <Section title="Import Guidelines" subtitle="Required format and validations">
        <div className="space-y-4">
          <Alert type="info" title="Column Requirements">
            drugName, manufacturer, composition, category, expiryDate, quantity, tempMin, tempMax
          </Alert>
          <Card className="p-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-text-primary">Validation Rules:</h4>
              <ul className="space-y-2 text-text-secondary text-sm">
                <li>✓ Drug names must be unique</li>
                <li>✓ Expiry date must be in YYYY-MM-DD format</li>
                <li>✓ Quantity must be a positive number</li>
                <li>✓ Temperature range: tempMin &lt; tempMax</li>
                <li>✓ Maximum 500 rows per file</li>
              </ul>
            </div>
          </Card>
        </div>
      </Section>
    </AppLayout>
  );
}
