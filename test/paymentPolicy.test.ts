import { describe, expect, it } from 'vitest';
import { findInvoice, findPurchaseOrder, findVendor } from '../src/fixtures/invoices.js';
import { evaluateInvoicePayment } from '../src/policies/paymentPolicy.js';

const config = {
  maxApprovalUsd: 750,
  allowlistedVendorIds: ['vendor-acme', 'vendor-hashpack'],
};

describe('enterprise payment policy', () => {
  it('approves a verified vendor with an in-limit PO-backed invoice', () => {
    const invoice = findInvoice('INV-1001');
    expect(invoice).toBeDefined();

    const decision = evaluateInvoicePayment(
      invoice!,
      findVendor(invoice!.vendorId),
      findPurchaseOrder(invoice!.purchaseOrderId),
      config,
    );

    expect(decision.approved).toBe(true);
    expect(decision.reasons).toEqual([]);
    expect(decision.vendorWallet).toBe('0.0.456789');
  });

  it('blocks a vendor that is not KYC verified', () => {
    const invoice = findInvoice('INV-1002');
    expect(invoice).toBeDefined();

    const decision = evaluateInvoicePayment(
      invoice!,
      findVendor(invoice!.vendorId),
      findPurchaseOrder(invoice!.purchaseOrderId),
      config,
    );

    expect(decision.approved).toBe(false);
    expect(decision.reasons).toContain('Vendor vendor-shadow is not in the agent allowlist');
    expect(decision.reasons).toContain('Vendor KYC status is blocked');
  });

  it('blocks invoices above the autonomous approval limit', () => {
    const invoice = findInvoice('INV-1003');
    expect(invoice).toBeDefined();

    const decision = evaluateInvoicePayment(
      invoice!,
      findVendor(invoice!.vendorId),
      findPurchaseOrder(invoice!.purchaseOrderId),
      config,
    );

    expect(decision.approved).toBe(false);
    expect(decision.reasons).toContain('Invoice exceeds max autonomous approval limit of 750 USD');
  });
});
