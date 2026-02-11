'use client';
import ComponentCard from '@/components/common/ComponentCard'
import PageBreadcrumb from '@/components/common/PageBreadCrumb'
import FreeDeliverySettings from '@/components/delivery/FreeDeliverySettings'
import WilayasTable from '@/components/tables/WilayasTable'
import React from 'react'
import { useTranslation } from 'react-i18next';

export default function DeliverySettings() {
  const { t } = useTranslation('admin');
  return (
    <div>
      <PageBreadcrumb pageTitle={t('delivery.title')} />

      {/* Free Delivery Settings Section */}
      <FreeDeliverySettings />

      {/* Delivery Costs Table */}
      <ComponentCard title={t('delivery.costsTable')}>
        <WilayasTable />
      </ComponentCard>
    </div>
  )
}
