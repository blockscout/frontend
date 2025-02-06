(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[7513],{47513:(t,e,r)=>{let o=r(55459),l=r(6269),n=r(23722),i=()=>Math.floor(Math.random()*Date.now());t.exports=(t,e,r)=>{let s=l(o(t)%360,1,.5),a=n(s[0][0],s[0][1],s[0][2]),h=n(s[1][0],s[1][1],s[1][2]),d=`rgb(${a[0]}, ${a[1]}, ${a[2]})`,x=`rgb(${h[0]}, ${h[1]}, ${h[2]})`,c=i(),p="circle"===r?`<circle id="Circle" fill="url(#${c})" cx="40" cy="40" r="40" />`:`<rect id="Rectangle" fill="url(#${c})" x="0" y="0" width="80" height="80"></rect>`;return`<?xml version="1.0" encoding="UTF-8"?>
<svg ${void 0!=e?`width="${e}px" height="${e}px"`:""} viewBox="0 0 80 80" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient x1="0%" y1="0%" x2="100%" y2="100%" id="${c}">
      <stop stop-color="${d}" offset="0%"></stop>
      <stop stop-color="${x}" offset="100%"></stop>
    </linearGradient>
  </defs>
  <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
    ${p}
  </g>
</svg>`}},23722:t=>{let e=(t,e,r)=>(r<0&&(r+=1),r>1&&(r-=1),r<1/6)?t+(e-t)*6*r:r<.5?e:r<2/3?t+(e-t)*(2/3-r)*6:t;t.exports=(t,r,o)=>{let l,n,i;if(t/=360,0==r)l=n=i=o;else{let s=o<.5?o*(1+r):o+r-o*r,a=2*o-s;l=e(a,s,t+1/3),n=e(a,s,t),i=e(a,s,t-1/3)}return[Math.max(0,Math.min(Math.round(255*l),255)),Math.max(0,Math.min(Math.round(255*n),255)),Math.max(0,Math.min(Math.round(255*i),255))]}},6269:t=>{t.exports=(t,e,r)=>[[t,e,r],[(t+120)%360,e,r],[(t+240)%360,e,r]]},55459:t=>{"use strict";t.exports=function(t){for(var e=5381,r=t.length;r;)e=33*e^t.charCodeAt(--r);return e>>>0}}}]);
//# sourceMappingURL=7513.9bc71102cc93a6e3.js.map