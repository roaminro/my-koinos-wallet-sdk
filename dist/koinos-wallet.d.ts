interface Account {
    address: string;
    signers?: {
        address: string;
    }[];
}
export default class KoinosWallet {
    constructor(walletUrl: string);
    close(): void;
    connect(): Promise<boolean>;
    getAccounts(timeout?: number): Promise<Account[]>;
    getSigner(signerAddress: string, timeout?: number): import("koilib").SignerInterface;
    getProvider(timeout?: number): {
        call<T = unknown>(method: string, params: unknown): Promise<T>;
        getNonce(account: string): Promise<number>;
        getAccountRc(account: string): Promise<string>;
        getTransactionsById(transactionIds: string[]): Promise<{
            transactions: {
                transaction: import("koilib/lib/interface").TransactionJson[];
                containing_blocks: string[];
            }[];
        }>;
        getBlocksById(blockIds: string[]): Promise<{
            block_items: {
                block_id: string;
                block_height: string;
                block: import("koilib/lib/interface").BlockJson;
            }[];
        }>;
        getHeadInfo(): Promise<{
            head_topology: {
                id: string;
                height: string;
                previous: string;
            };
            last_irreversible_block: string;
        }>;
        getChainId(): Promise<string>;
        getBlocks(height: number, numBlocks?: number, idRef?: string): Promise<{
            block_id: string;
            block_height: string;
            block: import("koilib/lib/interface").BlockJson;
            block_receipt: {
                [x: string]: unknown;
            };
        }[]>;
        getBlock(height: number): Promise<{
            block_id: string;
            block_height: string;
            block: import("koilib/lib/interface").BlockJson;
            block_receipt: {
                [x: string]: unknown;
            };
        }>;
        wait(transactionId: string, type?: "byBlock" | "byTransactionId", waitTimeout?: number): Promise<{
            blockId: string;
            blockNumber?: number;
        }>;
        sendTransaction(transaction: import("koilib/lib/interface").TransactionJson, broadcast?: boolean): Promise<import("interfaces").TransactionResult>;
        readContract(operation: import("koilib/lib/interface").CallContractOperationJson): Promise<{
            result: string;
            logs: string;
        }>;
        submitBlock(block: import("koilib/lib/interface").BlockJson): Promise<Record<string, never>>;
    };
}

//# sourceMappingURL=koinos-wallet.d.ts.map
