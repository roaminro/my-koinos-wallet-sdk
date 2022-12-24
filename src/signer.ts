import { Signer } from 'koilib'
import {
  BlockJson,
  SendTransactionOptions,
  TransactionJson,
} from 'koilib/lib/interface'
import { IncomingMessage, OutgoingMessage, SignSendTransactionResult, TransactionResult } from './interfaces'
import generateProvider from './provider'
import { Messenger } from './util/Messenger'

export default function generateSigner(
  signerAddress: string,
  messenger: Messenger<IncomingMessage, OutgoingMessage>,
  walletConnectorMessengerId: string,
  timeout: number
): Signer {
  return {    
    provider: generateProvider(messenger, walletConnectorMessengerId, timeout),

    getAddress: () => signerAddress,

    getPrivateKey: (): string => {
      throw new Error('not implemented')
    },

    signHash: async (hash: Uint8Array): Promise<Uint8Array> => {
      const { result } = await messenger.sendRequest(walletConnectorMessengerId, {
        scope: 'signer',
        command: 'signHash',
        arguments: JSON.stringify({
          signerAddress,
          hash,
        })
      }, timeout)

      return result as Uint8Array
    },

    signMessage: async (message: string | Uint8Array): Promise<Uint8Array> => {
      const { result } = await messenger.sendRequest(walletConnectorMessengerId, {
        scope: 'signer',
        command: 'signMessage',
        arguments: JSON.stringify({
          signerAddress,
          message,
        })
      }, timeout)

      return result as Uint8Array
    },

    prepareTransaction: async (
      transaction: TransactionJson
    ): Promise<TransactionJson> => {
      const { result } = await messenger.sendRequest(walletConnectorMessengerId, {
        scope: 'signer',
        command: 'prepareTransaction',
        arguments: JSON.stringify({
          signerAddress,
          transaction,
        })
      }, timeout)

      return result as TransactionJson
    },

    signTransaction: async (
      transaction: TransactionJson,
      abis?: SendTransactionOptions['abis']
    ): Promise<TransactionJson> => {
      const { result } = await messenger.sendRequest(walletConnectorMessengerId, {
        scope: 'signer',
        command: 'signTransaction',
        arguments: JSON.stringify({
          signerAddress,
          transaction,
          options: {
            abis
          }
        })
      }, timeout)

      return (result as SignSendTransactionResult).transaction
    },

    sendTransaction: async (
      transaction: TransactionJson,
      options?: SendTransactionOptions
    ): Promise<TransactionResult> => {
      const { result } = await messenger.sendRequest(walletConnectorMessengerId, {
        scope: 'signer',
        command: 'signAndSendTransaction',
        arguments: JSON.stringify({
          signerAddress,
          transaction,
          options
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
            transactionId: (result as TransactionResult).transaction.id,
            type,
            timeout: waitTimeout
          })
        }, timeout)


        return waitResult as { blockId: string; blockNumber?: number }
      }

      return result as TransactionResult
    },

    prepareBlock: (): Promise<BlockJson> => {
      throw new Error('not implemented')
    },

    signBlock: (): Promise<BlockJson> => {
      throw new Error('not implemented')
    },
  } as unknown as Signer
}
