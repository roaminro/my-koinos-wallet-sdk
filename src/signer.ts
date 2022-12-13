import { SignerInterface } from 'koilib'
import {
  BlockJson,
  SendTransactionOptions,
  TransactionJson,
  TransactionJsonWait,
  TransactionReceipt,
} from 'koilib/lib/interface'
import { IncomingMessage, OutgoingMessage } from './interfaces'
import { Messenger } from './util/Messenger'

export default function generateSigner(
  signerAddress: string,
  messenger: Messenger<IncomingMessage, OutgoingMessage>,
  walletConnectorMessengerId: string,
  timeout: number
): SignerInterface {
  return {
    getAddress: () => signerAddress,

    getPrivateKey: (): string => {
      throw new Error('getPrivateKey is not available')
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

      return result as TransactionJson
    },

    sendTransaction: async (
      transaction: TransactionJson,
      options?: SendTransactionOptions
    ): Promise<{
      receipt: TransactionReceipt;
      transaction: TransactionJsonWait;
    }> => {
      const { result } = await messenger.sendRequest(walletConnectorMessengerId, {
        scope: 'signer',
        command: 'signAndSendTransaction',
        arguments: JSON.stringify({
          signerAddress,
          transaction,
          options
        })
      }, timeout)

      return result as {
        receipt: TransactionReceipt;
        transaction: TransactionJsonWait;
      }
      // response.transaction.wait = async (
      //   type: 'byTransactionId' | 'byBlock' = 'byBlock',
      //   timeout = 60000
      // ) => {
      //   return messenger.sendDomMessage('background', 'provider:wait', {
      //     txId: response.transaction.id,
      //     type,
      //     timeout,
      //   })
      // }
    },

    prepareBlock: (): Promise<BlockJson> => {
      throw new Error('prepareBlock is not available')
    },

    signBlock: (): Promise<BlockJson> => {
      throw new Error('signBlock is not available')
    },
  }
}
