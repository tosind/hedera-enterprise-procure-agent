import { describe, expect, it } from 'vitest';
import { Client } from '@hiero-ledger/sdk';
import { createErpValidationTool } from '../src/plugins/erpValidationPlugin.js';

describe('ERP validation plugin', () => {
  it('exposes a Hedera Agent Kit compatible tool', async () => {
    const tool = createErpValidationTool({
      MAX_APPROVAL_USD: '750',
      ALLOWLISTED_VENDOR_IDS: 'vendor-acme,vendor-hashpack',
    } as NodeJS.ProcessEnv);

    expect(tool.method).toBe('erp_validate_invoice_tool');
    expect(tool.parameters.safeParse({ invoiceId: 'INV-1001' }).success).toBe(true);

    const result = await tool.execute(Client.forTestnet(), {}, { invoiceId: 'INV-1001' });
    expect(result.approved).toBe(true);
  });
});
