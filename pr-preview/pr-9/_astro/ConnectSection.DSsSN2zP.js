import{j as e,c as b}from"./clsx.CVpsapxh.js";import{R as P,r as y}from"./index.C4lZkr4h.js";import{C as w}from"./CallToActionButton.BSTSjvK6.js";const _={width:"100vw",position:"relative",left:"50%",right:"50%",marginLeft:"-50vw",marginRight:"-50vw"},D={count:25,speed:1e3,scaling:1,grayscale:!1,filled:!1,className:"flex h-full w-full opacity-25 dark:opacity-15"};function V({title:t,description:r,headingTag:n="h1",actions:l,icon:i,fullBleed:c=!1,fullBleedClassName:f="relative pt-16 md:pt-20 lg:pt-4 mb-8 sm:mb-12",showGlyphField:d=!0}){const m=e.jsxs("div",{className:"hero-container min-h-95 sm:min-h-105 md:min-h-120 w-full bg-transparent flex items-center justify-center relative overflow-hidden py-16 sm:py-20 md:py-24 pt-24 sm:pt-28 md:pt-32",children:[d?e.jsx("div",{className:"glyph-wrapper absolute inset-0 w-full h-full",children:e.jsx(X,{...D})}):null,e.jsxs("div",{className:"relative px-4 sm:px-6 md:px-8 max-w-5xl mx-auto w-full pointer-events-none space-y-6 text-center",children:[i?e.jsx("div",{className:"flex justify-center text-accent-base/80",children:i}):null,t?P.createElement(n,{className:"text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-foreground uppercase"},t):null,r?e.jsx("p",{className:"text-sm sm:text-base md:text-lg lg:text-xl font-light text-color-600 dark:text-color-400 max-w-3xl mx-auto leading-relaxed px-2 sm:px-0",children:r}):null,l&&l.length>0?e.jsx("div",{className:"flex flex-wrap justify-center gap-4",children:l.map(({label:p,href:o,variant:h="primary",indicatorText:a,ariaLabel:s,target:u,rel:g},v)=>e.jsx(w,{href:o,size:"large",variant:h,indicatorText:typeof a=="number"?a.toString():a,ariaLabel:s,target:u,rel:g,children:p},`${o}-${v}`))}):null]}),e.jsx("style",{children:`
          .glyph-wrapper {
            mask-image:
              linear-gradient(
                to right,
                transparent 0%,
                black 10%,
                black 90%,
                transparent 100%
              ),
              linear-gradient(
                to bottom,
                transparent 0%,
                black 15%,
                black 85%,
                transparent 100%
              );
            mask-size: 100% 100%;
            mask-position: center;
            mask-repeat: no-repeat;
            mask-composite: intersect;

            -webkit-mask-image:
              linear-gradient(
                to right,
                transparent 0%,
                black 10%,
                black 90%,
                transparent 100%
              ),
              linear-gradient(
                to bottom,
                transparent 0%,
                black 15%,
                black 85%,
                transparent 100%
              );
            -webkit-mask-size: 100% 100%;
            -webkit-mask-position: center;
            -webkit-mask-repeat: no-repeat;
            -webkit-mask-composite: source-in;
          }

          @supports not (mask-composite: intersect) {
            .glyph-wrapper {
              mask: radial-gradient(
                ellipse 90% 80% at center,
                black 40%,
                transparent 100%
              );
              -webkit-mask: radial-gradient(
                ellipse 90% 80% at center,
                black 40%,
                transparent 100%
              );
            }
          }
        `})]});return c?e.jsx("div",{className:b("w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]",f),style:_,children:m}):m}function T(t){switch(t){case"primary":return 0;case"secondary":return 120;case"tertiary":return 240;default:return 0}}function G(t,r){if(r)switch(t){case"primary":return"#d4d4d4";case"secondary":return"#bdbdbd";case"tertiary":return"#a3a3a3"}switch(t){case"primary":return"#EF6129";case"secondary":return"#FF9E00";case"tertiary":return"#50C4B6"}}function H(t,r){if(r)switch(t){case"primary":return"#d4d4d4";case"secondary":return"#bdbdbd";case"tertiary":return"#a3a3a3"}switch(t){case"primary":return"#EF6129";case"secondary":return"#FF9E00";case"tertiary":return"#50C4B6"}}function U(t,r){const n=["primary","secondary","tertiary"];return Array.from({length:t},(l,i)=>{const c=n[Math.floor(Math.random()*n.length)],f=Math.random()*.2-.05+i/t,d=Math.random()*.2-.05+(t-i-1)/t,m=Math.random()+r,p=Math.random()*2+6,o=Math.random()*5,h=Math.random()*Math.PI*2,a=30+Math.random()*30,s=T(c);return{id:`${i}-${Math.random().toString(36).slice(2)}`,variant:c,baseX:f,baseY:d,scale:m,duration:p,begin:o,angle:h,amplitude:a,rotationDeg:s}})}function X({count:t,speed:r=1e3,scaling:n=1,className:l,grayscale:i=!1,filled:c=!1,svgClass:f,bottomLeft:d}){const m=y.useRef(null),p=y.useRef(null),o=y.useMemo(()=>U(t,n),[t,n]),h=y.useRef({w:0,h:0});return y.useEffect(()=>{const a=m.current;if(!a)return;const s=()=>{const g=a.getBoundingClientRect();h.current={w:g.width,h:g.height}};s();let u=null;return typeof ResizeObserver<"u"?(u=new ResizeObserver(s),u.observe(a)):window.addEventListener("resize",s),()=>{u?u.disconnect():window.removeEventListener("resize",s)}},[]),y.useEffect(()=>{let a=0;const s=performance.now(),u=()=>{const v=(performance.now()-s)/1e3,{w:N,h:L}=h.current,M=p.current;M&&N>0&&L>0&&M.querySelectorAll('[data-glyph="group"]').forEach(k=>{const z=Number(k.getAttribute("data-idx")||"0"),x=o[z];if(!x)return;const R=1/Math.max(r,1)*5,C=v*R+x.begin,S=Math.cos(C+x.angle)*x.amplitude,$=Math.sin(C+x.angle*.75)*x.amplitude*.6,F=x.baseX*N,W=x.baseY*L,B=F+S,A=W+$;k.style.transform=`translate(${B}px, ${A}px) rotate(${x.rotationDeg}deg)`;const E=k.querySelector('[data-glyph="path"]');if(E){const j=x.scale;E.style.transform=`translate(-${j*(37/2)}px, -${j*(45/2)}px) scale(${j})`}}),a=requestAnimationFrame(u)};return a=requestAnimationFrame(u),()=>cancelAnimationFrame(a)},[o,r]),e.jsxs("div",{ref:m,className:`overflow-hidden relative ${l||""}`,children:[e.jsx("svg",{ref:p,width:"100%",height:"100%",version:"1.1",xmlns:"http://www.w3.org/2000/svg",className:`absolute bg-transparent ${f||""}`,children:o.map((a,s)=>{const u=G(a.variant,i),g=c?H(a.variant,i):"none";return e.jsx("g",{"data-glyph":"group","data-idx":s,"data-variant":a.variant,style:{willChange:"transform",transform:`translate(0px, 0px) rotate(${a.rotationDeg}deg)`},children:e.jsx("path",{"data-glyph":"path",d:"M0.55,10.626L18.002,0.55L35.456,10.627L35.472,30.771L24.893,36.879L29.541,39.562C29.543,39.564 29.546,39.565 29.548,39.567L30.716,40.241L23.83,44.202L14.575,38.873L0.55,30.778L0.55,10.626Z",fill:g,fillOpacity:c?.5:0,stroke:u,strokeWidth:1,style:{willChange:"transform",pointerEvents:"visibleFill"}})},a.id)})}),d?e.jsx("div",{className:"absolute z-10 bottom-4 left-6 flex flex-row items-center gap-1 drop-shadow-md",children:d}):null]})}function Y({title:t,subtitle:r,image:n,variant:l="primary",id:i,ariaLabel:c,className:f="",html:d,children:m}){const p={primary:"text-accent-two",secondary:"text-accent-one",tertiary:"text-accent-three",default:"text-accent-base"}[l]||"text-accent-base",o={primary:"text-accent-base/70",secondary:"text-accent-base/70",tertiary:"text-accent-base/70",default:"text-accent-base/70"}[l]||"text-accent-base/70",h=n?"":"py-8 sm:py-10",a=n?"py-8 sm:py-10":"",s=i??t;return e.jsxs("section",{className:b(h,f),id:s,"aria-label":c||t,children:[n&&t?e.jsx("div",{className:"relative w-full h-64 sm:h-80 mb-6 sm:mb-8 rounded-t-lg overflow-hidden",children:e.jsxs("a",{href:`#${s}`,className:"group block w-full h-full",children:[e.jsx("img",{src:n.src,alt:n.alt||t,className:"w-full h-full object-cover transition-transform duration-200 group-hover:scale-105",loading:"lazy",decoding:"async"}),e.jsx("div",{className:"absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent"}),e.jsxs("div",{className:"absolute bottom-0 left-0 p-4 sm:p-6",children:[e.jsxs("h2",{className:b("title text-xl sm:text-2xl lg:text-3xl cursor-pointer transition-colors duration-200 relative",p),children:[e.jsx("svg",{className:"absolute -right-6 top-[55%] transform -translate-y-1/2 w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity duration-200",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24","aria-hidden":"true",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"})}),t]}),r&&e.jsx("p",{className:"text-base sm:text-lg text-white/90 mt-2",children:r})]})]})}):t?e.jsxs("div",{className:"text-center mb-6 sm:mb-8",children:[e.jsx("a",{href:`#${s}`,className:"group inline-block",children:e.jsxs("h2",{className:b("title mb-4 text-lg sm:text-xl cursor-pointer transition-colors duration-200 relative",p),children:[e.jsx("svg",{className:"absolute -left-6 top-[55%] transform -translate-y-1/2 w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24","aria-hidden":"true",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"})}),t]})}),r&&e.jsx("p",{className:b("text-base sm:text-lg",o),children:r})]}):null,d?e.jsx("div",{className:a,dangerouslySetInnerHTML:{__html:d}}):e.jsx("div",{className:a,children:m})]})}function Z({id:t="connect",title:r="Connect With Us",subtitle:n="Join our community and stay informed about our initiatives",ariaLabel:l,className:i,gridClassName:c,donateHref:f="https://donate.stripe.com/cNiaEX4ZE07R8Wj8Yva7C00",volunteerHref:d="https://forms.gle/5iiaThSsGUMzXWsu6",mailingListHref:m="https://forms.gle/5iiaThSsGUMzXWsu6",donateText:p="Make a Donation",volunteerText:o="Volunteer",mailingListText:h="Join the Mailing List"}){return e.jsx(Y,{id:t,title:r,subtitle:n,ariaLabel:l||r,className:i,children:e.jsxs("div",{className:c??"grid grid-cols-1 md:grid-cols-3 grid-rows-3 md:grid-rows-1 gap-10 bg-accent-base/10 p-10 rounded-lg backdrop-blur-lg",children:[e.jsx(w,{href:f,size:"large",variant:"primary",fullWidth:!0,ariaLabel:"Make a donation",children:p}),e.jsx(w,{href:d,size:"large",variant:"secondary",fullWidth:!0,ariaLabel:"Volunteer with Semio Community",children:o}),e.jsx(w,{href:m,size:"large",variant:"tertiary",fullWidth:!0,ariaLabel:"Join the Semio Community mailing list",children:h})]})})}export{Z as C,V as H};
//# sourceMappingURL=ConnectSection.DSsSN2zP.js.map
