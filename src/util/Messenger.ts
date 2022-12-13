
export interface IMessage {
  from: string
  to?: string
  type?: string
  data?: string
  error?: string
}

export type SendDataFn<OutgoingDataType> = (data: OutgoingDataType) => void
export type SendErrorFn = (error: string) => void

export type OnRequestFnArgs<IncomingDataType, OutgoingDataType> = {
  sender: string,
  data: IncomingDataType,
  sendData: SendDataFn<OutgoingDataType>,
  sendError: SendErrorFn
}

export type OnMessageFnArgs<IncomingDataType> = {
  sender: string,
  data: IncomingDataType
}

export type OnMessageFnType<IncomingDataType> = (args: OnMessageFnArgs<IncomingDataType>) => Promise<void> | void
export type OnRequestFnType<IncomingDataType, OutgoingDataType> = (args: OnRequestFnArgs<IncomingDataType, OutgoingDataType>) => Promise<void> | void

const PING_REQUEST_TYPE = 'messenger::ping::request'
const PING_REQUEST_ACK_TYPE = 'messenger::ping::ack'

export class Messenger<IncomingDataType, OutgoingDataType> {
  private id: string
  private target: Window | ServiceWorker
  private isTargetWindow: boolean
  private targetOrigin: string
  private onMessageFn?: OnMessageFnType<IncomingDataType>
  private onRequestFn?: OnRequestFnType<IncomingDataType, OutgoingDataType>
  private onMessageListenerAdded: boolean

  constructor(target: Window | ServiceWorker, id: string, isTargetWindow = true, targetOrigin = '*') {
    this.id = id
    this.target = target
    this.isTargetWindow = isTargetWindow
    this.targetOrigin = targetOrigin
    this.onMessageListenerAdded = false
    this.addMessageListener()
  }

  private onMessageListener = async (event: MessageEvent<IMessage>) => {
    if (this.targetOrigin !== '*' && !this.targetOrigin.startsWith(event.origin)) return

    const { data, ports } = event

    if (data.type !== PING_REQUEST_TYPE && data.to !== this.id) return

    if (data && ports && ports[0]) {
      if (data.type === PING_REQUEST_TYPE) {
        ports[0].postMessage({ type: PING_REQUEST_ACK_TYPE })
      } else if (this.onRequestFn) {
        await this.onRequestFn({
          sender: event.origin,
          data: JSON.parse(data.data!),
          sendData: (data: OutgoingDataType) => {
            ports[0].postMessage({ data })
          },
          sendError: (error: string) => {
            ports[0].postMessage({ error })
          }
        })
      }

      ports[0].close()
    } else if (data) {
      if (this.onMessageFn) {
        this.onMessageFn({
          sender: event.origin,
          data: JSON.parse(data.data!)
        })
      }
    }
  }

  private addMessageListener = () => {
    if (!this.onMessageListenerAdded) {
      this.onMessageListenerAdded = true
      self.addEventListener('message', this.onMessageListener)
    }
  }

  ping = async (targetId: string, numberOfAttempt: number = 20) => {
    if (!this.onMessageListenerAdded) {
      throw new Error('ping was cancelled')
    }

    try {
      await this._sendRequest({ type: PING_REQUEST_TYPE, from: this.id, to: targetId }, 500)
    } catch (error) {
      if (--numberOfAttempt <= 0) {
        throw new Error(`could not ping target "${targetId}"`)
      }

      await this.ping(targetId, numberOfAttempt)
    }
  }

  onMessage = (onMessageFn: OnMessageFnType<IncomingDataType>) => {
    this.onMessageFn = onMessageFn
  }

  onRequest = (onRequestFn: OnRequestFnType<IncomingDataType, OutgoingDataType>) => {
    this.onRequestFn = onRequestFn
  }

  removeListener = () => {
    if (this.onMessageListenerAdded) {
      this.onMessageListenerAdded = false
      self.removeEventListener('message', this.onMessageListener)
    }
  }

  sendMessage = (targetId: string, message: OutgoingDataType) => this._sendMessage({ data: JSON.stringify(message), to: targetId, from: this.id })

  private _sendMessage = (message: IMessage) => {
    if (this.isTargetWindow) {
      (this.target as Window).postMessage(message, this.targetOrigin)
    } else {
      (this.target as ServiceWorker).postMessage(message)
    }
  }

  sendRequest = (targetId: string, message: OutgoingDataType, timeout = 10000) => this._sendRequest({ data: JSON.stringify(message), to: targetId, from: this.id }, timeout)

  private _sendRequest = (message: IMessage, timeout = 10000) => (
    new Promise<IncomingDataType>((resolve, reject) => {
      let requestTimeout: number

      const {
        port1,
        port2,
      } = new MessageChannel()

      port1.onmessage = (evt) => {
        if (requestTimeout) {
          self.clearTimeout(requestTimeout)
        }
        port1.close()

        const message: IMessage = evt.data

        if (message.error) {
          reject(message.error)
        } else {
          resolve(message.data as IncomingDataType)
        }
      }


      if (this.isTargetWindow) {
        (this.target as Window).postMessage(message, this.targetOrigin, [port2])
      } else {
        (this.target as ServiceWorker).postMessage(message, [port2])
      }

      if (timeout) {
        requestTimeout = self.setTimeout(() => {
          reject('request timed out')
        }, timeout)
      }
    })
  )
}