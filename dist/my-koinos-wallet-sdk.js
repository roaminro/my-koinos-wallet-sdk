function $parcel$defineInteropFlag(a) {
  Object.defineProperty(a, '__esModule', {value: true, configurable: true});
}
function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

$parcel$defineInteropFlag(module.exports);

$parcel$export(module.exports, "default", () => $882b6d93070905b3$export$2e2bcd8739ae039);
function $e18943e3c35946bf$export$2e2bcd8739ae039(messenger, walletConnectorMessengerId, timeout) {
    return {
        async call (method, params) {
            const { result: result  } = await messenger.sendRequest(walletConnectorMessengerId, {
                scope: "provider",
                command: "call",
                arguments: JSON.stringify({
                    method: method,
                    params: params
                })
            }, timeout);
            return result;
        },
        async getNonce (account) {
            const { result: result  } = await messenger.sendRequest(walletConnectorMessengerId, {
                scope: "provider",
                command: "getNonce",
                arguments: JSON.stringify({
                    account: account
                })
            }, timeout);
            return result;
        },
        async getNextNonce (account) {
            const { result: result  } = await messenger.sendRequest(walletConnectorMessengerId, {
                scope: "provider",
                command: "getNextNonce",
                arguments: JSON.stringify({
                    account: account
                })
            }, timeout);
            return result;
        },
        async getAccountRc (account) {
            const { result: result  } = await messenger.sendRequest(walletConnectorMessengerId, {
                scope: "provider",
                command: "getAccountRc",
                arguments: JSON.stringify({
                    account: account
                })
            }, timeout);
            return result;
        },
        async getTransactionsById (transactionIds) {
            const { result: result  } = await messenger.sendRequest(walletConnectorMessengerId, {
                scope: "provider",
                command: "getTransactionsById",
                arguments: JSON.stringify({
                    transactionIds: transactionIds
                })
            }, timeout);
            return result;
        },
        async getBlocksById (blockIds) {
            const { result: result  } = await messenger.sendRequest(walletConnectorMessengerId, {
                scope: "provider",
                command: "getBlocksById",
                arguments: JSON.stringify({
                    blockIds: blockIds
                })
            }, timeout);
            return result;
        },
        async getHeadInfo () {
            const { result: result  } = await messenger.sendRequest(walletConnectorMessengerId, {
                scope: "provider",
                command: "getHeadInfo",
                arguments: JSON.stringify({})
            }, timeout);
            return result;
        },
        async getChainId () {
            const { result: result  } = await messenger.sendRequest(walletConnectorMessengerId, {
                scope: "provider",
                command: "getChainId",
                arguments: JSON.stringify({})
            }, timeout);
            return result;
        },
        async getBlocks (height, numBlocks = 1, idRef) {
            const { result: result  } = await messenger.sendRequest(walletConnectorMessengerId, {
                scope: "provider",
                command: "getBlocks",
                arguments: JSON.stringify({
                    height: height,
                    numBlocks: numBlocks,
                    idRef: idRef
                })
            }, timeout);
            return result;
        },
        async getBlock (height) {
            const { result: result  } = await messenger.sendRequest(walletConnectorMessengerId, {
                scope: "provider",
                command: "getBlock",
                arguments: JSON.stringify({
                    height: height
                })
            }, timeout);
            return result;
        },
        async wait (transactionId, type = "byBlock", waitTimeout = 30000) {
            const { result: result  } = await messenger.sendRequest(walletConnectorMessengerId, {
                scope: "provider",
                command: "wait",
                arguments: JSON.stringify({
                    transactionId: transactionId,
                    type: type,
                    timeout: waitTimeout
                })
            }, timeout);
            return result;
        },
        async sendTransaction (transaction, broadcast = true) {
            const { result: result  } = await messenger.sendRequest(walletConnectorMessengerId, {
                scope: "provider",
                command: "sendTransaction",
                arguments: JSON.stringify({
                    transaction: transaction,
                    broadcast: broadcast
                })
            }, timeout);
            result.transaction.wait = async (type = "byBlock", waitTimeout = 60000)=>{
                const { result: waitResult  } = await messenger.sendRequest(walletConnectorMessengerId, {
                    scope: "provider",
                    command: "wait",
                    arguments: JSON.stringify({
                        transactionId: transaction.id,
                        type: type,
                        timeout: waitTimeout
                    })
                }, timeout);
                return waitResult;
            };
            return result;
        },
        async readContract (operation) {
            const { result: result  } = await messenger.sendRequest(walletConnectorMessengerId, {
                scope: "provider",
                command: "readContract",
                arguments: JSON.stringify({
                    operation: operation
                })
            }, timeout);
            return result;
        },
        async submitBlock (block) {
            const { result: result  } = await messenger.sendRequest(walletConnectorMessengerId, {
                scope: "provider",
                command: "submitBlock",
                arguments: JSON.stringify({
                    block: block
                })
            }, timeout);
            return result;
        }
    };
}



function $84bf14fbbdac9746$export$4d7c1d4e1df91ff5(byteArray) {
    return btoa(Array.from(new Uint8Array(byteArray)).map((val)=>{
        return String.fromCharCode(val);
    }).join("")).replace(/\+/g, "-").replace(/\//g, "_").replace(/\\=/g, "");
}
function $84bf14fbbdac9746$export$91d6fadaa95edc0b(b64urlstring) {
    return new Uint8Array(atob(b64urlstring.replace(/-/g, "+").replace(/_/g, "/")).split("").map((val)=>{
        return val.charCodeAt(0);
    }));
}


function $7371ac622f10d4f8$export$2e2bcd8739ae039(signerAddress, messenger, walletConnectorMessengerId, timeout) {
    return {
        provider: (0, $e18943e3c35946bf$export$2e2bcd8739ae039)(messenger, walletConnectorMessengerId, timeout),
        getAddress: ()=>signerAddress,
        getPrivateKey: ()=>{
            throw new Error("not implemented");
        },
        signHash: async (hash)=>{
            const { result: result  } = await messenger.sendRequest(walletConnectorMessengerId, {
                scope: "signer",
                command: "signHash",
                arguments: JSON.stringify({
                    signerAddress: signerAddress,
                    hash: (0, $84bf14fbbdac9746$export$4d7c1d4e1df91ff5)(hash)
                })
            }, timeout);
            return (0, $84bf14fbbdac9746$export$91d6fadaa95edc0b)(result);
        },
        signMessage: async (message)=>{
            const { result: result  } = await messenger.sendRequest(walletConnectorMessengerId, {
                scope: "signer",
                command: "signMessage",
                arguments: JSON.stringify({
                    signerAddress: signerAddress,
                    message: message
                })
            }, timeout);
            return (0, $84bf14fbbdac9746$export$91d6fadaa95edc0b)(result);
        },
        prepareTransaction: async (transaction)=>{
            const { result: result  } = await messenger.sendRequest(walletConnectorMessengerId, {
                scope: "signer",
                command: "prepareTransaction",
                arguments: JSON.stringify({
                    signerAddress: signerAddress,
                    transaction: transaction
                })
            }, timeout);
            return result;
        },
        signTransaction: async (transaction, abis)=>{
            const { result: result  } = await messenger.sendRequest(walletConnectorMessengerId, {
                scope: "signer",
                command: "signTransaction",
                arguments: JSON.stringify({
                    signerAddress: signerAddress,
                    transaction: transaction,
                    options: {
                        abis: abis
                    }
                })
            }, timeout);
            return result.transaction;
        },
        sendTransaction: async (transaction, options)=>{
            const { result: result  } = await messenger.sendRequest(walletConnectorMessengerId, {
                scope: "signer",
                command: "signAndSendTransaction",
                arguments: JSON.stringify({
                    signerAddress: signerAddress,
                    transaction: transaction,
                    options: options
                })
            }, timeout);
            result.transaction.wait = async (type = "byBlock", waitTimeout = 60000)=>{
                const { result: waitResult  } = await messenger.sendRequest(walletConnectorMessengerId, {
                    scope: "provider",
                    command: "wait",
                    arguments: JSON.stringify({
                        transactionId: result.transaction.id,
                        type: type,
                        timeout: waitTimeout
                    })
                }, timeout);
                return waitResult;
            };
            return result;
        },
        prepareBlock: ()=>{
            throw new Error("not implemented");
        },
        signBlock: ()=>{
            throw new Error("not implemented");
        }
    };
}


const $7854553819392e1e$var$PING_REQUEST_TYPE = "messenger::ping::request";
const $7854553819392e1e$var$PING_REQUEST_ACK_TYPE = "messenger::ping::ack";
class $7854553819392e1e$export$1182391b36b9d1bf {
    constructor(target, id, isTargetWindow = true, targetOrigin = "*"){
        this.id = id;
        this.target = target;
        this.isTargetWindow = isTargetWindow;
        this.targetOrigin = targetOrigin;
        this.onMessageListenerAdded = false;
        this.addMessageListener();
    }
    onMessageListener = async (event)=>{
        if (this.targetOrigin !== "*" && !this.targetOrigin.startsWith(event.origin)) return;
        const { data: data , ports: ports  } = event;
        if (data.type !== $7854553819392e1e$var$PING_REQUEST_TYPE && data.to !== this.id) return;
        if (data && ports && ports[0]) {
            if (data.type === $7854553819392e1e$var$PING_REQUEST_TYPE) ports[0].postMessage({
                type: $7854553819392e1e$var$PING_REQUEST_ACK_TYPE
            });
            else if (this.onRequestFn) await this.onRequestFn({
                sender: event.origin,
                data: JSON.parse(data.data),
                sendData: (data)=>{
                    ports[0].postMessage({
                        data: data
                    });
                },
                sendError: (error)=>{
                    ports[0].postMessage({
                        error: error
                    });
                }
            });
            ports[0].close();
        } else if (data) {
            if (this.onMessageFn) this.onMessageFn({
                sender: event.origin,
                data: JSON.parse(data.data)
            });
        }
    };
    addMessageListener = ()=>{
        if (!this.onMessageListenerAdded) {
            this.onMessageListenerAdded = true;
            self.addEventListener("message", this.onMessageListener);
        }
    };
    ping = async (targetId, numberOfAttempt = 20)=>{
        if (!this.onMessageListenerAdded) throw new Error("ping was cancelled");
        try {
            await this._sendRequest({
                type: $7854553819392e1e$var$PING_REQUEST_TYPE,
                from: this.id,
                to: targetId
            }, 500);
        } catch (error) {
            if (--numberOfAttempt <= 0) throw new Error(`could not ping target "${targetId}"`);
            await this.ping(targetId, numberOfAttempt);
        }
    };
    onMessage = (onMessageFn)=>{
        this.onMessageFn = onMessageFn;
    };
    onRequest = (onRequestFn)=>{
        this.onRequestFn = onRequestFn;
    };
    removeListener = ()=>{
        if (this.onMessageListenerAdded) {
            this.onMessageListenerAdded = false;
            self.removeEventListener("message", this.onMessageListener);
        }
    };
    sendMessage = (targetId, message)=>this._sendMessage({
            data: JSON.stringify(message),
            to: targetId,
            from: this.id
        });
    _sendMessage = (message)=>{
        if (this.isTargetWindow) this.target.postMessage(message, this.targetOrigin);
        else this.target.postMessage(message);
    };
    sendRequest = (targetId, message, timeout = 10000)=>this._sendRequest({
            data: JSON.stringify(message),
            to: targetId,
            from: this.id
        }, timeout);
    _sendRequest = (message, timeout = 10000)=>new Promise((resolve, reject)=>{
            let requestTimeout;
            const { port1: port1 , port2: port2  } = new MessageChannel();
            port1.onmessage = (evt)=>{
                if (requestTimeout) self.clearTimeout(requestTimeout);
                port1.close();
                const message = evt.data;
                if (message.error) reject(message.error);
                else resolve(message.data);
            };
            if (this.isTargetWindow) this.target.postMessage(message, this.targetOrigin, [
                port2
            ]);
            else this.target.postMessage(message, [
                port2
            ]);
            if (timeout) requestTimeout = self.setTimeout(()=>{
                reject("request timed out");
            }, timeout);
        });
}


let $a1277f7c24cac7c7$var$loaded = false;
function $a1277f7c24cac7c7$export$ed85e297a450c0d2() {
    return new Promise((resolve, reject)=>{
        if ($a1277f7c24cac7c7$var$loaded) resolve();
        else if ([
            "loaded",
            "interactive",
            "complete"
        ].indexOf(document.readyState) > -1) {
            $a1277f7c24cac7c7$var$loaded = true;
            resolve();
        } else window.addEventListener("load", ()=>{
            $a1277f7c24cac7c7$var$loaded = true;
            resolve();
        }, false);
    });
}


const $882b6d93070905b3$var$MY_KOINOS_WALLET_IFRAME_CLASS = "my-koinos-wallet-iframe";
const $882b6d93070905b3$var$MY_KOINOS_WALLET_CONNECTOR_CHILD_MESSENGER_ID = "my-koinos-wallet-connector-child";
const $882b6d93070905b3$var$MY_KOINOS_WALLET_CONNECTOR_PARENT_MESSENGER_ID = "my-koinos-wallet-connector-parent";
(0, $a1277f7c24cac7c7$export$ed85e297a450c0d2)().then(()=>{
    if (document.getElementsByClassName($882b6d93070905b3$var$MY_KOINOS_WALLET_IFRAME_CLASS).length > 1) console.warn("My Koinos Wallet script was already loaded. This might cause unexpected behavior. If loading with a <script> tag, please make sure that you only load it once.");
})// eslint-disable-next-line @typescript-eslint/no-empty-function
.catch(()=>{}) // Prevents unhandledPromiseRejectionWarning, which happens when using React SSR;
;
class $882b6d93070905b3$export$2e2bcd8739ae039 {
    constructor(walletUrl){
        $882b6d93070905b3$export$2e2bcd8739ae039.checkIfAlreadyInitialized();
        this.iframe = document.createElement("iframe");
        this.iframe.className = $882b6d93070905b3$var$MY_KOINOS_WALLET_IFRAME_CLASS;
        this.iframe.hidden = true;
        this.iframe.src = walletUrl;
        document.body.appendChild(this.iframe);
    }
    close() {
        if (this.messenger) this.messenger.removeListener();
        this.iframe.remove();
    }
    async connect() {
        if (!this.iframe.contentWindow) throw new Error("My Koinos Wallet is not loaded yet");
        this.messenger = new (0, $7854553819392e1e$export$1182391b36b9d1bf)(this.iframe.contentWindow, $882b6d93070905b3$var$MY_KOINOS_WALLET_CONNECTOR_PARENT_MESSENGER_ID);
        try {
            await this.messenger.ping($882b6d93070905b3$var$MY_KOINOS_WALLET_CONNECTOR_CHILD_MESSENGER_ID);
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
    static checkIfAlreadyInitialized() {
        if (document.getElementsByClassName($882b6d93070905b3$var$MY_KOINOS_WALLET_IFRAME_CLASS).length) console.warn("An instance of My Koinos Wallet was already initialized. This is probably a mistake. Make sure that you use the same My KoinosWallet instance throughout your app.");
    }
    async getAccounts(timeout = 60000) {
        if (!this.iframe.contentWindow) throw new Error("My Koinos Wallet is not loaded yet");
        const { result: result  } = await this.messenger.sendRequest($882b6d93070905b3$var$MY_KOINOS_WALLET_CONNECTOR_CHILD_MESSENGER_ID, {
            scope: "accounts",
            command: "getAccounts"
        }, timeout);
        return result;
    }
    async requestPermissions(permissions, timeout = 60000) {
        if (!this.iframe.contentWindow) throw new Error("My Koinos Wallet is not loaded yet");
        const { result: result  } = await this.messenger.sendRequest($882b6d93070905b3$var$MY_KOINOS_WALLET_CONNECTOR_CHILD_MESSENGER_ID, {
            scope: "permissions",
            command: "requestPermissions",
            arguments: JSON.stringify({
                permissions: permissions
            })
        }, timeout);
        return result;
    }
    getSigner(signerAddress, timeout = 60000) {
        if (!this.iframe.contentWindow) throw new Error("My Koinos Wallet is not loaded yet");
        return (0, $7371ac622f10d4f8$export$2e2bcd8739ae039)(signerAddress, this.messenger, $882b6d93070905b3$var$MY_KOINOS_WALLET_CONNECTOR_CHILD_MESSENGER_ID, timeout);
    }
    getProvider(timeout = 60000) {
        if (!this.iframe.contentWindow) throw new Error("My Koinos Wallet is not loaded yet");
        return (0, $e18943e3c35946bf$export$2e2bcd8739ae039)(this.messenger, $882b6d93070905b3$var$MY_KOINOS_WALLET_CONNECTOR_CHILD_MESSENGER_ID, timeout);
    }
}


//# sourceMappingURL=my-koinos-wallet-sdk.js.map
