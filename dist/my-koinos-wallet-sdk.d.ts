interface Account {
    address: string;
    signers?: {
        address: string;
    }[];
}
export default class MyKoinosWallet {
    constructor(walletUrl: string);
    close(): void;
    connect(): Promise<boolean>;
    getAccounts(timeout?: number): Promise<Account[]>;
    getSigner(signerAddress: string, timeout?: number): import("koilib").Signer;
    getProvider(timeout?: number): import("koilib").Provider;
}

//# sourceMappingURL=my-koinos-wallet-sdk.d.ts.map
