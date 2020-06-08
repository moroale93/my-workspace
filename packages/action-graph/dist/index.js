!function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(r,o,function(t){return e[t]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s="/7QA")}({"/7QA":function(e,t,n){"use strict";n.r(t);function r(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}var o=function(){function e(){var t,n,r;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),r={},(n="tags")in(t=this)?Object.defineProperty(t,n,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[n]=r}var t,n,o;return t=e,(n=[{key:"getTag",value:function(e){return this.tags[e]||(this.tags[e]=[]),this.tags[e]}},{key:"addToTags",value:function(e,t){var n=this;e.forEach((function(e){return n.getTag(e).push(t)}))}},{key:"removeFromTags",value:function(e,t){var n=this;e.forEach((function(e){var r=n.getTag(e);n.tags[e]=r.filter((function(e){return e!==t}))}))}}])&&r(t.prototype,n),o&&r(t,o),e}();function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function i(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function u(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var c=function(){function e(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),u(this,"tagManager",void 0),u(this,"actions",{}),this.tagManager=new o}var t,n,r;return t=e,r=[{key:"getInstance",value:function(){return e.instance||(e.instance=new e),e.instance}}],(n=[{key:"addAction",value:function(e){var t=this;this.actions[e.id]=e,this.tagManager.addToTags(e.tags,e.id),e.subject.subscribe({complete:function(){return t.removeAction(e.id)}})}},{key:"removeAction",value:function(e){this.tagManager.removeFromTags(this.getAction(e).tags,e),delete this.actions[e]}},{key:"getAction",value:function(e){return this.actions[e]}},{key:"getActionIdsOfTags",value:function(e){var t=this;return Object.keys(e.map((function(e){return t.tagManager.getTag(e)})).reduce((function(e,t){var n=function(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){u(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}({},e);return t.forEach((function(e){return n[e]=!0})),n}),{}))}},{key:"reset",value:function(){delete e.instance}}])&&i(t.prototype,n),r&&i(t,r),e}();u(c,"instance",void 0);var f;!function(e){e.ERROR="error",e.PENDING="pending",e.COMPLETE="complete"}(f||(f={}));"undefined"!=typeof crypto&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto)||"undefined"!=typeof msCrypto&&"function"==typeof msCrypto.getRandomValues&&msCrypto.getRandomValues.bind(msCrypto),new Uint8Array(16);for(var s=[],l=0;l<256;++l)s.push((l+256).toString(16).substr(1))}});
//# sourceMappingURL=index.js.map