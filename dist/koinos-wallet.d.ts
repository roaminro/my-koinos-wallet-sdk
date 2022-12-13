import { SendTransactionOptions, TransactionJson, TransactionReceipt } from "koilib/lib/interface";
interface SignSendTransactionArguments {
    requester: string;
    signerAddress: string;
    send: boolean;
    transaction: TransactionJson;
    options: SendTransactionOptions;
}
interface SignSendTransactionResult {
    receipt?: TransactionReceipt;
    transaction: TransactionJson;
}
interface Account {
    address: string;
    signers?: {
        address: string;
    }[];
}
export default class KoinosWallet {
    constructor(walletUrl: string);
    close(): void;
    onIframeLoad(): Promise<void>;
    getAccounts(timeout?: number): Promise<Account[]>;
    signTransaction(args: SignSendTransactionArguments, timeout?: number): Promise<SignSendTransactionResult>;
    signAndSendTransaction(args: SignSendTransactionArguments, timeout?: number): Promise<SignSendTransactionResult>;
}

//# sourceMappingURL=koinos-wallet.d.ts.map
