import 'dotenv/config';
import { runProcurementAgent } from './agent/procureAgent.js';

function readArg(name: string): string | undefined {
  const index = process.argv.indexOf(name);
  return index === -1 ? undefined : process.argv[index + 1];
}

async function main() {
  const invoiceId = readArg('--invoice') ?? 'INV-1001';
  const dryRun = process.argv.includes('--dry-run');
  const hcsTopicId = readArg('--hcs-topic');
  const result = await runProcurementAgent({ invoiceId, dryRun, hcsTopicId });

  console.log(JSON.stringify(result, null, 2));
}

main().catch(error => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
