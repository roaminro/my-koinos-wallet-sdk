import { SendTransactionOptions, TransactionJson, TransactionJsonWait, TransactionReceipt } from 'koilib/lib/interface'

export interface OutgoingMessage {
  scope: string
  command: string
  arguments?: string
}

export interface IncomingMessage {
  result: unknown
}

export interface SignSendTransactionArguments {
  requester: string
  signerAddress: string
  send: boolean
  transaction: TransactionJson
  options: SendTransactionOptions
}

export interface SignSendTransactionResult {
  receipt?: TransactionReceipt
  transaction: TransactionJson
}

export interface Account {
  address: string
  signers?: {
    address: string,
  }[]
}

export interface TransactionResult {
  receipt: TransactionReceipt
  transaction: TransactionJsonWait
}

export type Scope = string
export type Command = string
export type Permissions = Record<Scope, Command[]>