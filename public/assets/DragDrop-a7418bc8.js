import{U as a,b as e,r as d,j as t,B as c,n as p,aI as h}from"./index-b05c3593.js";import{E as x}from"./stylesDrag-a0f829b9.js";import{U as u}from"./index-bf7d37e3.js";/* empty css               */const g=a(e("path",{d:"M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM19 18H6c-2.21 0-4-1.79-4-4 0-2.05 1.53-3.76 3.56-3.97l1.07-.11.5-.95C8.08 7.14 9.94 6 12 6c2.62 0 4.88 1.86 5.39 4.43l.3 1.5 1.53.11c1.56.1 2.78 1.41 2.78 2.96 0 1.65-1.35 3-3 3zM8 13h2.55v3h2.9v-3H16l-4-4z"}),"CloudUploadOutlined"),C=["JPEG","PNG","JPG","WEBP"],D=({formState:i,onInputChange:f,onImageChange:l,required:o=!1})=>{const[y,r]=d.useState(null),s=n=>{l(n),r(n)};return e("div",{style:{display:"flex",flexDirection:"column",alignItems:"center"},children:i.imgDoc?t("div",{style:{flex:1,position:"relative",border:"2px dashed #C7CBCE",maxWidth:"100%",minHeight:"250px",minWidth:"280px",display:"flex",alignItems:"center",justifyContent:"center",borderRadius:"8px",flexDirection:"column",padding:"10px",overflow:"hidden"},children:[e(u,{children:e("img",{style:{maxWidth:"100%",maxHeight:"250px"},src:URL.createObjectURL(i.imgDoc)})}),e(c,{sx:{m:1,top:0,right:0,background:"white",height:"30px",width:"30px",borderRadius:"50px",display:"grid",placeContent:"center",position:"absolute"},children:e(p,{onClick:()=>s(null),children:e(h,{sx:{color:"black"}})})})]}):e(x,{handleChange:l,name:"file",types:C,label:"Arrastra o elige un archivo",style:{width:"100%"},classes:"Box1",hoverTitle:"Suelta el archivo",required:o,children:t("div",{style:{flex:1,border:"2px dashed #C7CBCE",width:"100%",height:"250px",minWidth:"280px",display:"flex",alignItems:"center",justifyContent:"center",borderRadius:"8px",flexDirection:"column"},children:[e(g,{sx:{width:"100px",height:"auto",color:"#C7CBCE"}}),t("div",{style:{display:"flex",justifyContent:"center",gap:"8px",alignItems:"center",padding:"20px"},children:[t("p",{style:m,children:["Arrastra y suelta un archivo o",e("a",{style:{fontWeight:"bold",borderRadius:"4px",color:"#33CEFF",padding:"0px"},children:" Elige un archivo"})]}),":"]})]})})})},m={margin:0,fontSize:"16px",color:"#C7CBCE"};export{D};