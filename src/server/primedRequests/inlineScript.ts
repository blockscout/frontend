// SPDX-License-Identifier: LicenseRef-Blockscout

// The early-fetch primer that runs in the browser before the JS bundle boots: it fires one
// fetch per primed request and stores the promises in window.__primedFetches, where the
// fetch layer picks them up (src/api/utils/primed-fetch.ts).
//
// It is a function expression that index.ts calls with an Array<PrimedRequestTuple>
// (see types.ts) serialized as JSON.
//
// Kept as a source string rather than a live function so that the copy inlined into the HTML
// by _document (Node runtime) and the copy hashed for the CSP header in the proxy (edge
// runtime) are guaranteed byte-identical — `Function.prototype.toString()` output would
// depend on each bundle's transpilation.
//
// Cookie resolution must produce exactly the headers the client fetch layer would send: the
// 'value' / 'flag' semantics mirror src/api/utils/cookie-headers.ts, and primed-fetch.ts
// double-checks the result at consume time, falling back to a network request on mismatch.
export const PRIMED_FETCH_SCRIPT = `(function(requests){
function getCookie(name){
var item=document.cookie.split('; ').find(function(part){return part.indexOf(name+'=')===0});
if(!item){return}
try{return decodeURIComponent(item.slice(name.length+1))}catch(error){return}
}
window.__primedFetches=new Map(requests.map(function(req){
var headers=Object.assign({},req[1]);
(req[2]||[]).forEach(function(descriptor){
var value=getCookie(descriptor[1]);
if(descriptor[2]==='flag'){if(value==='true'){headers[descriptor[0]]='true'}}
else if(value){headers[descriptor[0]]=value}
});
var promise=fetch(req[0],{headers:headers});
promise.catch(function(){});
return[req[0],{promise:promise,headers:headers}]
}))
})`;
