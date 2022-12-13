import { IncomingMessage, OutgoingMessage, Account } from './interfaces'
import generateProvider from './provider'
import generateSigner from './signer'
import { Messenger } from './util/Messenger'
import { onWindowLoad } from './util/onWindowLoad'

const KOINOS_WALLET_IFRAME_CLASS = 'koinos-wallet-iframe'
const WALLET_CONNECTOR_MESSENGER_ID = 'wallet-connector-child'
const KOINOS_WALLET_MESSENGER_ID = 'wallet-connector-parent'

onWindowLoad()
  .then(() => {
    if (document.getElementsByClassName(KOINOS_WALLET_IFRAME_CLASS).length) {
      console.warn('Koinos-Wallet script was already loaded. This might cause unexpected behavior. If loading with a <script> tag, please make sure that you only load it once.')
    }
  })
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  .catch(() => { }) // Prevents unhandledPromiseRejectionWarning, which happens when using React SSR;

export default class KoinosWallet {
  private messenger: Messenger<IncomingMessage, OutgoingMessage>
  private iframe: HTMLIFrameElement
  private iframeLoaded: boolean = false

  constructor(walletUrl: string) {
    this.iframe = document.createElement('iframe')
    this.iframe.onload = () => this.iframeLoaded = true
    this.iframe.className = KOINOS_WALLET_IFRAME_CLASS
    this.iframe.hidden = true
    this.iframe.src = walletUrl
    console.log('this.iframe.contentWindow', this.iframe.contentWindow)
    document.body.appendChild(this.iframe)

    KoinosWallet.checkIfAlreadyInitialized()
  }

  close() {
    if (this.messenger) {
      this.messenger.removeListener()
    }

    this.iframe.remove()
  }

  async connect() {
    console.log('this.iframe.contentWindow2', this.iframe.contentWindow)

    if (!this.iframeLoaded) {
      throw new Error('Koinos-Wallet is not loaded yet')
    }

    this.messenger = new Messenger<IncomingMessage, OutgoingMessage>(this.iframe.contentWindow as Window, KOINOS_WALLET_MESSENGER_ID)

    try {
      await this.messenger.ping(WALLET_CONNECTOR_MESSENGER_ID)
      
      return true
    } catch (error) {
      console.log(error)
      return false
    }
  }

  private static checkIfAlreadyInitialized() {
    if (document.getElementsByClassName(KOINOS_WALLET_IFRAME_CLASS).length) {
      console.warn(
        'An instance of Koinos-Wallet was already initialized. This is probably a mistake. Make sure that you use the same Koinos-Wallet instance throughout your app.',
      )
    }
  }

  async getAccounts(timeout = 60000) {
    if (!this.iframeLoaded) {
      throw new Error('Koinos-Wallet is not loaded yet')
    }
  
    const { result } = await this.messenger.sendRequest(WALLET_CONNECTOR_MESSENGER_ID, {
      scope: 'accounts',
      command: 'getAccounts'
    }, timeout)

    return result as Account[]
  }

  getSigner(signerAddress: string, timeout: number = 60000) {
    if (!this.iframeLoaded) {
      throw new Error('Koinos-Wallet is not loaded yet')
    }

    return generateSigner(signerAddress, this.messenger, WALLET_CONNECTOR_MESSENGER_ID, timeout)
  }

  getProvider(timeout: number = 60000) {
    if (!this.iframeLoaded) {
      throw new Error('Koinos-Wallet is not loaded yet')
    }

    return generateProvider(this.messenger, WALLET_CONNECTOR_MESSENGER_ID, timeout)
  }
}