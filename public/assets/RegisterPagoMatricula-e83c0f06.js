import{g as P,ah as y,G as S,b as t,j as a,l as i,W as D,T as n,q as b}from"./index-b05c3593.js";import{P as k}from"./Page-87bac860.js";import{S as v}from"./Step3-ca5f4f1f.js";import{u as j}from"./useMatricula-d95bae7c.js";import"./SelectCustom-ab67c468.js";import"./MenuItem-d8a67f6c.js";import"./DragDrop-a7418bc8.js";import"./stylesDrag-a0f829b9.js";import"./index-bf7d37e3.js";/* empty css               */import"./TextfieldsTools-ddad1e93.js";import"./CircularProgress-eeae7465.js";import"./InputAdornment-b1693cda.js";import"./schedule.service-5bfabb81.js";import"./GlobalAlerts-e291f7f6.js";import"./specialization.service-3d04622c.js";import"./careers.service-c54b684b.js";import"./utilities-59a1cf49.js";import"./Tooltip-8a46e05f.js";const K=({toggleDrawer:s})=>{const{user:C,isLoading:L,token:c}=P(e=>e.user),l={token:c,tipoPago:"",nroDocu:"",entidad:"",monto:0,imgDoc:null,horaPago:"00:00",fechaPago:""},{formState:m,onInputChange:p,onImageChange:g,tipoPago:u,onRegisterPago:d}=j(l),{id:o}=y(),h=S(),f=new URLSearchParams(h.search),r=JSON.parse(f.get("especialidad")),x=e=>{e.preventDefault(),d(o,r)};return t(k,{toggleDrawer:s,customTitle:!0,title:a(i,{flexDirection:"row",alignItems:"center",columnGap:1,justifyContent:"flex-start",flexWrap:"wrap",children:[t(D,{style:{textDecoration:"none",color:"gray"},to:r?`/home/matricula/especialidades/${o}`:`/home/matricula/${o}`,children:a(n,{fontWeight:"bold",component:"h1",variant:"body1",sx:{textAlign:"left","&:hover":{textDecoration:"underline"}},children:["Detalle Matricula ",">"]})}),t(n,{fontWeight:"bold",component:"h1",variant:"h6",sx:{textAlign:"left",position:"sticky"},children:"Registro Pago"})]}),children:a(i,{component:"form",onSubmit:x,gap:3,children:[t(v,{formState:m,onImageChange:g,onInputChange:p,pagos:u,flag:!1,requiredFig:!0}),t(b,{sx:{alignSelf:"flex-end"},variant:"contained",type:"submit",color:"primary",children:"Aceptar"})]})})};export{K as default};