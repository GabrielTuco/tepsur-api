import{Z as N,Y as U,bJ as D,F as v,a0 as c,a1 as o,bK as M,r as z,a2 as F,a3 as I,b as g,a4 as K,a5 as j}from"./index-b05c3593.js";function E(r){return N("MuiCircularProgress",r)}U("MuiCircularProgress",["root","determinate","indeterminate","colorPrimary","colorSecondary","svg","circle","circleDeterminate","circleIndeterminate","circleDisableShrink"]);const W=["className","color","disableShrink","size","style","thickness","value","variant"];let l=r=>r,P,S,b,$;const a=44,Z=D(P||(P=l`
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
`)),B=D(S||(S=l`
  0% {
    stroke-dasharray: 1px, 200px;
    stroke-dashoffset: 0;
  }

  50% {
    stroke-dasharray: 100px, 200px;
    stroke-dashoffset: -15px;
  }

  100% {
    stroke-dasharray: 100px, 200px;
    stroke-dashoffset: -125px;
  }
`)),G=r=>{const{classes:e,variant:s,color:t,disableShrink:d}=r,u={root:["root",s,`color${c(t)}`],svg:["svg"],circle:["circle",`circle${c(s)}`,d&&"circleDisableShrink"]};return j(u,E,e)},J=v("span",{name:"MuiCircularProgress",slot:"Root",overridesResolver:(r,e)=>{const{ownerState:s}=r;return[e.root,e[s.variant],e[`color${c(s.color)}`]]}})(({ownerState:r,theme:e})=>o({display:"inline-block"},r.variant==="determinate"&&{transition:e.transitions.create("transform")},r.color!=="inherit"&&{color:(e.vars||e).palette[r.color].main}),({ownerState:r})=>r.variant==="indeterminate"&&M(b||(b=l`
      animation: ${0} 1.4s linear infinite;
    `),Z)),L=v("svg",{name:"MuiCircularProgress",slot:"Svg",overridesResolver:(r,e)=>e.svg})({display:"block"}),T=v("circle",{name:"MuiCircularProgress",slot:"Circle",overridesResolver:(r,e)=>{const{ownerState:s}=r;return[e.circle,e[`circle${c(s.variant)}`],s.disableShrink&&e.circleDisableShrink]}})(({ownerState:r,theme:e})=>o({stroke:"currentColor"},r.variant==="determinate"&&{transition:e.transitions.create("stroke-dashoffset")},r.variant==="indeterminate"&&{strokeDasharray:"80px, 200px",strokeDashoffset:0}),({ownerState:r})=>r.variant==="indeterminate"&&!r.disableShrink&&M($||($=l`
      animation: ${0} 1.4s ease-in-out infinite;
    `),B)),V=z.forwardRef(function(e,s){const t=F({props:e,name:"MuiCircularProgress"}),{className:d,color:u="primary",disableShrink:_=!1,size:m=40,style:R,thickness:i=3.6,value:h=0,variant:k="indeterminate"}=t,w=I(t,W),n=o({},t,{color:u,disableShrink:_,size:m,thickness:i,value:h,variant:k}),f=G(n),p={},C={},x={};if(k==="determinate"){const y=2*Math.PI*((a-i)/2);p.strokeDasharray=y.toFixed(3),x["aria-valuenow"]=Math.round(h),p.strokeDashoffset=`${((100-h)/100*y).toFixed(3)}px`,C.transform="rotate(-90deg)"}return g(J,o({className:K(f.root,d),style:o({width:m,height:m},C,R),ownerState:n,ref:s,role:"progressbar"},x,w,{children:g(L,{className:f.svg,ownerState:n,viewBox:`${a/2} ${a/2} ${a} ${a}`,children:g(T,{className:f.circle,style:p,ownerState:n,cx:a,cy:a,r:(a-i)/2,fill:"none",strokeWidth:i})})}))}),q=V;export{q as C};
