const cosplay=document.getElementById("cosplay")
const bini=document.getElementById("bini")

if(cosplay){
for(let i=1;i<=15;i++){
let img=document.createElement("img")
img.src=`public/slide${i}.jpg`
cosplay.appendChild(img)
}
}

if(bini){
for(let i=1;i<=5;i++){
let img=document.createElement("img")
img.src=`public/bini${i}.jpg`
bini.appendChild(img)
}
}

async function tryApi(){
const key=document.getElementById("apikey").value
const ep=document.getElementById("endpoint").value
const q=document.getElementById("query").value
const res=await fetch(`/api/${ep}?key=${key}&q=${encodeURIComponent(q)}`)
document.getElementById("result").textContent=await res.text()
}
