import{b as i,T as a}from"./index-b05c3593.js";import{T as u}from"./Tooltip-8a46e05f.js";const c=e=>{const t=e,n=t.getMinutes().toString().length==1?`0${t.getMinutes()}`:t.getMinutes();return`${t.getHours().toString().length==1?`0${t.getHours()}`:t.getHours()}:${n}`},m=e=>{const t=new Date(e),n=t.getDate().toString().length==1?`0${t.getDate()}`:t.getDate(),g=(t.getMonth()+1).toString().length==1?`0${t.getMonth()+1}`:t.getMonth()+1,o=t.getFullYear(),r=t.getMinutes().toString().length==1?`0${t.getMinutes()}`:t.getMinutes(),s=t.getHours().toString().length==1?`0${t.getHours()}`:t.getHours();return`${n}/${g}/${o} - ${s}:${r}`},$=e=>{const t=new Date(new Date(e).getTime()+new Date(e).getTimezoneOffset()*6e4),n=t.getDate().toString().length==1?`0${t.getDate()}`:t.getDate(),g=(t.getMonth()+1).toString().length==1?`0${t.getMonth()+1}`:t.getMonth()+1,o=t.getFullYear();return`${n}/${g}/${o}`},D=e=>{const t=new Date(new Date(e).getTime()+new Date(e).getTimezoneOffset()*6e4),n=t.getDate().toString().length==1?`0${t.getDate()}`:t.getDate(),g=(t.getMonth()+1).toString().length==1?`0${t.getMonth()+1}`:t.getMonth()+1;return`${t.getFullYear()}-${g}-${n}`},M=(e=[])=>{const t={Lun:"Lunes",Mar:"Martes",Mie:"Miercoles",Jue:"Jueves",Vie:"Viernes",Sab:"Sábados",Dom:"Domingos"};if(e.length==1)return"Solo "+t[e[0]];if(e.length==7)return"Todos los dias";const n=["Lun","Mar","Mie","Jue","Vie"];new Set(n);const g=["Lun","Mar","Mie","Jue","Vie","Sab","Dom"];let o="";return e.length>5?(e.sort((r,s)=>g.indexOf(r)-g.indexOf(s)),e.forEach((r,s)=>{o=o+r+`${s==e.length-1?"":", "}`}),o):n.every(r=>e.includes(r))?"Lun - Vie":(e.sort((r,s)=>g.indexOf(r)-g.indexOf(s)),e.forEach((r,s)=>{o=o+r+`${s==e.length-1?"":", "}`}),o)},f=(e,t=!1,n={})=>{if(e.split(" ").length>2){const o=e.split(" ").map(r=>r[0]).join(".").toUpperCase();return t?i(a,{...n,children:o}):i(u,{title:e,children:i(a,{...n,children:o})})}else return i(a,{...n,children:e})};export{$ as a,f as b,D as c,m as d,c as e,M as g};