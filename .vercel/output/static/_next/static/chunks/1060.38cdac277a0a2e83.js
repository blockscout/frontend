"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[1060],{1060:(e,t,o)=>{o.r(t),o.d(t,{W3mModal:()=>c});var a=o(50096),i=o(75834),r=o(97199),s=o(25707);let n=(0,r.AH)`
  :host {
    z-index: var(--w3m-z-index);
    display: block;
    backface-visibility: hidden;
    will-change: opacity;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    opacity: 0;
    background-color: var(--wui-cover);
    transition: opacity 0.2s var(--wui-ease-out-power-2);
    will-change: opacity;
  }

  :host(.open) {
    opacity: 1;
  }

  :host(.embedded) {
    position: relative;
    pointer-events: unset;
    background: none;
    width: 100%;
    opacity: 1;
  }

  wui-card {
    max-width: var(--w3m-modal-width);
    width: 100%;
    position: relative;
    animation: zoom-in 0.2s var(--wui-ease-out-power-2);
    animation-fill-mode: backwards;
    outline: none;
    transition: border-radius var(--wui-duration-lg) var(--wui-ease-out-power-1);
  }

  :host(.embedded) wui-card {
    max-width: 400px;
  }

  wui-card[shake='true'] {
    animation:
      zoom-in 0.2s var(--wui-ease-out-power-2),
      w3m-shake 0.5s var(--wui-ease-out-power-2);
  }

  wui-flex {
    overflow-x: hidden;
    overflow-y: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }

  @media (max-height: 700px) and (min-width: 431px) {
    wui-flex {
      align-items: flex-start;
    }

    wui-card {
      margin: var(--wui-spacing-xxl) 0px;
    }
  }

  @media (max-width: 430px) {
    wui-flex {
      align-items: flex-end;
    }

    wui-card {
      max-width: 100%;
      border-bottom-left-radius: var(--local-border-bottom-mobile-radius);
      border-bottom-right-radius: var(--local-border-bottom-mobile-radius);
      border-bottom: none;
      animation: slide-in 0.2s var(--wui-ease-out-power-2);
    }

    wui-card[shake='true'] {
      animation:
        slide-in 0.2s var(--wui-ease-out-power-2),
        w3m-shake 0.5s var(--wui-ease-out-power-2);
    }
  }

  @keyframes zoom-in {
    0% {
      transform: scale(0.95) translateY(0);
    }
    100% {
      transform: scale(1) translateY(0);
    }
  }

  @keyframes slide-in {
    0% {
      transform: scale(1) translateY(50px);
    }
    100% {
      transform: scale(1) translateY(0);
    }
  }

  @keyframes w3m-shake {
    0% {
      transform: scale(1) rotate(0deg);
    }
    20% {
      transform: scale(1) rotate(-1deg);
    }
    40% {
      transform: scale(1) rotate(1.5deg);
    }
    60% {
      transform: scale(1) rotate(-1.5deg);
    }
    80% {
      transform: scale(1) rotate(1deg);
    }
    100% {
      transform: scale(1) rotate(0deg);
    }
  }

  @keyframes w3m-view-height {
    from {
      height: var(--prev-height);
    }
    to {
      height: var(--new-height);
    }
  }
`;o(64698);var d=function(e,t,o,a){var i,r=arguments.length,s=r<3?t:null===a?a=Object.getOwnPropertyDescriptor(t,o):a;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,o,a);else for(var n=e.length-1;n>=0;n--)(i=e[n])&&(s=(r<3?i(s):r>3?i(t,o,s):i(t,o))||s);return r>3&&s&&Object.defineProperty(t,o,s),s};let l="scroll-lock",c=class extends r.WF{constructor(){super(),this.unsubscribe=[],this.abortController=void 0,this.enableEmbedded=a.Hd.state.enableEmbedded,this.open=a.W3.state.open,this.caipAddress=a.WB.state.activeCaipAddress,this.caipNetwork=a.WB.state.activeCaipNetwork,this.shake=a.W3.state.shake,this.initializeTheming(),a.Np.prefetch(),this.unsubscribe.push(a.W3.subscribeKey("open",e=>e?this.onOpen():this.onClose()),a.W3.subscribeKey("shake",e=>this.shake=e),a.WB.subscribeKey("activeCaipNetwork",e=>this.onNewNetwork(e)),a.WB.subscribeKey("activeCaipAddress",e=>this.onNewAddress(e))),a.En.sendEvent({type:"track",event:"MODAL_LOADED"})}firstUpdated(){a.Hd.setEnableEmbedded(this.enableEmbedded),this.enableEmbedded&&this.caipAddress&&a.W3.close()}disconnectedCallback(){this.unsubscribe.forEach(e=>e()),this.onRemoveKeyboardListener()}render(){return(this.style.cssText=`
      --local-border-bottom-mobile-radius: ${this.enableEmbedded?"clamp(0px, var(--wui-border-radius-l), 44px)":"0px"};
    `,this.enableEmbedded)?(0,r.qy)`${this.contentTemplate()}
        <w3m-tooltip></w3m-tooltip> `:this.open?(0,r.qy)`
          <wui-flex @click=${this.onOverlayClick.bind(this)} data-testid="w3m-modal-overlay">
            ${this.contentTemplate()}
          </wui-flex>
          <w3m-tooltip></w3m-tooltip>
        `:null}contentTemplate(){return(0,r.qy)` <wui-card
      shake="${this.shake}"
      role="alertdialog"
      aria-modal="true"
      tabindex="0"
      data-testid="w3m-modal-card"
    >
      <w3m-header></w3m-header>
      <w3m-router></w3m-router>
      <w3m-snackbar></w3m-snackbar>
      <w3m-alertbar></w3m-alertbar>
    </wui-card>`}async onOverlayClick(e){e.target===e.currentTarget&&await this.handleClose()}async handleClose(){"UnsupportedChain"===a.IN.state.view||await a.UG.isSIWXCloseDisabled()?a.W3.shake():a.W3.close()}initializeTheming(){let{themeVariables:e,themeMode:t}=a.Wn.state,o=i.UiHelperUtil.getColorTheme(t);(0,i.initializeTheming)(e,o)}onClose(){this.open=!1,this.classList.remove("open"),this.onScrollUnlock(),a.Pt.hide(),this.onRemoveKeyboardListener()}onOpen(){this.open=!0,this.classList.add("open"),this.onScrollLock(),this.onAddKeyboardListener()}onScrollLock(){let e=document.createElement("style");e.dataset.w3m=l,e.textContent=`
      body {
        touch-action: none;
        overflow: hidden;
        overscroll-behavior: contain;
      }
      w3m-modal {
        pointer-events: auto;
      }
    `,document.head.appendChild(e)}onScrollUnlock(){let e=document.head.querySelector(`style[data-w3m="${l}"]`);e&&e.remove()}onAddKeyboardListener(){this.abortController=new AbortController;let e=this.shadowRoot?.querySelector("wui-card");e?.focus(),window.addEventListener("keydown",t=>{if("Escape"===t.key)this.handleClose();else if("Tab"===t.key){let{tagName:o}=t.target;!o||o.includes("W3M-")||o.includes("WUI-")||e?.focus()}},this.abortController)}onRemoveKeyboardListener(){this.abortController?.abort(),this.abortController=void 0}async onNewAddress(e){let t=a.wE.getPlainAddress(e);this.caipAddress=e,await a.UG.initializeIfEnabled(),(!t||this.enableEmbedded)&&a.W3.close()}onNewNetwork(e){if(!this.caipAddress){this.caipNetwork=e,a.IN.goBack();return}let t=this.caipNetwork?.caipNetworkId?.toString(),o=e?.caipNetworkId?.toString();t&&o&&t!==o&&this.caipNetwork?.name!=="Unknown Network"&&a.IN.goBack(),this.caipNetwork=e}};c.styles=n,d([(0,s.MZ)({type:Boolean})],c.prototype,"enableEmbedded",void 0),d([(0,s.wk)()],c.prototype,"open",void 0),d([(0,s.wk)()],c.prototype,"caipAddress",void 0),d([(0,s.wk)()],c.prototype,"caipNetwork",void 0),d([(0,s.wk)()],c.prototype,"shake",void 0),c=d([(0,i.customElement)("w3m-modal")],c)}}]);
//# sourceMappingURL=1060.38cdac277a0a2e83.js.map