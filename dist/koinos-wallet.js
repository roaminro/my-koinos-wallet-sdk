var e,s,t,n,a;e=module.exports,Object.defineProperty(e,"__esModule",{value:!0,configurable:!0}),s=module.exports,t="default",n=()=>c,Object.defineProperty(s,t,{get:n,set:a,enumerable:!0,configurable:!0});const i="messenger::ping::request";class r{constructor(e,s,t=!0,n="*"){this.id=s,this.target=e,this.isTargetWindow=t,this.targetOrigin=n,this.onMessageListenerAdded=!1,this.addMessageListener()}onMessageListener=async e=>{if("*"!==this.targetOrigin&&!this.targetOrigin.startsWith(e.origin))return;const{data:s,ports:t}=e;s.type!==i&&s.to!==this.id||(s&&t&&t[0]?(s.type===i?t[0].postMessage({type:"messenger::ping::ack"}):this.onRequestFn&&await this.onRequestFn({sender:e.origin,data:JSON.parse(s.data),sendData:e=>{t[0].postMessage({data:e})},sendError:e=>{t[0].postMessage({error:e})}}),t[0].close()):s&&this.onMessageFn&&this.onMessageFn({sender:e.origin,data:JSON.parse(s.data)}))};addMessageListener=()=>{this.onMessageListenerAdded||(this.onMessageListenerAdded=!0,self.addEventListener("message",this.onMessageListener))};ping=async(e,s=20)=>{if(!this.onMessageListenerAdded)throw new Error("ping was cancelled");try{await this._sendRequest({type:i,from:this.id,to:e},500)}catch(t){if(--s<=0)throw new Error(`could not ping target "${e}"`);await this.ping(e,s)}};onMessage=e=>{this.onMessageFn=e};onRequest=e=>{this.onRequestFn=e};removeListener=()=>{this.onMessageListenerAdded&&(this.onMessageListenerAdded=!1,self.removeEventListener("message",this.onMessageListener))};sendMessage=(e,s)=>this._sendMessage({data:JSON.stringify(s),to:e,from:this.id});_sendMessage=e=>{this.isTargetWindow?this.target.postMessage(e,this.targetOrigin):this.target.postMessage(e)};sendRequest=(e,s,t=1e4)=>this._sendRequest({data:JSON.stringify(s),to:e,from:this.id},t);_sendRequest=(e,s=1e4)=>new Promise(((t,n)=>{let a;const{port1:i,port2:r}=new MessageChannel;i.onmessage=e=>{a&&self.clearTimeout(a),i.close();const s=e.data;s.error?n(s.error):t(s.data)},this.isTargetWindow?this.target.postMessage(e,this.targetOrigin,[r]):this.target.postMessage(e,[r]),s&&(a=self.setTimeout((()=>{n("request timed out")}),s))}))}let o=!1;const d="koinos-wallet-iframe",g="wallet-connector-child";new Promise(((e,s)=>{o?e():["loaded","interactive","complete"].indexOf(document.readyState)>-1?(o=!0,e()):window.addEventListener("load",(()=>{o=!0,e()}),!1)})).then((()=>{document.getElementsByClassName(d).length&&console.warn("Koinos-Wallet script was already loaded. This might cause unexpected behavior. If loading with a <script> tag, please make sure that you only load it once.")})).catch((()=>{}));class c{constructor(e){this.iframe=document.createElement("iframe"),this.iframe.id=d,this.iframe.hidden=!0,this.iframe.onload=()=>this.onIframeLoad(),this.iframe.src=e,document.body.appendChild(this.iframe),c.checkIfAlreadyInitialized()}close(){this.messenger.removeListener()}async onIframeLoad(){this.messenger=new r(this.iframe.contentWindow,"wallet-connector-parent"),await this.messenger.ping(g),console.log("connected to koinos-wallet-connector")}static checkIfAlreadyInitialized(){document.getElementsByClassName(d).length&&console.warn("An instance of Koinos-Wallet was already initialized. This is probably a mistake. Make sure that you use the same Koinos-Wallet instance throughout your app.")}async getAccounts(e=6e4){const{result:s}=await this.messenger.sendRequest(g,{scope:"accounts",command:"getAccounts"},e);return s}async signTransaction(e,s=6e4){const{result:t}=await this.messenger.sendRequest(g,{scope:"signer",command:"signTransaction",arguments:JSON.stringify(e)},s);return t}async signAndSendTransaction(e,s=6e4){const{result:t}=await this.messenger.sendRequest(g,{scope:"signer",command:"signAndSendTransaction",arguments:JSON.stringify(e)},s);return t}}
//# sourceMappingURL=koinos-wallet.js.map
