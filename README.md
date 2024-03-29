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

### Using as a CommonJS library

```ts
import MyKoinosWallet from '@roamin/my-koinos-wallet-sdk'
import { Contract, utils } from "koilib"

(async () => {
  const walletConnectorUrl = 'https://mykw.vercel.app/embed/wallet-connector'

  const mkw = new MyKoinosWallet(walletConnectorUrl)
  const connectionSuccess = await mkw.connect()
  
  if (!connectionSuccess) {
    // the MKW SDK wasn't able to connect to the MKW website, most likely because "cross-site cookies" are disabled
  } else {
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
  }

})();
```

### Using Vanilla JavaScript

```html
<html>
<script src="https://cdn.jsdelivr.net/gh/joticajulian/koilib@latest/dist/koinos.js"></script>
<script type="module">
  import MyKoinosWallet from 'https://cdn.jsdelivr.net/gh/roaminro/my-koinos-wallet-sdk@latest/dist/my-koinos-wallet-sdk.module.js'

  const walletConnectorUrl = 'https://mykw.vercel.app/embed/wallet-connector'

  const mkw = new MyKoinosWallet(walletConnectorUrl)
  const connectionSuccess = await mkw.connect()

  if (!connectionSuccess) {
    // the MKW SDK wasn't able to connect to the MKW website, most likely because "cross-site cookies" are disabled
  } else {
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
  }
</script>
</html>
```

## Send Koin tokens:

### Using as a CommonJS library

```ts
import MyKoinosWallet from '@roamin/my-koinos-wallet-sdk'
import { Contract, utils } from "koilib"

(async () => {
  const walletConnectorUrl = 'https://mykw.vercel.app/embed/wallet-connector'

  const mkw = new MyKoinosWallet(walletConnectorUrl)
  const connectionSuccess = await mkw.connect()

  if (!connectionSuccess) {
    // the MKW SDK wasn't able to connect to the MKW website, most likely because "cross-site cookies" are disabled
  } else {
    // request permissions to access some of the My Koinos Wallet APIs
    const acceptedPermissions = await mkw.requestPermissions({
      'accounts': ['getAccounts'],
      'signer': ['prepareTransaction', 'signAndSendTransaction'],
      'provider': ['wait']
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
  }
})();
```

### Using Vanilla JavaScript

```html
<html>
<script src="https://cdn.jsdelivr.net/gh/joticajulian/koilib@latest/dist/koinos.js"></script>
<script type="module">
  import MyKoinosWallet from 'https://cdn.jsdelivr.net/gh/roaminro/my-koinos-wallet-sdk@latest/dist/my-koinos-wallet-sdk.module.js'

  const walletConnectorUrl = 'https://mykw.vercel.app/embed/wallet-connector'

  const mkw = new MyKoinosWallet(walletConnectorUrl)
  const connectionSuccess = await mkw.connect()

  if (!connectionSuccess) {
    // the MKW SDK wasn't able to connect to the MKW website, most likely because "cross-site cookies" are disabled
  } else {
    // request permissions to access some of the My Koinos Wallet APIs
    const acceptedPermissions = await mkw.requestPermissions({
      'accounts': ['getAccounts'],
      'signer': ['prepareTransaction', 'signAndSendTransaction'],
      'provider': ['wait']
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
  }

</script>
</html>
```

## Use in ReactJS
It is recommended to initialize the SDK in a ReactJS Context Provider. Here's an example on how to initialize the SDK and then use it in a component.

```ts
// MKWProvider.tsx
import React, {
  useContext,
  useState,
  createContext,
  useEffect,
  useRef,
} from 'react'
import MyKoinosWallet from '@roamin/my-koinos-wallet-sdk'

type MKWContextType = {
  mkw?: MyKoinosWallet;
  isLoading: boolean;
};

export const MKWContext = createContext<MKWContextType>({
  isLoading: false,
})

export const useMKW = () => useContext(MKWContext)

export const MKWProvider = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  const [isLoading, setIsLoading] = useState(true)
  const mkwRef = useRef<MyKoinosWallet>()

  useEffect(() => {
    mkwRef.current = new MyKoinosWallet(
      'https://mykw.vercel.app/embed/wallet-connector'
    )

    const setup = async () => {
      const connectionSuccess = await mkwRef.current.connect()
      if (connectionSuccess) {
        setIsLoading(false)
      } else {
        // the MKW SDK wasn't able to connect to the MKW website, most likely because "cross-site cookies" are disabled
      }
    }

    setup()

    return () => {
      mkwRef.current.close()
    }
  }, [])

  return (
    <MKWContext.Provider
      value={{
        mkw: mkwRef.current,
        isLoading,
      }}
    >
      {children}
    </MKWContext.Provider>
  )
}
```
```ts
// _app.tsx
import type { AppProps } from 'next/app'
import { MKWProvider } from '../context/MKWProvider'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <MKWProvider>
      <Component {...pageProps} />
    </MKWProvider>
  )
}

export default MyApp
```
```ts
// MyComponent.tsx
import type { NextPage } from 'next'
import { useMKW } from './MKWProvider'

const MyComponent: NextPage = () => {
  const { mkw, isLoading } = useMKW()

  const onClick = async () => {
    if (!mkw || isLoading) return
    
    const acceptedPermissions = await mkw.requestPermissions({
      accounts: ['getAccounts'],
      provider: ['readContract'],
    })

    console.log(acceptedPermissions)
  }

  return (
    <div>
      <main>
        <p>HELLO MKW!</p>
        <button disabled={isLoading} onClick={onClick}>
          Request Permissions
        </button>
      </main>
    </div>
  )
}

export default MyComponent
```
