# My Koinos Wallet SDK

Library to interact with the My Koinos Wallet application.

## Installation:

```sh
# with npm
npm install @roamin/my-koinos-wallet-sdk

# with yarn
yarn add @roamin/my-koinos-wallet-sdk
```
## Read a Koin balance:

### Using as a CommonJS library (React, Vue, etc...)

```ts
import MyKoinosWallet from '@roamin/my-koinos-wallet-sdk'
import { Contract, utils } from "koilib"

(async () => {
  const walletConnectorUrl = 'https://my-koinos-wallet.vercel.app/embed/wallet-connector'

  const mkw = new MyKoinosWallet(walletConnectorUrl)
  await mkw.connect()

  // request permissions to access some of the My Koinos Wallet APIs
  const acceptedPermissions = await mkw.requestPermissions({
    'accounts': ['getAccounts'],
    'provider': ['readContract']
  })

  const accounts = await mkw.getAccounts()

  const provider = mkw.getProvider()

  // get Koin balance on Mainnet
  const koin = new Contract({
    // Mainnet
    // id: "15DJN4a8SgrbGhhGksSBASiSYjGnMU8dGL",
    // Harbinger Testnet
    id: "19JntSm8pSNETT9aHTwAUHC5RMoaSmgZPJ",
    abi: utils.tokenAbi,
    provider,
  })

  // Get balance
  const { result: { value } } = await koin.functions.balanceOf({
    owner: accounts[0].address,
  })

  console.log(`Balance of account ${accounts[0].address} is ${utils.formatUnits(value, 8)} Koin`)
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

  // request permissions to access some of the My Koinos Wallet APIs
  const acceptedPermissions = await mkw.requestPermissions({
    'accounts': ['getAccounts'],
    'provider': ['readContract']
  })

  const accounts = await mkw.getAccounts()

  const provider = mkw.getProvider()

// get Koin balance
  const koin = new Contract({
    // Mainnet
    // id: "15DJN4a8SgrbGhhGksSBASiSYjGnMU8dGL",
    // Harbinger Testnet
    id: "19JntSm8pSNETT9aHTwAUHC5RMoaSmgZPJ",
    abi: utils.tokenAbi,
    provider,
  })

  // Get balance
  const { result: { value } } = await koin.functions.balanceOf({
    owner: accounts[0].address,
  })

  console.log(`Balance of account ${accounts[0].address} is ${utils.formatUnits(value, 8)} Koin`)
</script>
</html>
```

## Send Koin tokens:

### Using as a CommonJS library (React, Vue, etc...)

```ts
import MyKoinosWallet from '@roamin/my-koinos-wallet-sdk'
import { Contract, utils } from "koilib"

(async () => {
  const walletConnectorUrl = 'https://my-koinos-wallet.vercel.app/embed/wallet-connector'

  const mkw = new MyKoinosWallet(walletConnectorUrl)
  await mkw.connect()

  // request permissions to access some of the My Koinos Wallet APIs
  const acceptedPermissions = await mkw.requestPermissions({
    'accounts': ['getAccounts'],
    'signer': ['prepareTransaction', 'signAndSendTransaction'],
  })

  const accounts = await mkw.getAccounts()
  const signer = mkw.getSigner(accounts[0].address)

  // get Koin balance
  const koin = new Contract({
    // Mainnet
    // id: "15DJN4a8SgrbGhhGksSBASiSYjGnMU8dGL",
    // Harbinger Testnet
    id: "19JntSm8pSNETT9aHTwAUHC5RMoaSmgZPJ",
    abi: utils.tokenAbi,
    signer,
  });

  // Transfer 0.00000001 Koin
  const { result } = await koin.functions.transfer({
    from: signer.getAddress(),
    to: 'TO_ADDR',
    value: utils.parseUnits('0.00000001', 8)
  });

  console.log('transfer result:', result);

  await result.transaction.wait()
  console.log('transfer successful');
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

  // request permissions to access some of the My Koinos Wallet APIs
  const acceptedPermissions = await mkw.requestPermissions({
    'accounts': ['getAccounts'],
    'signer': ['prepareTransaction', 'signAndSendTransaction'],
  })

  const accounts = await mkw.getAccounts()
  const signer = mkw.getSigner(accounts[0].address)

  // get Koin balance
  const koin = new Contract({
    // Mainnet
    // id: "15DJN4a8SgrbGhhGksSBASiSYjGnMU8dGL",
    // Harbinger Testnet
    id: "19JntSm8pSNETT9aHTwAUHC5RMoaSmgZPJ",
    abi: utils.tokenAbi,
    signer,
  });

  // Transfer 0.00000001 Koin
  const { result } = await koin.functions.transfer({
    from: signer.getAddress(),
    to: 'TO_ADDR',
    value: utils.parseUnits('0.00000001', 8)
  });

  console.log('transfer result:', result);

  await result.transaction.wait()
  console.log('transfer successful');
</script>
</html>
```