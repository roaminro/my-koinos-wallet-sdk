# My Koinos Wallet SDK

Library to interact with the My Koinos Wallet application.

## Installation:

```sh
# with npm
npm install -g @roamin/my-koinos-wallet-sdk

# with yarn
yarn global add @roamin/my-koinos-wallet-sdk
```

### Using a frontend library (React, Vue, etc...)

```ts
import MyKoinosWallet from '@roamin/my-koinos-wallet-sdk'
import { Contract, utils } from "koilib"

(async () => {
  const walletConnectorUrl = 'https://my-koinos-wallet.vercel.app/embed/wallet-connector'

  const mkw = new MyKoinosWallet(walletConnectorUrl)
  await mkw.connect()

  const accounts = await mkw.getAccounts();

  const provider = mkw.getProvider()

// get Koin balance on Mainnet
  const koinContract = new Contract({
    id: "15DJN4a8SgrbGhhGksSBASiSYjGnMU8dGL",
    abi: utils.tokenAbi,
    provider,
  });

  const koin = koinContract.functions;

  // Get balance
  const { result: { value } } = await koin.balanceOf({
    owner: accounts[0].address,
  });

  console.log(`Balance of account ${accounts[0].address} is ${utils.formatUnits(value, 8)} Koin`);
})();
```

### Using Vanilla JavaScript

```html
<html>
<script src="https://cdn.jsdelivr.net/gh/joticajulian/koilib@latest/dist/koinos.js"></script>
<script type="module">
  import MyKoinosWallet from 'https://cdn.jsdelivr.net/gh/roaminro/my-koinos-wallet-sdk@latest/dist/my-koinos-wallet-sdk.module.js'

  const walletConnectorUrl = 'https://my-koinos-wallet.vercel.app/embed/wallet-connector'

  const mkw = new MyKoinosWallet(walletConnectorUrl)
  await mkw.connect()

  const accounts = await mkw.getAccounts();

  const provider = mkw.getProvider()

// get Koin balance on Mainnet
  const koinContract = new Contract({
    id: "15DJN4a8SgrbGhhGksSBASiSYjGnMU8dGL",
    abi: utils.tokenAbi,
    provider,
  });

  const koin = koinContract.functions;

  // Get balance
  const { result: { value } } = await koin.balanceOf({
    owner: accounts[0].address,
  });

  console.log(`Balance of account ${accounts[0].address} is ${utils.formatUnits(value, 8)} Koin`);
</script>
</html>
```