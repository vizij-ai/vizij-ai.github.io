import{r as m,R as f}from"./index.C4lZkr4h.js";var l={exports:{}},u={};/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var c;function R(){if(c)return u;c=1;var r=Symbol.for("react.transitional.element"),o=Symbol.for("react.fragment");function n(t,e,s){var i=null;if(s!==void 0&&(i=""+s),e.key!==void 0&&(i=""+e.key),"key"in e){s={};for(var a in e)a!=="key"&&(s[a]=e[a])}else s=e;return e=s.ref,{$$typeof:r,type:t,key:i,ref:e!==void 0?e:null,props:s}}return u.Fragment=o,u.jsx=n,u.jsxs=n,u}var x;function p(){return x||(x=1,l.exports=R()),l.exports}var h=p();const d=m.forwardRef((r,o)=>{const{alt:n,color:t="currentColor",size:e="1em",mirrored:s=!1,children:i,...a}=r;return f.createElement("svg",{ref:o,xmlns:"http://www.w3.org/2000/svg",width:e,height:e,color:t,fill:"none",viewBox:"0 0 24 24",transform:s?"scale(-1, 1)":void 0,...a},!!n&&f.createElement("title",null,n),i)});d.displayName="IconBase";function v(r){var o,n,t="";if(typeof r=="string"||typeof r=="number")t+=r;else if(typeof r=="object")if(Array.isArray(r)){var e=r.length;for(o=0;o<e;o++)r[o]&&(n=v(r[o]))&&(t&&(t+=" "),t+=n)}else for(n in r)r[n]&&(t&&(t+=" "),t+=n);return t}function j(){for(var r,o,n=0,t="",e=arguments.length;n<e;n++)(r=arguments[n])&&(o=v(r))&&(t&&(t+=" "),t+=o);return t}export{j as c,h as j,d as m};
//# sourceMappingURL=clsx.CVpsapxh.js.map
