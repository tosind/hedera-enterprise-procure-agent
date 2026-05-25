import { ToolDiscovery } from '@hashgraph/hedera-agent-kit';
import { buildEnterprisePlugins } from './agent/procureAgent.js';

const plugins = buildEnterprisePlugins();
const tools = new ToolDiscovery(plugins).getAllTools({});

console.log(
  JSON.stringify(
    {
      plugins: plugins.map(plugin => plugin.name),
      tools: tools.map(tool => ({
        method: tool.method,
        name: tool.name,
      })),
    },
    null,
    2,
  ),
);
