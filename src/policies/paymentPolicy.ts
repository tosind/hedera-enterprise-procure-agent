import type { Invoice, PurchaseOrder, Vendor } from '../fixtures/invoices.js';

export type PaymentDecision = {
  approved: boolean;
  reasons: string[];
  invoiceId: string;
  vendorId: string;
  vendorWallet?: string;
  amountUsd: number;
  costCenter?: string;
};

export type PaymentPolicyConfig = {
  maxApprovalUsd: number;
  allowlistedVendorIds: string[];
};

export function defaultPolicyConfigFromEnv(env = process.env): PaymentPolicyConfig {
  const allowlistedVendorIds = (env.ALLOWLISTED_VENDOR_IDS ?? 'vendor-acme,vendor-hashpack')
    .split(',')
    .map(id => id.trim())
    .filter(Boolean);

  return {
    maxApprovalUsd: Number(env.MAX_APPROVAL_USD ?? 750),
    allowlistedVendorIds,
  };
}

export function evaluateInvoicePayment(
  invoice: Invoice,
  vendor: Vendor | undefined,
  purchaseOrder: PurchaseOrder | undefined,
  config: PaymentPolicyConfig,
): PaymentDecision {
  const reasons: string[] = [];

  if (!vendor) {
    reasons.push(`Vendor ${invoice.vendorId} was not found in ERP vendor master`);
  }

  if (!purchaseOrder) {
    reasons.push(`Purchase order ${invoice.purchaseOrderId} was not found`);
  }

  if (vendor && !config.allowlistedVendorIds.includes(vendor.id)) {
    reasons.push(`Vendor ${vendor.id} is not in the agent allowlist`);
  }

  if (vendor?.kycStatus !== 'verified') {
    reasons.push(`Vendor KYC status is ${vendor?.kycStatus ?? 'missing'}`);
  }

  if (vendor?.riskTier === 'high') {
    reasons.push('Vendor risk tier is high');
  }

  if (purchaseOrder && purchaseOrder.vendorId !== invoice.vendorId) {
    reasons.push(`Purchase order belongs to ${purchaseOrder.vendorId}, not ${invoice.vendorId}`);
  }

  if (purchaseOrder && invoice.amountUsd > purchaseOrder.remainingUsd) {
    reasons.push(`Invoice exceeds PO remaining balance by ${invoice.amountUsd - purchaseOrder.remainingUsd} USD`);
  }

  if (invoice.amountUsd > config.maxApprovalUsd) {
    reasons.push(`Invoice exceeds max autonomous approval limit of ${config.maxApprovalUsd} USD`);
  }

  return {
    approved: reasons.length === 0,
    reasons,
    invoiceId: invoice.id,
    vendorId: invoice.vendorId,
    vendorWallet: vendor?.walletAccountId,
    amountUsd: invoice.amountUsd,
    costCenter: purchaseOrder?.costCenter,
  };
}
