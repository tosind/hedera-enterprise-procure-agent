# Feedback Draft: Agent Kit v4 Plugin Docs Need a Minimal Custom Plugin Template

Target repository:
https://github.com/hashgraph/hedera-agent-kit-js/issues

## Title

Docs: add a minimal Agent Kit v4 custom plugin template with TypeScript types

## Body

While building a Week 2 Enterprise Agent + Plugin bounty submission, I used Agent Kit v4 with explicit plugin registration and a custom enterprise validation plugin.

The v4 docs explain that plugins are explicit and that the old plain-object tool pattern still works, but a minimal copy-paste TypeScript template would make enterprise plugin onboarding faster. The useful template would show:

- `Plugin` and `Tool` imports from `@hashgraph/hedera-agent-kit`
- a Zod parameter schema
- a simple `execute(client, context, params)` implementation
- registration next to `coreAccountQueryPlugin` or `coreConsensusPlugin`
- a short note on when to use `BaseTool` instead of the plain object pattern for hook/policy coverage

This would reduce friction for teams integrating enterprise systems such as ERP, CRM, KYC, procurement, or custody controls with Hedera Agent Kit.

## Local Reference

This bounty repo includes `src/plugins/erpValidationPlugin.ts` as a working example of a custom enterprise plugin.
