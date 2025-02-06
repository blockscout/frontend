"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[1313],{21313:(e,t,s)=>{s.r(t),s.d(t,{SIWEController:()=>r,W3mConnectingSiwe:()=>C,W3mConnectingSiweView:()=>E,createSIWEConfig:()=>b,formatMessage:()=>u.hwK,getAddressFromMessage:()=>h,getChainIdFromMessage:()=>w,getDidAddress:()=>u.q_h,getDidChainId:()=>u.aG$,mapToSIWX:()=>_,verifySignature:()=>p});var i=s(4707),n=s(82419);let a=(0,n.BX)({status:"uninitialized"}),r={state:a,subscribeKey:(e,t)=>(0,i.u$)(a,e,t),subscribe:e=>(0,n.B1)(a,()=>e(a)),_getClient(){if(!a._client)throw Error("SIWEController client not set");return a._client},async getNonce(e){let t=this._getClient(),s=await t.getNonce(e);return this.setNonce(s),s},async getSession(){try{let e=this._getClient(),t=await e.getSession();return t&&(this.setSession(t),this.setStatus("success")),t||void 0}catch{return}},createMessage(e){let t=this._getClient().createMessage(e);return this.setMessage(t),t},async verifyMessage(e){let t=this._getClient();return await t.verifyMessage(e)},async signIn(){let e=this._getClient();return await e.signIn()},async signOut(){let e=this._getClient();await e.signOut(),this.setStatus("ready"),this.setSession(void 0),e.onSignOut?.()},onSignIn(e){let t=this._getClient();t.onSignIn?.(e)},onSignOut(){let e=this._getClient();e.onSignOut?.()},async setSIWEClient(e){a._client=(0,n.KR)(e),a.session=await this.getSession(),a.status=a.session?"success":"ready"},setNonce(e){a.nonce=e},setStatus(e){a.status=e},setMessage(e){a.message=e},setSession(e){a.session=e,a.status=e?"success":"ready"}};var o=s(50096);let c={FIVE_MINUTES_IN_MS:3e5};class l{constructor(e){let{enabled:t=!0,nonceRefetchIntervalMs:s=c.FIVE_MINUTES_IN_MS,sessionRefetchIntervalMs:i=c.FIVE_MINUTES_IN_MS,signOutOnAccountChange:n=!0,signOutOnDisconnect:a=!0,signOutOnNetworkChange:r=!0,...o}=e;this.options={enabled:t,nonceRefetchIntervalMs:s,sessionRefetchIntervalMs:i,signOutOnDisconnect:a,signOutOnAccountChange:n,signOutOnNetworkChange:r},this.methods=o}async getNonce(e){let t=await this.methods.getNonce(e);if(!t)throw Error("siweControllerClient:getNonce - nonce is undefined");return t}async getMessageParams(){return await this.methods.getMessageParams?.()||{}}createMessage(e){let t=this.methods.createMessage(e);if(!t)throw Error("siweControllerClient:createMessage - message is undefined");return t}async verifyMessage(e){return await this.methods.verifyMessage(e)}async getSession(){let e=await this.methods.getSession();if(!e)throw Error("siweControllerClient:getSession - session is undefined");return e}async signIn(){await o.UG.requestSignMessage();let e=await this.methods.getSession();if(!e)throw Error("Error verifying SIWE signature");return e}async signOut(){let e=o.UG.getSIWX();return!!e&&(await e.setSessions([]),!0)}}var u=s(9905);let d=/0x[a-fA-F0-9]{40}/u,g=/Chain ID: (?<temp1>\d+)/u;function h(e){return e.match(d)?.[0]||""}function w(e){return`eip155:${e.match(g)?.[1]||1}`}async function p({address:e,message:t,signature:s,chainId:i,projectId:n}){let a=(0,u.quX)(e,t,s);return a||(a=await (0,u.ucy)(e,t,s,i,n)),a}var S=s(75834),f=s(97199);let m=(0,f.AH)`
  :host {
    display: flex;
    justify-content: center;
    gap: var(--wui-spacing-2xl);
  }

  wui-visual-thumbnail:nth-child(1) {
    z-index: 1;
  }
`,C=class extends f.WF{constructor(){super(...arguments),this.dappImageUrl=o.Hd.state.metadata?.icons,this.walletImageUrl=o.Uj.state.connectedWalletInfo?.icon}firstUpdated(){let e=this.shadowRoot?.querySelectorAll("wui-visual-thumbnail");e?.[0]&&this.createAnimation(e[0],"translate(18px)"),e?.[1]&&this.createAnimation(e[1],"translate(-18px)")}render(){return(0,f.qy)`
      <wui-visual-thumbnail
        ?borderRadiusFull=${!0}
        .imageSrc=${this.dappImageUrl?.[0]}
      ></wui-visual-thumbnail>
      <wui-visual-thumbnail .imageSrc=${this.walletImageUrl}></wui-visual-thumbnail>
    `}createAnimation(e,t){e.animate([{transform:"translateX(0px)"},{transform:t}],{duration:1600,easing:"cubic-bezier(0.56, 0, 0.48, 1)",direction:"alternate",iterations:1/0})}};C.styles=m,C=function(e,t,s,i){var n,a=arguments.length,r=a<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,s):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,s,i);else for(var o=e.length-1;o>=0;o--)(n=e[o])&&(r=(a<3?n(r):a>3?n(t,s,r):n(t,s))||r);return a>3&&r&&Object.defineProperty(t,s,r),r}([(0,S.customElement)("w3m-connecting-siwe")],C);var y=s(25707),I=s(60095),v=function(e,t,s,i){var n,a=arguments.length,r=a<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,s):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,s,i);else for(var o=e.length-1;o>=0;o--)(n=e[o])&&(r=(a<3?n(r):a>3?n(t,s,r):n(t,s))||r);return a>3&&r&&Object.defineProperty(t,s,r),r};let E=class extends f.WF{constructor(){super(...arguments),this.dappName=o.Hd.state.metadata?.name,this.isSigning=!1,this.isCancelling=!1}render(){return(0,f.qy)`
      <wui-flex justifyContent="center" .padding=${["2xl","0","xxl","0"]}>
        <w3m-connecting-siwe></w3m-connecting-siwe>
      </wui-flex>
      <wui-flex
        .padding=${["0","4xl","l","4xl"]}
        gap="s"
        justifyContent="space-between"
      >
        <wui-text variant="paragraph-500" align="center" color="fg-100"
          >${this.dappName??"Dapp"} needs to connect to your wallet</wui-text
        >
      </wui-flex>
      <wui-flex
        .padding=${["0","3xl","l","3xl"]}
        gap="s"
        justifyContent="space-between"
      >
        <wui-text variant="small-400" align="center" color="fg-200"
          >Sign this message to prove you own this wallet and proceed. Canceling will disconnect
          you.</wui-text
        >
      </wui-flex>
      <wui-flex .padding=${["l","xl","xl","xl"]} gap="s" justifyContent="space-between">
        <wui-button
          size="lg"
          borderRadius="xs"
          fullWidth
          variant="neutral"
          ?loading=${this.isCancelling}
          @click=${this.onCancel.bind(this)}
          data-testid="w3m-connecting-siwe-cancel"
        >
          Cancel
        </wui-button>
        <wui-button
          size="lg"
          borderRadius="xs"
          fullWidth
          variant="main"
          @click=${this.onSign.bind(this)}
          ?loading=${this.isSigning}
          data-testid="w3m-connecting-siwe-sign"
        >
          ${this.isSigning?"Signing...":"Sign"}
        </wui-button>
      </wui-flex>
    `}async onSign(){this.isSigning=!0,o.En.sendEvent({event:"CLICK_SIGN_SIWX_MESSAGE",type:"track",properties:{network:o.WB.state.activeCaipNetwork?.caipNetworkId||"",isSmartAccount:o.Uj.state.preferredAccountType===I.Vl.ACCOUNT_TYPES.SMART_ACCOUNT}});try{r.setStatus("loading");let e=await r.signIn();return r.setStatus("success"),o.En.sendEvent({event:"SIWX_AUTH_SUCCESS",type:"track",properties:{network:o.WB.state.activeCaipNetwork?.caipNetworkId||"",isSmartAccount:o.Uj.state.preferredAccountType===I.Vl.ACCOUNT_TYPES.SMART_ACCOUNT}}),e}catch(t){let e=o.Uj.state.preferredAccountType===I.Vl.ACCOUNT_TYPES.SMART_ACCOUNT;return e?o.Pt.showError("This application might not support Smart Accounts"):o.Pt.showError("Signature declined"),r.setStatus("error"),o.En.sendEvent({event:"SIWX_AUTH_ERROR",type:"track",properties:{network:o.WB.state.activeCaipNetwork?.caipNetworkId||"",isSmartAccount:e}})}finally{this.isSigning=!1}}async onCancel(){this.isCancelling=!0,o.WB.state.activeCaipAddress?(await o.x4.disconnect(),o.W3.close()):o.IN.push("Connect"),this.isCancelling=!1,o.En.sendEvent({event:"CLICK_CANCEL_SIWX",type:"track",properties:{network:o.WB.state.activeCaipNetwork?.caipNetworkId||"",isSmartAccount:o.Uj.state.preferredAccountType===I.Vl.ACCOUNT_TYPES.SMART_ACCOUNT}})}};v([(0,y.wk)()],E.prototype,"isSigning",void 0),v([(0,y.wk)()],E.prototype,"isCancelling",void 0),E=v([(0,S.customElement)("w3m-connecting-siwe-view")],E);var A=s(64698);let N=[];function _(e){async function t(){try{let t=await e.methods.getSession();if(!t)return;if(!t?.address)throw Error("SIWE session is missing address");if(!t?.chainId)throw Error("SIWE session is missing chainId");return t}catch(e){console.warn("AppKit:SIWE:getSession - error:",e);return}}async function s(){await e.methods.signOut(),e.methods.onSignOut?.()}return N.forEach(e=>e()),N.push(o.WB.subscribeKey("activeCaipNetwork",async i=>{if(!e.options.signOutOnNetworkChange)return;let n=await t();n&&n.chainId!==A.LX.caipNetworkIdToNumber(i?.caipNetworkId)&&await s()}),o.WB.subscribeKey("activeCaipAddress",async i=>{if(e.options.signOutOnDisconnect&&!i){await t()&&await s();return}if(e.options.signOutOnAccountChange){let e=await t(),n=e?.address?.toLowerCase(),a=o.wE?.getPlainAddress(i)?.toLowerCase();e&&n!==a&&await s()}})),{async createMessage(t){let s=await e.methods.getMessageParams?.();if(!s)throw Error("Failed to get message params!");let i=await e.getNonce(t.accountAddress),n=s.iat||new Date().toISOString();return{nonce:i,version:"1",requestId:s.requestId,accountAddress:t.accountAddress,chainId:t.chainId,domain:s.domain,uri:s.uri,notBefore:s.nbf,resources:s.resources,statement:s.statement,expirationTime:s.exp,issuedAt:n,toString:()=>e.createMessage({...s,chainId:A.LX.caipNetworkIdToNumber(t.chainId)||1,address:`did:pkh:${t.chainId}:${t.accountAddress}`,nonce:i,version:"1",iat:n})}},async addSession(t){if(!A.LX.parseEvmChainId(t.data.chainId))return Promise.resolve();if(await e.methods.verifyMessage(t))return e.methods.onSignIn?.({address:t.data.accountAddress,chainId:A.LX.parseEvmChainId(t.data.chainId)}),Promise.resolve();throw Error("Failed to verify message")},async revokeSession(e,t){try{await s()}catch(e){console.warn("AppKit:SIWE:revokeSession - signOut error",e)}},async setSessions(e){if(0===e.length)try{await s()}catch(e){console.warn("AppKit:SIWE:setSessions - signOut error",e)}else{let t=e.find(e=>e.data.chainId===o.WB.getActiveCaipNetwork()?.caipNetworkId)||e[0];await this.addSession(t)}},async getSessions(e,s){try{if(!e.startsWith("eip155:"))return[{data:{accountAddress:s,chainId:e},message:"",signature:""}];let i=await t(),n=`eip155:${i?.chainId}`,a=i?.address?.toLowerCase(),r=s?.toLowerCase();if(!i||a!==r||n!==e)return[];return[{data:{accountAddress:i.address,chainId:n},message:"",signature:""}]}catch(e){return console.warn("AppKit:SIWE:getSessions - error:",e),[]}}}}function b(e){return new l(e)}}}]);
//# sourceMappingURL=1313.239ce8f5a7635d8e.js.map