import type { Client } from '@hiero-ledger/sdk';
import type { Context, Plugin, Tool } from '@hashgraph/hedera-agent-kit';
import { z } from 'zod';
import { findInvoice, findPurchaseOrder, findVendor } from '../fixtures/invoices.js';
import { defaultPolicyConfigFromEnv, evaluateInvoicePayment } from '../policies/paymentPolicy.js';

const parameters = z.object({
  invoiceId: z.string().describe('ERP invoice id to validate before a Hedera payment or audit action'),
});

export const ERP_VALIDATE_INVOICE_TOOL = 'erp_validate_invoice_tool';

export function createErpValidationTool(env = process.env): Tool {
  return {
    method: ERP_VALIDATE_INVOICE_TOOL,
    name: 'ERP invoice validation',
    description:
      'Checks an invoice against vendor KYC, PO balance, allowlist, and payment limit controls before the agent proposes Hedera settlement.',
    parameters,
    async execute(_client: Client, _context: Context, params: z.infer<typeof parameters>) {
      const invoice = findInvoice(params.invoiceId);
      if (!invoice) {
        return {
          approved: false,
          reasons: [`Invoice ${params.invoiceId} was not found`],
          invoiceId: params.invoiceId,
        };
      }

      return evaluateInvoicePayment(
        invoice,
        findVendor(invoice.vendorId),
        findPurchaseOrder(invoice.purchaseOrderId),
        defaultPolicyConfigFromEnv(env),
      );
    },
    outputParser(rawOutput: string) {
      const parsed = JSON.parse(rawOutput);
      return {
        raw: parsed,
        humanMessage: parsed.approved
          ? `Invoice ${parsed.invoiceId} passed enterprise controls.`
          : `Invoice ${parsed.invoiceId} blocked: ${parsed.reasons.join('; ')}`,
      };
    },
  };
}

export const erpValidationPlugin: Plugin = {
  name: 'bountyops-erp-validation-plugin',
  version: '0.1.0',
  description: 'Enterprise ERP guardrail plugin for Hedera Agent Kit payment approval workflows.',
  tools: () => [createErpValidationTool()],
};
