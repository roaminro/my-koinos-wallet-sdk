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
    getSigner(signerAddress: string, timeout?: number): import("koilib").SignerInterface;
}

//# sourceMappingURL=koinos-wallet.d.ts.map
