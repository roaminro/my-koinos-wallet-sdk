import { Provider } from 'koilib'
import {
  BlockJson,
  CallContractOperationJson,
  TransactionJson
} from 'koilib/lib/interface'
import { IncomingMessage, OutgoingMessage, TransactionResult } from './interfaces'
import { Messenger } from './util/Messenger'

export default function generateProvider(
  messenger: Messenger<IncomingMessage, OutgoingMessage>,
  walletConnectorMessengerId: string,
  timeout: number
): Provider {

  return {
    async call<T = unknown>(method: string, params: unknown): Promise<T> {
      const { result } = await messenger.sendRequest(walletConnectorMessengerId, {
        scope: 'provider',
        command: 'call',
        arguments: JSON.stringify({
          method,
          params
        })
      }, timeout)


      return result as T
    },

    async getNonce(account: string): Promise<number> {
      const { result } = await messenger.sendRequest(walletConnectorMessengerId, {
        scope: 'provider',
        command: 'getNonce',
        arguments: JSON.stringify({
          account
        })
      }, timeout)


      return result as number
    },

    async getNextNonce(account: string): Promise<string> {
      const { result } = await messenger.sendRequest(walletConnectorMessengerId, {
        scope: 'provider',
        command: 'getNextNonce',
        arguments: JSON.stringify({
          account
        })
      }, timeout)


      return result as string
    },

    async getAccountRc(account: string): Promise<string> {
      const { result } = await messenger.sendRequest(walletConnectorMessengerId, {
        scope: 'provider',
        command: 'getAccountRc',
        arguments: JSON.stringify({
          account
        })
      }, timeout)


      return result as string
    },

    async getTransactionsById(transactionIds: string[]): Promise<{
      transactions: {
        transaction: TransactionJson;
        containing_blocks: string[];
      }[];
    }> {
      const { result } = await messenger.sendRequest(walletConnectorMessengerId, {
        scope: 'provider',
        command: 'getTransactionsById',
        arguments: JSON.stringify({
          transactionIds
        })
      }, timeout)


      return result as {
        transactions: {
          transaction: TransactionJson;
          containing_blocks: string[];
        }[];
      }
    },

    async getBlocksById(blockIds: string[]): Promise<{
      block_items: {
        block_id: string;
        block_height: string;
        block: BlockJson;
      }[];
    }> {
      const { result } = await messenger.sendRequest(walletConnectorMessengerId, {
        scope: 'provider',
        command: 'getBlocksById',
        arguments: JSON.stringify({
          blockIds
        })
      }, timeout)


      return result as {
        block_items: {
          block_id: string;
          block_height: string;
          block: BlockJson;
        }[];
      }
    },

    async getHeadInfo(): Promise<{
      head_block_time: string;
      head_topology: {
        id: string;
        height: string;
        previous: string;
      };
      head_state_merkle_root: string;
      last_irreversible_block: string;
    }> {
      const { result } = await messenger.sendRequest(walletConnectorMessengerId, {
        scope: 'provider',
        command: 'getHeadInfo',
        arguments: JSON.stringify({

        })
      }, timeout)

      return result as {
        head_block_time: string;
        head_topology: {
          id: string;
          height: string;
          previous: string;
        };
        head_state_merkle_root: string;
        last_irreversible_block: string;
      }
    },

    async getChainId(): Promise<string> {
      const { result } = await messenger.sendRequest(walletConnectorMessengerId, {
        scope: 'provider',
        command: 'getChainId',
        arguments: JSON.stringify({

        })
      }, timeout)

      return result as string
    },

    async getBlocks(
      height: number,
      numBlocks = 1,
      idRef?: string
    ): Promise<
      {
        block_id: string;
        block_height: string;
        block: BlockJson;
        block_receipt: {
          [x: string]: unknown;
        };
      }[]
    > {
      const { result } = await messenger.sendRequest(walletConnectorMessengerId, {
        scope: 'provider',
        command: 'getBlocks',
        arguments: JSON.stringify({
          height,
          numBlocks,
          idRef
        })
      }, timeout)

      return result as {
        block_id: string;
        block_height: string;
        block: BlockJson;
        block_receipt: {
          [x: string]: unknown;
        };
      }[]
    },

    async getBlock(height: number): Promise<{
      block_id: string;
      block_height: string;
      block: BlockJson;
      block_receipt: {
        [x: string]: unknown;
      };
    }> {
      const { result } = await messenger.sendRequest(walletConnectorMessengerId, {
        scope: 'provider',
        command: 'getBlock',
        arguments: JSON.stringify({
          height
        })
      }, timeout)

      return result as {
        block_id: string;
        block_height: string;
        block: BlockJson;
        block_receipt: {
          [x: string]: unknown;
        };
      }
    },

    async wait(
      transactionId: string,
      type: 'byTransactionId' | 'byBlock' = 'byBlock',
      waitTimeout = 30000
    ): Promise<{ blockId: string; blockNumber?: number }> {
      const { result } = await messenger.sendRequest(walletConnectorMessengerId, {
        scope: 'provider',
        command: 'wait',
        arguments: JSON.stringify({
          transactionId,
          type,
          timeout: waitTimeout
        })
      }, timeout)


      return result as { blockId: string; blockNumber?: number }
    },

    async sendTransaction(
      transaction: TransactionJson,
      broadcast = true
    ): Promise<TransactionResult> {
      const { result } = await messenger.sendRequest(walletConnectorMessengerId, {
        scope: 'provider',
        command: 'sendTransaction',
        arguments: JSON.stringify({
          transaction,
          broadcast
        })
      }, timeout);

      (result as TransactionResult).transaction.wait = async (
        type: 'byTransactionId' | 'byBlock' = 'byBlock',
        waitTimeout = 60000
      ) => {
        const { result: waitResult } = await messenger.sendRequest(walletConnectorMessengerId, {
          scope: 'provider',
          command: 'wait',
          arguments: JSON.stringify({
            transactionId: transaction.id,
            type,
            timeout: waitTimeout
          })
        }, timeout)


        return waitResult as { blockId: string; blockNumber?: number }
      }

      return result as TransactionResult
    },

    async readContract(operation: CallContractOperationJson): Promise<{
      result: string;
      logs: string;
    }> {
      const { result } = await messenger.sendRequest(walletConnectorMessengerId, {
        scope: 'provider',
        command: 'readContract',
        arguments: JSON.stringify({
          operation
        })
      }, timeout)

      return result as {
        result: string;
        logs: string;
      }
    },

    async submitBlock(block: BlockJson): Promise<Record<string, never>> {
      const { result } = await messenger.sendRequest(walletConnectorMessengerId, {
        scope: 'provider',
        command: 'submitBlock',
        arguments: JSON.stringify({
          block
        })
      }, timeout)

      return result as Record<string, never>
    },
  } as Provider
}