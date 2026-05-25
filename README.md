# Hedera Enterprise Procure Agent

Testnet-only enterprise procurement agent for Hedera AI Agent Bounty Week 2: Enterprise Agent + Plugin.

The agent validates an invoice against an ERP-style vendor master and purchase order dataset before it proposes any Hedera action. It uses Hedera Agent Kit v4 with explicit plugins, plus a custom ERP validation plugin that blocks non-KYC vendors, non-allowlisted vendors, PO mismatches, and invoices above the configured approval limit.

## Why It Fits Week 2

- Uses `@hashgraph/hedera-agent-kit` v4 and `@hashgraph/hedera-agent-kit-langchain` dependencies.
- Registers Hedera core plugins explicitly: account query and consensus tools.
- Adds a custom enterprise plugin: `bountyops-erp-validation-plugin`.
- Keeps payment-risk behavior safe by defaulting to `AgentMode.RETURN_BYTES`.
- Demonstrates a real enterprise pattern: invoice approval, vendor compliance, spend limits, and HCS audit memo preparation.

Sources checked on May 25, 2026:

- Hedera bounty page: https://ai-bounties.hedera.com/
- Hedera Agent Kit v4 release notes: https://hedera.com/blog/hedera-agent-kit-v4-policies-modular-packages-and-plugin-updates/
- Hedera Agent Kit plugin docs: https://docs.hedera.com/hedera/open-source-solutions/ai-studio-on-hedera/hedera-ai-agent-kit/plugins

## Quick Start

```bash
npm install
npm run build
npm test
npm run demo
```

Expected demo behavior:

- `INV-1001` passes enterprise controls and returns a human-signature-ready approval plan.
- `INV-1002` is blocked because the vendor fails controls.
- `INV-1003` is blocked because it exceeds the default autonomous approval limit.

Run specific fixtures:

```bash
npx tsx src/index.ts --invoice INV-1002 --dry-run
npx tsx src/index.ts --invoice INV-1003 --dry-run
```

Inspect registered plugins and tools:

```bash
npm run inspect:tools
```

## Testnet Configuration

Copy `.env.example` to `.env` and add a Hedera testnet account:

```env
HEDERA_NETWORK=testnet
ACCOUNT_ID=0.0.12345
PRIVATE_KEY=302e...
AGENT_MODE=return_bytes
MAX_APPROVAL_USD=750
ALLOWLISTED_VENDOR_IDS=vendor-acme,vendor-hashpack
```

This demo intentionally rejects any network other than `testnet`.

## Live HCS Audit Flow

The default `npm run demo` path is a dry run and does not submit a transaction. With owner-provided testnet credentials and a testnet HCS topic id, run:

```bash
npx tsx src/index.ts --invoice INV-1001 --hcs-topic 0.0.YOUR_TOPIC_ID
```

The agent validates the invoice first. Only if the enterprise plugin approves the invoice does it call `submit_topic_message_tool` from the Hedera consensus plugin. The Hedera Agent Kit context remains `returnBytes`, so the workflow is human-in-the-loop by design.

## Safety Controls

- Testnet-only client guard.
- No mainnet support.
- No autonomous fund transfer tool is registered.
- HCS audit submission only happens after ERP validation passes.
- Approval limit and vendor allowlist are configurable.
- Blocked decisions include specific reasons for the operator.

## Project Structure

```text
src/agent/client.ts              Hedera testnet client setup
src/agent/procureAgent.ts        Agent orchestration and Hedera tool registration
src/plugins/erpValidationPlugin.ts
src/policies/paymentPolicy.ts
src/fixtures/invoices.ts
test/
docs/index.html                  Lightweight demo page
submission/                      Bounty form packet and feedback draft
```

## Verification

Latest local verification:

```text
npm run build
npm test
npm run demo
```

Result: TypeScript build passed, 6 tests passed, and the dry-run demo returned a ready-for-human-signature approval plan for `INV-1001`.
