function e(e,s,t){return{async call(n,a){const{result:r}=await e.sendRequest(s,{scope:"provider",command:"call",arguments:JSON.stringify({method:n,params:a})},t);return r},async getNonce(n){const{result:a}=await e.sendRequest(s,{scope:"provider",command:"getNonce",arguments:JSON.stringify({account:n})},t);return a},async getAccountRc(n){const{result:a}=await e.sendRequest(s,{scope:"provider",command:"getAccountRc",arguments:JSON.stringify({account:n})},t);return a},async getTransactionsById(n){const{result:a}=await e.sendRequest(s,{scope:"provider",command:"getTransactionsById",arguments:JSON.stringify({transactionIds:n})},t);return a},async getBlocksById(n){const{result:a}=await e.sendRequest(s,{scope:"provider",command:"getBlocksById",arguments:JSON.stringify({blockIds:n})},t);return a},async getHeadInfo(){const{result:n}=await e.sendRequest(s,{scope:"provider",command:"getHeadInfo",arguments:JSON.stringify({})},t);return n},async getChainId(){const{result:n}=await e.sendRequest(s,{scope:"provider",command:"getChainId",arguments:JSON.stringify({})},t);return n},async getBlocks(n,a=1,r){const{result:i}=await e.sendRequest(s,{scope:"provider",command:"getBlocks",arguments:JSON.stringify({height:n,numBlocks:a,idRef:r})},t);return i},async getBlock(n){const{result:a}=await e.sendRequest(s,{scope:"provider",command:"getBlock",arguments:JSON.stringify({height:n})},t);return a},async wait(n,a="byBlock",r=3e4){const{result:i}=await e.sendRequest(s,{scope:"provider",command:"wait",arguments:JSON.stringify({transactionId:n,type:a,timeout:r})},t);return i},async sendTransaction(n,a=!0){const{result:r}=await e.sendRequest(s,{scope:"provider",command:"sendTransaction",arguments:JSON.stringify({transaction:n,broadcast:a})},t);return r.transaction.wait=async(a="byBlock",r=6e4)=>{const{result:i}=await e.sendRequest(s,{scope:"provider",command:"wait",arguments:JSON.stringify({transactionId:n.id,type:a,timeout:r})},t);return i},r},async readContract(n){const{result:a}=await e.sendRequest(s,{scope:"provider",command:"readContract",arguments:JSON.stringify({operation:n})},t);return a},async submitBlock(n){const{result:a}=await e.sendRequest(s,{scope:"provider",command:"submitBlock",arguments:JSON.stringify({block:n})},t);return a}}}function s(e,s,t,n){return{getAddress:()=>e,getPrivateKey:()=>{throw new Error("not implemented")},signHash:async a=>{const{result:r}=await s.sendRequest(t,{scope:"signer",command:"signHash",arguments:JSON.stringify({signerAddress:e,hash:a})},n);return r},signMessage:async a=>{const{result:r}=await s.sendRequest(t,{scope:"signer",command:"signMessage",arguments:JSON.stringify({signerAddress:e,message:a})},n);return r},prepareTransaction:async a=>{const{result:r}=await s.sendRequest(t,{scope:"signer",command:"prepareTransaction",arguments:JSON.stringify({signerAddress:e,transaction:a})},n);return r},signTransaction:async(a,r)=>{const{result:i}=await s.sendRequest(t,{scope:"signer",command:"signTransaction",arguments:JSON.stringify({signerAddress:e,transaction:a,options:{abis:r}})},n);return i},sendTransaction:async(a,r)=>{const{result:i}=await s.sendRequest(t,{scope:"signer",command:"signAndSendTransaction",arguments:JSON.stringify({signerAddress:e,transaction:a,options:r})},n);return i.transaction.wait=async(e="byBlock",a=6e4)=>{const{result:r}=await s.sendRequest(t,{scope:"provider",command:"wait",arguments:JSON.stringify({transactionId:i.transaction.id,type:e,timeout:a})},n);return r},i},prepareBlock:()=>{throw new Error("not implemented")},signBlock:()=>{throw new Error("not implemented")}}}const t="messenger::ping::request";class n{constructor(e,s,t=!0,n="*"){this.id=s,this.target=e,this.isTargetWindow=t,this.targetOrigin=n,this.onMessageListenerAdded=!1,this.addMessageListener()}onMessageListener=async e=>{if("*"!==this.targetOrigin&&!this.targetOrigin.startsWith(e.origin))return;const{data:s,ports:n}=e;s.type!==t&&s.to!==this.id||(s&&n&&n[0]?(s.type===t?n[0].postMessage({type:"messenger::ping::ack"}):this.onRequestFn&&await this.onRequestFn({sender:e.origin,data:JSON.parse(s.data),sendData:e=>{n[0].postMessage({data:e})},sendError:e=>{n[0].postMessage({error:e})}}),n[0].close()):s&&this.onMessageFn&&this.onMessageFn({sender:e.origin,data:JSON.parse(s.data)}))};addMessageListener=()=>{this.onMessageListenerAdded||(this.onMessageListenerAdded=!0,self.addEventListener("message",this.onMessageListener))};ping=async(e,s=20)=>{if(!this.onMessageListenerAdded)throw new Error("ping was cancelled");try{await this._sendRequest({type:t,from:this.id,to:e},500)}catch(t){if(--s<=0)throw new Error(`could not ping target "${e}"`);await this.ping(e,s)}};onMessage=e=>{this.onMessageFn=e};onRequest=e=>{this.onRequestFn=e};removeListener=()=>{this.onMessageListenerAdded&&(this.onMessageListenerAdded=!1,self.removeEventListener("message",this.onMessageListener))};sendMessage=(e,s)=>this._sendMessage({data:JSON.stringify(s),to:e,from:this.id});_sendMessage=e=>{this.isTargetWindow?this.target.postMessage(e,this.targetOrigin):this.target.postMessage(e)};sendRequest=(e,s,t=1e4)=>this._sendRequest({data:JSON.stringify(s),to:e,from:this.id},t);_sendRequest=(e,s=1e4)=>new Promise(((t,n)=>{let a;const{port1:r,port2:i}=new MessageChannel;r.onmessage=e=>{a&&self.clearTimeout(a),r.close();const s=e.data;s.error?n(s.error):t(s.data)},this.isTargetWindow?this.target.postMessage(e,this.targetOrigin,[i]):this.target.postMessage(e,[i]),s&&(a=self.setTimeout((()=>{n("request timed out")}),s))}))}let a=!1;const r="koinos-wallet-iframe",i="wallet-connector-child";new Promise(((e,s)=>{a?e():["loaded","interactive","complete"].indexOf(document.readyState)>-1?(a=!0,e()):window.addEventListener("load",(()=>{a=!0,e()}),!1)})).then((()=>{document.getElementsByClassName(r).length&&console.warn("Koinos-Wallet script was already loaded. This might cause unexpected behavior. If loading with a <script> tag, please make sure that you only load it once.")})).catch((()=>{}));class o{constructor(e){this.iframe=document.createElement("iframe"),this.iframe.id=r,this.iframe.hidden=!0,this.iframe.onload=()=>this.onIframeLoad(),this.iframe.src=e,document.body.appendChild(this.iframe),o.checkIfAlreadyInitialized()}close(){this.messenger.removeListener()}async onIframeLoad(){this.messenger=new n(this.iframe.contentWindow,"wallet-connector-parent"),await this.messenger.ping(i),console.log("connected to koinos-wallet-connector")}static checkIfAlreadyInitialized(){document.getElementsByClassName(r).length&&console.warn("An instance of Koinos-Wallet was already initialized. This is probably a mistake. Make sure that you use the same Koinos-Wallet instance throughout your app.")}async getAccounts(e=6e4){const{result:s}=await this.messenger.sendRequest(i,{scope:"accounts",command:"getAccounts"},e);return s}getSigner(e,t=6e4){return s(e,this.messenger,i,t)}getProvider(s=6e4){return e(this.messenger,i,s)}}export{o as default};
//# sourceMappingURL=koinos-wallet.module.js.map
