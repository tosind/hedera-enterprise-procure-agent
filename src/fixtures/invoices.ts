export type Vendor = {
  id: string;
  legalName: string;
  walletAccountId: string;
  kycStatus: 'verified' | 'review' | 'blocked';
  riskTier: 'low' | 'medium' | 'high';
};

export type PurchaseOrder = {
  id: string;
  vendorId: string;
  remainingUsd: number;
  approvedBy: string;
  costCenter: string;
};

export type Invoice = {
  id: string;
  vendorId: string;
  purchaseOrderId: string;
  amountUsd: number;
  memo: string;
};

export const vendors: Vendor[] = [
  {
    id: 'vendor-acme',
    legalName: 'Acme Facilities GmbH',
    walletAccountId: '0.0.456789',
    kycStatus: 'verified',
    riskTier: 'low',
  },
  {
    id: 'vendor-hashpack',
    legalName: 'HashPack Services LLC',
    walletAccountId: '0.0.987654',
    kycStatus: 'verified',
    riskTier: 'medium',
  },
  {
    id: 'vendor-shadow',
    legalName: 'Shadow Vendor Ltd',
    walletAccountId: '0.0.111222',
    kycStatus: 'blocked',
    riskTier: 'high',
  },
];

export const purchaseOrders: PurchaseOrder[] = [
  {
    id: 'PO-2026-140',
    vendorId: 'vendor-acme',
    remainingUsd: 500,
    approvedBy: 'ops-director@example.com',
    costCenter: 'OPS-DEMO',
  },
  {
    id: 'PO-2026-141',
    vendorId: 'vendor-hashpack',
    remainingUsd: 1000,
    approvedBy: 'finance-controller@example.com',
    costCenter: 'WEB3-DEMO',
  },
];

export const invoices: Invoice[] = [
  {
    id: 'INV-1001',
    vendorId: 'vendor-acme',
    purchaseOrderId: 'PO-2026-140',
    amountUsd: 325,
    memo: 'Facilities support retainer',
  },
  {
    id: 'INV-1002',
    vendorId: 'vendor-shadow',
    purchaseOrderId: 'PO-2026-140',
    amountUsd: 325,
    memo: 'Blocked vendor regression fixture',
  },
  {
    id: 'INV-1003',
    vendorId: 'vendor-hashpack',
    purchaseOrderId: 'PO-2026-141',
    amountUsd: 900,
    memo: 'Above default approval limit fixture',
  },
];

export function findInvoice(invoiceId: string): Invoice | undefined {
  return invoices.find(invoice => invoice.id === invoiceId);
}

export function findVendor(vendorId: string): Vendor | undefined {
  return vendors.find(vendor => vendor.id === vendorId);
}

export function findPurchaseOrder(purchaseOrderId: string): PurchaseOrder | undefined {
  return purchaseOrders.find(po => po.id === purchaseOrderId);
}
