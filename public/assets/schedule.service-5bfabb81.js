import{t as a}from"./index-b05c3593.js";const d=async({token:t,dias:e,horaInicio:r,horaFin:o})=>{try{return(await a.post("/schedule",{dias:e,horaInicio:r,horaFin:o},{headers:{"x-token":t}})).data}catch(s){throw s}},u=async t=>{try{return(await a.get("/schedule",{headers:{"x-token":t}})).data}catch(e){throw e}},p=async(t,{token:e,turno:r,dias:o,horaFin:s,horaInicio:n})=>{try{return(await a.patch(`/schedule/${t}`,{dias:o,horaInicio:n,horaFin:s},{headers:{"x-token":e}})).data}catch(c){throw c}},l=async(t,e)=>{try{return(await a.delete(`/schedule/${e}`,{headers:{"x-token":t}})).data}catch(r){throw r}};export{d as c,l as d,p as e,u as g};