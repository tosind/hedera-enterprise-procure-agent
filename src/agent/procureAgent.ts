import { AgentMode, HederaAgentAPI, type Plugin, ToolDiscovery } from '@hashgraph/hedera-agent-kit';
import { coreAccountQueryPlugin, coreConsensusPlugin } from '@hashgraph/hedera-agent-kit/plugins';
import { findInvoice } from '../fixtures/invoices.js';
import { erpValidationPlugin, ERP_VALIDATE_INVOICE_TOOL } from '../plugins/erpValidationPlugin.js';
import { createHederaClient } from './client.js';

export type ProcurementAgentOptions = {
  invoiceId: string;
  dryRun?: boolean;
  hcsTopicId?: string;
};

export type ProcurementAgentResult = {
  invoiceId: string;
  approved: boolean;
  nextAction: 'blocked' | 'ready_for_human_signature' | 'audit_submitted';
  hederaMode: AgentMode;
  enabledTools: string[];
  decision: unknown;
  hcsAudit?: unknown;
};

export function buildEnterprisePlugins(): Plugin[] {
  return [erpValidationPlugin, coreAccountQueryPlugin, coreConsensusPlugin];
}

export async function runProcurementAgent(
  options: ProcurementAgentOptions,
): Promise<ProcurementAgentResult> {
  const client = createHederaClient();
  try {
    const context = { mode: AgentMode.RETURN_BYTES };
    const plugins = buildEnterprisePlugins();
    const tools = new ToolDiscovery(plugins).getAllTools(context, { plugins, context });
    const api = new HederaAgentAPI(client, context, tools);

    const decision = JSON.parse(await api.run(ERP_VALIDATE_INVOICE_TOOL, { invoiceId: options.invoiceId }));
    const enabledTools = tools.map(tool => tool.method).sort();

    if (!decision.approved) {
      return {
        invoiceId: options.invoiceId,
        approved: false,
        nextAction: 'blocked',
        hederaMode: context.mode,
        enabledTools,
        decision,
      };
    }

    if (options.dryRun || !options.hcsTopicId) {
      return {
        invoiceId: options.invoiceId,
        approved: true,
        nextAction: 'ready_for_human_signature',
        hederaMode: context.mode,
        enabledTools,
        decision: {
          ...decision,
          proposedHederaMemo: createAuditMemo(options.invoiceId),
          note: 'Dry run: no Hedera transaction submitted. In live testnet mode, submit this audit memo to HCS after human approval.',
        },
      };
    }

    const hcsAudit = JSON.parse(
      await api.run('submit_topic_message_tool', {
        topicId: options.hcsTopicId,
        message: JSON.stringify({
          type: 'invoice_approval',
          invoice: findInvoice(options.invoiceId),
          decision,
          humanApprovalRequired: true,
          createdAt: new Date().toISOString(),
        }),
        transactionMemo: createAuditMemo(options.invoiceId),
      }),
    );

    return {
      invoiceId: options.invoiceId,
      approved: true,
      nextAction: 'audit_submitted',
      hederaMode: context.mode,
      enabledTools,
      decision,
      hcsAudit,
    };
  } finally {
    client.close();
  }
}

function createAuditMemo(invoiceId: string): string {
  return `BountyOps ERP approval audit ${invoiceId}`;
}
