import{j as e,c as b}from"./NavIconButton.D3tvb9qx.js";import{R as P,r as y}from"./index.CfEtWYTh.js";import{C as w}from"./CallToActionButton.BAHfFpPq.js";function _({title:t,subtitle:r,image:n,variant:l="primary",id:i,ariaLabel:o,className:u="",html:c,children:h}){const x={primary:"text-accent-two",secondary:"text-accent-one",tertiary:"text-accent-three",default:"text-accent-base"}[l]||"text-accent-base",m={primary:"text-accent-base/70",secondary:"text-accent-base/70",tertiary:"text-accent-base/70",default:"text-accent-base/70"}[l]||"text-accent-base/70",f=n?"":"py-8 sm:py-10",a=n?"py-8 sm:py-10":"",s=i??t;return e.jsxs("section",{className:b(f,u),id:s,"aria-label":o||t,children:[n&&t?e.jsx("div",{className:"relative w-full h-64 sm:h-80 mb-6 sm:mb-8 rounded-t-lg overflow-hidden",children:e.jsxs("a",{href:`#${s}`,className:"group block w-full h-full",children:[e.jsx("img",{src:n.src,alt:n.alt||t,className:"w-full h-full object-cover transition-transform duration-200 group-hover:scale-105",loading:"lazy",decoding:"async"}),e.jsx("div",{className:"absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent"}),e.jsxs("div",{className:"absolute bottom-0 left-0 p-4 sm:p-6",children:[e.jsxs("h2",{className:b("title text-xl sm:text-2xl lg:text-3xl cursor-pointer transition-colors duration-200 relative",x),children:[e.jsx("svg",{className:"absolute -right-6 top-[55%] transform -translate-y-1/2 w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity duration-200",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24","aria-hidden":"true",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"})}),t]}),r&&e.jsx("p",{className:"text-base sm:text-lg text-white/90 mt-2",children:r})]})]})}):t?e.jsxs("div",{className:"text-center mb-6 sm:mb-8",children:[e.jsx("a",{href:`#${s}`,className:"group inline-block",children:e.jsxs("h2",{className:b("title mb-4 text-lg sm:text-xl cursor-pointer transition-colors duration-200 relative",x),children:[e.jsx("svg",{className:"absolute -left-6 top-[55%] transform -translate-y-1/2 w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24","aria-hidden":"true",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"})}),t]})}),r&&e.jsx("p",{className:b("text-base sm:text-lg",m),children:r})]}):null,c?e.jsx("div",{className:a,dangerouslySetInnerHTML:{__html:c}}):e.jsx("div",{className:a,children:h})]})}function D({id:t="connect",title:r="Connect With Us",subtitle:n="Join our community and stay informed about our initiatives",ariaLabel:l,className:i,gridClassName:o,sectionVariant:u,children:c}){return e.jsx(_,{id:t,title:r,subtitle:n,ariaLabel:l||r,variant:u,className:i,children:e.jsx("div",{className:o??"grid grid-cols-1 md:grid-cols-3 grid-rows-3 md:grid-rows-1 gap-10 bg-accent-base/10 p-10 rounded-lg backdrop-blur-lg",children:c})})}const T={width:"100vw",position:"relative",left:"50%",right:"50%",marginLeft:"-50vw",marginRight:"-50vw"},G={count:25,speed:1e3,scaling:1,grayscale:!1,filled:!1,className:"flex h-full w-full opacity-25 dark:opacity-15"};function Z({title:t,description:r,headingTag:n="h1",actions:l,icon:i,fullBleed:o=!1,fullBleedClassName:u="relative pt-16 md:pt-20 lg:pt-4 mb-8 sm:mb-12",showGlyphField:c=!0}){const h=e.jsxs("div",{className:"hero-container min-h-95 sm:min-h-105 md:min-h-120 w-full bg-transparent flex items-center justify-center relative overflow-hidden py-16 sm:py-20 md:py-24 pt-24 sm:pt-28 md:pt-32",children:[c?e.jsx("div",{className:"glyph-wrapper absolute inset-0 w-full h-full",children:e.jsx(q,{...G})}):null,e.jsxs("div",{className:"relative px-4 sm:px-6 md:px-8 max-w-5xl mx-auto w-full pointer-events-none space-y-6 text-center",children:[i?e.jsx("div",{className:"flex justify-center text-accent-base/80",children:i}):null,t?P.createElement(n,{className:"text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-foreground uppercase"},t):null,r?e.jsx("p",{className:"text-sm sm:text-base md:text-lg lg:text-xl font-light text-color-600 dark:text-color-400 max-w-3xl mx-auto leading-relaxed px-2 sm:px-0",children:r}):null,l&&l.length>0?e.jsx("div",{className:"flex flex-wrap justify-center gap-4",children:l.map(({label:x,href:m,variant:f="primary",indicatorText:a,ariaLabel:s,target:d,rel:g},v)=>e.jsx(w,{href:m,size:"large",variant:f,indicatorText:typeof a=="number"?a.toString():a,ariaLabel:s,target:d,rel:g,children:x},`${m}-${v}`))}):null]}),e.jsx("style",{children:`
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
        `})]});return o?e.jsx("div",{className:b("w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]",u),style:T,children:h}):h}function H(t){switch(t){case"primary":return 0;case"secondary":return 120;case"tertiary":return 240;default:return 0}}function U(t,r){if(r)switch(t){case"primary":return"#d4d4d4";case"secondary":return"#bdbdbd";case"tertiary":return"#a3a3a3"}switch(t){case"primary":return"#EF6129";case"secondary":return"#FF9E00";case"tertiary":return"#50C4B6"}}function X(t,r){if(r)switch(t){case"primary":return"#d4d4d4";case"secondary":return"#bdbdbd";case"tertiary":return"#a3a3a3"}switch(t){case"primary":return"#EF6129";case"secondary":return"#FF9E00";case"tertiary":return"#50C4B6"}}function Y(t,r){const n=["primary","secondary","tertiary"];return Array.from({length:t},(l,i)=>{const o=n[Math.floor(Math.random()*n.length)],u=Math.random()*.2-.05+i/t,c=Math.random()*.2-.05+(t-i-1)/t,h=Math.random()+r,x=Math.random()*2+6,m=Math.random()*5,f=Math.random()*Math.PI*2,a=30+Math.random()*30,s=H(o);return{id:`${i}-${Math.random().toString(36).slice(2)}`,variant:o,baseX:u,baseY:c,scale:h,duration:x,begin:m,angle:f,amplitude:a,rotationDeg:s}})}function q({count:t,speed:r=1e3,scaling:n=1,className:l,grayscale:i=!1,filled:o=!1,svgClass:u,bottomLeft:c}){const h=y.useRef(null),x=y.useRef(null),m=y.useMemo(()=>Y(t,n),[t,n]),f=y.useRef({w:0,h:0});return y.useEffect(()=>{const a=h.current;if(!a)return;const s=()=>{const g=a.getBoundingClientRect();f.current={w:g.width,h:g.height}};s();let d=null;return typeof ResizeObserver<"u"?(d=new ResizeObserver(s),d.observe(a)):window.addEventListener("resize",s),()=>{d?d.disconnect():window.removeEventListener("resize",s)}},[]),y.useEffect(()=>{let a=0;const s=performance.now(),d=()=>{const v=(performance.now()-s)/1e3,{w:N,h:L}=f.current,M=x.current;M&&N>0&&L>0&&M.querySelectorAll('[data-glyph="group"]').forEach(k=>{const S=Number(k.getAttribute("data-idx")||"0"),p=m[S];if(!p)return;const z=1/Math.max(r,1)*5,C=v*z+p.begin,R=Math.cos(C+p.angle)*p.amplitude,$=Math.sin(C+p.angle*.75)*p.amplitude*.6,F=p.baseX*N,W=p.baseY*L,B=F+R,A=W+$;k.style.transform=`translate(${B}px, ${A}px) rotate(${p.rotationDeg}deg)`;const E=k.querySelector('[data-glyph="path"]');if(E){const j=p.scale;E.style.transform=`translate(-${j*(37/2)}px, -${j*(45/2)}px) scale(${j})`}}),a=requestAnimationFrame(d)};return a=requestAnimationFrame(d),()=>cancelAnimationFrame(a)},[m,r]),e.jsxs("div",{ref:h,className:`overflow-hidden relative ${l||""}`,children:[e.jsx("svg",{ref:x,width:"100%",height:"100%",version:"1.1",xmlns:"http://www.w3.org/2000/svg",className:`absolute bg-transparent ${u||""}`,children:m.map((a,s)=>{const d=U(a.variant,i),g=o?X(a.variant,i):"none";return e.jsx("g",{"data-glyph":"group","data-idx":s,"data-variant":a.variant,style:{willChange:"transform",transform:`translate(0px, 0px) rotate(${a.rotationDeg}deg)`},children:e.jsx("path",{"data-glyph":"path",d:"M0.55,10.626L18.002,0.55L35.456,10.627L35.472,30.771L24.893,36.879L29.541,39.562C29.543,39.564 29.546,39.565 29.548,39.567L30.716,40.241L23.83,44.202L14.575,38.873L0.55,30.778L0.55,10.626Z",fill:g,fillOpacity:o?.5:0,stroke:d,strokeWidth:1,style:{willChange:"transform",pointerEvents:"visibleFill"}})},a.id)})}),c?e.jsx("div",{className:"absolute z-10 bottom-4 left-6 flex flex-row items-center gap-1 drop-shadow-md",children:c}):null]})}function K(t){return e.jsxs(D,{...t,children:[e.jsx(w,{href:"https://donate.stripe.com/cNiaEX4ZE07R8Wj8Yva7C00",size:"large",variant:"primary",fullWidth:!0,ariaLabel:"Make a donation",children:"Make a Donation"}),e.jsx(w,{href:"https://forms.gle/5iiaThSsGUMzXWsu6",size:"large",variant:"secondary",fullWidth:!0,ariaLabel:"Volunteer with Semio Community",children:"Volunteer"}),e.jsx(w,{href:"https://forms.gle/5iiaThSsGUMzXWsu6",size:"large",variant:"tertiary",fullWidth:!0,ariaLabel:"Join the Semio Community mailing list",children:"Join the Mailing List"})]})}export{K as C,Z as H};
//# sourceMappingURL=ConnectSection.B1-iVHRc.js.map
