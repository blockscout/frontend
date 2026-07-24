// SPDX-License-Identifier: LicenseRef-Blockscout

// The early-fetch primer that runs in the browser before the JS bundle boots: it fires one
// fetch per primed request and stores the promises in window.__primedFetches, where the
// fetch layer picks them up (src/api/utils/primed-fetch.ts).
//
// It is a function expression that index.ts calls with a PrimerPayload (see types.ts)
// serialized as JSON.
//
// Kept as a source string rather than a live function so that the copy inlined into the HTML
// by _document (Node runtime) and the copy hashed for the CSP header in the proxy (edge
// runtime) are guaranteed byte-identical — `Function.prototype.toString()` output would
// depend on each bundle's transpilation.
//
// Request-specific values are resolved here, in the browser, so the script stays static per
// config (its CSP hash is computed once at startup):
//  - route params come from `location.pathname`, matched against the page's route pattern;
//    substitution uses split/join, NOT `String.prototype.replaceAll(str, value)` — a `$` in a
//    path segment would be interpreted as a replacement pattern. A request whose params can't
//    be resolved is simply not primed (the app falls back to a normal fetch).
//  - forwarded query params come from `location.search`: the values a page copies from the URL
//    into a list request (filters, sorting). Both sides serialize through `URLSearchParams`, so
//    equal decoded values encode identically and the query string byte-matches; a URL value the
//    client would reject just yields a primed URL nobody looks up (one wasted request).
//  - the tab gate compares the active tab (the `tab` query param, or the page's default tab
//    when the param is absent) against the tabs a request is restricted to.
//  - cookie-derived headers must match the client fetch layer exactly: the 'value' / 'flag'
//    semantics mirror src/api/utils/cookie-headers.ts, and primed-fetch.ts double-checks the
//    result at consume time, falling back to a network request on mismatch.
export const PRIMED_FETCH_SCRIPT = `(function(payload){
function getCookie(name){
var item=document.cookie.split('; ').find(function(part){return part.indexOf(name+'=')===0});
if(!item){return}
try{return decodeURIComponent(item.slice(name.length+1))}catch(error){return}
}
var activeTab=new URLSearchParams(location.search).get('tab')||payload.defaultTab;
var patternParts=payload.route.split('/');
var pathParts=location.pathname.split('/');
var routeValues=patternParts.length===pathParts.length?{}:null;
if(routeValues){
patternParts.forEach(function(part,index){
if(part.charAt(0)==='['){routeValues[part.slice(1,-1)]=pathParts[index]}
else if(part!==pathParts[index]){routeValues=null}
});
}
var entries=payload.requests.map(function(req){
if(req[5]&&(!activeTab||req[5].indexOf(activeTab)===-1)){return null}
var url=req[0];
var routeParams=req[3]||[];
for(var i=0;i<routeParams.length;i++){
var value=routeValues&&routeValues[routeParams[i][1]];
if(!value){return null}
url=url.split(routeParams[i][0]).join(value)
}
if(req[4]){
var currentSearch=new URLSearchParams(location.search);
var extraSearch=new URLSearchParams();
req[4].forEach(function(name){
var searchValue=currentSearch.get(name);
if(searchValue){extraSearch.append(name,searchValue)}
});
var extraStr=extraSearch.toString();
if(extraStr){url+=(url.indexOf('?')===-1?'?':'&')+extraStr}
}
var headers=Object.assign({},req[1]);
(req[2]||[]).forEach(function(descriptor){
var value=getCookie(descriptor[1]);
if(descriptor[2]==='flag'){if(value==='true'){headers[descriptor[0]]='true'}}
else if(value){headers[descriptor[0]]=value}
});
var promise=fetch(url,{headers:headers});
promise.catch(function(){});
return[url,{promise:promise,headers:headers}]
});
window.__primedFetches=new Map(entries.filter(function(entry){return entry!==null}))
})`;
