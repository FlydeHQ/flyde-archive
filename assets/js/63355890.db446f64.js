"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[9995],{35318:function(e,t,n){n.d(t,{Zo:function(){return l},kt:function(){return f}});var r=n(27378);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var c=r.createContext({}),p=function(e){var t=r.useContext(c),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},l=function(e){var t=p(e.components);return r.createElement(c.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},d=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,o=e.originalType,c=e.parentName,l=s(e,["components","mdxType","originalType","parentName"]),d=p(n),f=a,m=d["".concat(c,".").concat(f)]||d[f]||u[f]||o;return n?r.createElement(m,i(i({ref:t},l),{},{components:n})):r.createElement(m,i({ref:t},l))}));function f(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=n.length,i=new Array(o);i[0]=d;var s={};for(var c in t)hasOwnProperty.call(t,c)&&(s[c]=t[c]);s.originalType=e,s.mdxType="string"==typeof e?e:a,i[1]=s;for(var p=2;p<o;p++)i[p]=n[p];return r.createElement.apply(null,i)}return r.createElement.apply(null,n)}d.displayName="MDXCreateElement"},95570:function(e,t,n){n.r(t),n.d(t,{assets:function(){return l},contentTitle:function(){return c},default:function(){return f},frontMatter:function(){return s},metadata:function(){return p},toc:function(){return u}});var r=n(52685),a=n(1244),o=(n(27378),n(35318)),i=["components"],s={sidebar_position:6},c="Creating New Code Parts",p={unversionedId:"code-parts",id:"code-parts",title:"Creating New Code Parts",description:"While Flyde is a great tool for creating flows, sometimes you need to do something that is not possible with the built-in components.",source:"@site/docs/code-parts.md",sourceDirName:".",slug:"/code-parts",permalink:"/docs/code-parts",draft:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/code-parts.md",tags:[],version:"current",sidebarPosition:6,frontMatter:{sidebar_position:6},sidebar:"tutorialSidebar",previous:{title:"Lifecycle of a Part",permalink:"/docs/lifecycle"},next:{title:"Installing/Publishing Packages",permalink:"/docs/packages"}},l={},u=[{value:"Example",id:"example",level:2}],d={toc:u};function f(e){var t=e.components,n=(0,a.Z)(e,i);return(0,o.kt)("wrapper",(0,r.Z)({},d,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"creating-new-code-parts"},"Creating New Code Parts"),(0,o.kt)("p",null,"While Flyde is a great tool for creating flows, sometimes you need to do something that is not possible with the built-in components.\nCode parts allow you to create custom components using TypeScript or JavaScript. Inside Code parts you can use any library you want."),(0,o.kt)("p",null,"To create a new code part, you need to:"),(0,o.kt)("ol",null,(0,o.kt)("li",{parentName:"ol"},"Create a new file ending with ",(0,o.kt)("inlineCode",{parentName:"li"},".flyde.ts")," (or ",(0,o.kt)("inlineCode",{parentName:"li"},".flyde.js")," if you prefer JavaScript)"),(0,o.kt)("li",{parentName:"ol"},"Export an object that adheres to the ",(0,o.kt)("a",{parentName:"li",href:"/docs/api-reference/interfaces/CodePart"},"CodePart")," interface. Actually, you can return as many code parts as you want from a single file")),(0,o.kt)("p",null,"The ",(0,o.kt)("inlineCode",{parentName:"p"},".flyde.[j|t]s"),' ending hints the Flyde editor to look for code parts in this file, and suggest them inside the "add part" menu.'),(0,o.kt)("h2",{id:"example"},"Example"),(0,o.kt)("p",null,"Let's say we want create a scraping part that uses ",(0,o.kt)("a",{parentName:"p",href:"https://www.npmjs.com/package/scrape-it"},"Scrape-it"),". We can create a new file called ",(0,o.kt)("inlineCode",{parentName:"p"},"scrape-it.flyde.ts")," and add the following code:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts"},'import { CodePart } from "@flyde/core";\nimport scrapeIt from "scrape-it";\n\nexport const scrapeItPart: CodePart = {\n  name: "Scrape It",\n  description: "Scrapes a website",\n  inputs: {\n    url: {\n      type: "string",\n      description: "The URL to scrape",\n    },\n    options: {\n        type: "object",\n        description: "The options to pass to scrape-it",\n    }\n  },\n  outputs: {\n    data: {\n      type: "object",\n      description: "The scraped data",\n    },\n  },\n  async fn(inputs) {\n    const data = await scrapeIt(inputs.url, inputs.options);\n\n    return {\n      data,\n    };\n  },\n};\n')),(0,o.kt)("p",null,"Then, you should be able to use it in your flows!"))}f.isMDXComponent=!0}}]);