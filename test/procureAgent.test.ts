import { describe, expect, it } from 'vitest';
import { runProcurementAgent } from '../src/agent/procureAgent.js';

describe('procurement agent dry run', () => {
  it('returns a human-signature-ready approval plan for a valid invoice', async () => {
    const result = await runProcurementAgent({ invoiceId: 'INV-1001', dryRun: true });

    expect(result.approved).toBe(true);
    expect(result.nextAction).toBe('ready_for_human_signature');
    expect(result.enabledTools).toContain('erp_validate_invoice_tool');
    expect(result.enabledTools).toContain('submit_topic_message_tool');
  });

  it('blocks unsafe invoices before proposing Hedera actions', async () => {
    const result = await runProcurementAgent({ invoiceId: 'INV-1002', dryRun: true });

    expect(result.approved).toBe(false);
    expect(result.nextAction).toBe('blocked');
  });
});
