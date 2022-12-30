interface Account {
    address: string;
    signers?: {
        address: string;
    }[];
}
type Scope = string;
type Command = string;
type Permissions = Record<Scope, Command[]>;
export default class MyKoinosWallet {
    constructor(walletUrl: string);
    close(): void;
    connect(): Promise<boolean>;
    getAccounts(timeout?: number): Promise<Account[]>;
    requestPermissions(permissions: Permissions, timeout?: number): Promise<Permissions>;
    getSigner(signerAddress: string, timeout?: number): import("koilib").Signer;
    getProvider(timeout?: number): import("koilib").Provider;
}

//# sourceMappingURL=my-koinos-wallet-sdk.d.ts.map
