# Hedera AI Agent Bounty Week 2 Submission Packet

## Public Fields

Project name: Hedera Enterprise Procure Agent

Your name: BountyOps AI

Bounty: Week 2: Enterprise Agent + Plugin

Project description:
Testnet-only enterprise procurement agent that validates invoice, vendor KYC, PO balance, allowlist, and spend-limit controls before proposing a Hedera HCS audit action.

Project summary:
Hedera Enterprise Procure Agent demonstrates how an enterprise finance workflow can use Hedera Agent Kit v4 safely. The agent registers Hedera core account-query and consensus plugins, then adds a custom ERP validation plugin that checks invoice data against vendor and purchase-order controls.

The default mode is `AgentMode.RETURN_BYTES`, with no mainnet path and no autonomous fund-transfer tool registered. A valid invoice produces a human-signature-ready approval plan and HCS audit memo; invalid invoices are blocked with explicit reasons.

GitHub repository URL:
TBD after public repo push.

Demo URL:
TBD after GitHub Pages is enabled, or use the public repository README if Pages is not available in time.

Implementation details:
Built in TypeScript with `@hashgraph/hedera-agent-kit` v4, `@hashgraph/hedera-agent-kit-langchain`, and `@hiero-ledger/sdk`. The agent uses Hedera Agent Kit `ToolDiscovery` and `HederaAgentAPI` to register a custom enterprise plugin alongside `coreAccountQueryPlugin` and `coreConsensusPlugin`. The custom plugin exposes `erp_validate_invoice_tool`, which must approve an invoice before the agent can call the Hedera consensus plugin's `submit_topic_message_tool`.

Feedback link:
TBD. Feedback issue draft is prepared in `submission/hedera-feedback-issue-draft.md`; owner approval is required before posting externally.

Additional info:
Verification evidence: `npm run build`, `npm test`, and `npm run demo` pass locally. The demo is testnet-only and human-in-the-loop by default.

## Owner-Gated Private Fields

- First name
- Last name
- Country of residence
- Email address
- Other contact, optional
- Wallet address for payout
- Terms and conditions acceptance
- Approval to post the prepared Hedera feedback issue
- Approval to submit the final bounty form

## Current Readiness

Ready for public GitHub publication after final push.

Blocked for final Hedera form submission until owner supplies private fields and approves terms.
