import { IncomingMessage, OutgoingMessage, Account } from './interfaces'
import generateProvider from './provider'
import generateSigner from './signer'
import { Messenger } from './util/Messenger'
import { onWindowLoad } from './util/onWindowLoad'

const MY_KOINOS_WALLET_IFRAME_CLASS = 'my-koinos-wallet-iframe'
const MY_KOINOS_WALLET_CONNECTOR_MESSENGER_ID = 'my-koinos-wallet-connector-child'
const MY_KOINOS_WALLET_MESSENGER_ID = 'my-koinos-wallet-connector-parent'

onWindowLoad()
  .then(() => {
    if (document.getElementsByClassName(MY_KOINOS_WALLET_IFRAME_CLASS).length) {
      console.warn('My Koinos Wallet script was already loaded. This might cause unexpected behavior. If loading with a <script> tag, please make sure that you only load it once.')
    }
  })
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  .catch(() => { }) // Prevents unhandledPromiseRejectionWarning, which happens when using React SSR;

export default class MyKoinosWallet {
  private messenger: Messenger<IncomingMessage, OutgoingMessage>
  private iframe: HTMLIFrameElement

  constructor(walletUrl: string) {
    this.iframe = document.createElement('iframe')
    this.iframe.className = MY_KOINOS_WALLET_IFRAME_CLASS
    this.iframe.hidden = true
    this.iframe.src = walletUrl
    document.body.appendChild(this.iframe)

    MyKoinosWallet.checkIfAlreadyInitialized()
  }

  close() {
    if (this.messenger) {
      this.messenger.removeListener()
    }

    this.iframe.remove()
  }

  async connect() {
    if (!this.iframe.contentWindow) {
      throw new Error('Koinos-Wallet is not loaded yet')
    }

    this.messenger = new Messenger<IncomingMessage, OutgoingMessage>(this.iframe.contentWindow as Window, MY_KOINOS_WALLET_MESSENGER_ID)

    try {
      await this.messenger.ping(MY_KOINOS_WALLET_CONNECTOR_MESSENGER_ID)
      
      return true
    } catch (error) {
      console.log(error)
      return false
    }
  }

  private static checkIfAlreadyInitialized() {
    if (document.getElementsByClassName(MY_KOINOS_WALLET_IFRAME_CLASS).length) {
      console.warn(
        'An instance of Koinos-Wallet was already initialized. This is probably a mistake. Make sure that you use the same Koinos-Wallet instance throughout your app.',
      )
    }
  }

  async getAccounts(timeout = 60000) {
    if (!this.iframe.contentWindow) {
      throw new Error('Koinos-Wallet is not loaded yet')
    }
  
    const { result } = await this.messenger.sendRequest(MY_KOINOS_WALLET_CONNECTOR_MESSENGER_ID, {
      scope: 'accounts',
      command: 'getAccounts'
    }, timeout)

    return result as Account[]
  }

  getSigner(signerAddress: string, timeout: number = 60000) {
    if (!this.iframe.contentWindow) {
      throw new Error('Koinos-Wallet is not loaded yet')
    }

    return generateSigner(signerAddress, this.messenger, MY_KOINOS_WALLET_CONNECTOR_MESSENGER_ID, timeout)
  }

  getProvider(timeout: number = 60000) {
    if (!this.iframe.contentWindow) {
      throw new Error('Koinos-Wallet is not loaded yet')
    }

    return generateProvider(this.messenger, MY_KOINOS_WALLET_CONNECTOR_MESSENGER_ID, timeout)
  }
}