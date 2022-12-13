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

  constructor(walletUrl: string) {
    this.iframe = document.createElement('iframe')
    this.iframe.id = KOINOS_WALLET_IFRAME_CLASS
    this.iframe.hidden = true
    this.iframe.onload = () => this.onIframeLoad()
    this.iframe.src = walletUrl
    document.body.appendChild(this.iframe)

    KoinosWallet.checkIfAlreadyInitialized()
  }

  close() {
    if (this.messenger) {
      this.messenger.removeListener()
    }
  }

  async onIframeLoad() {
    this.messenger = new Messenger<IncomingMessage, OutgoingMessage>(this.iframe.contentWindow as Window, KOINOS_WALLET_MESSENGER_ID)

    await this.messenger.ping(WALLET_CONNECTOR_MESSENGER_ID)
    console.log('connected to koinos-wallet-connector')
  }

  private static checkIfAlreadyInitialized() {
    if (document.getElementsByClassName(KOINOS_WALLET_IFRAME_CLASS).length) {
      console.warn(
        'An instance of Koinos-Wallet was already initialized. This is probably a mistake. Make sure that you use the same Koinos-Wallet instance throughout your app.',
      )
    }
  }

  async getAccounts(timeout = 60000) {
    const { result } = await this.messenger.sendRequest(WALLET_CONNECTOR_MESSENGER_ID, {
      scope: 'accounts',
      command: 'getAccounts'
    }, timeout)

    return result as Account[]
  }

  getSigner(signerAddress: string, timeout: number = 60000) {
    return generateSigner(signerAddress, this.messenger, WALLET_CONNECTOR_MESSENGER_ID, timeout)
  }

  getProvider(timeout: number = 60000) {
    return generateProvider(this.messenger, WALLET_CONNECTOR_MESSENGER_ID, timeout)
  }
}