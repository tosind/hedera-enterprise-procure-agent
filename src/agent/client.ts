import { AccountId, Client, PrivateKey } from '@hiero-ledger/sdk';

export function createHederaClient(env = process.env): Client {
  const network = env.HEDERA_NETWORK ?? 'testnet';
  if (network !== 'testnet') {
    throw new Error('This bounty demo intentionally supports HEDERA_NETWORK=testnet only.');
  }

  const client = Client.forTestnet();
  if (env.ACCOUNT_ID && env.PRIVATE_KEY) {
    client.setOperator(AccountId.fromString(env.ACCOUNT_ID), parsePrivateKey(env.PRIVATE_KEY));
  }

  return client;
}

function parsePrivateKey(value: string): PrivateKey {
  if (value.startsWith('0x')) {
    return PrivateKey.fromStringECDSA(value);
  }

  return PrivateKey.fromStringDer(value);
}
