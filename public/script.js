async function updateTime() {
  const r = await fetch("/api/time");
  const d = await r.json();
  document.getElementById("time").innerText = d.time;
  document.getElementById("date").innerText = d.date;
}
setInterval(updateTime, 1000);
updateTime();

async function askAI() {
  const prompt = document.getElementById("prompt").value;
  const r = await fetch("/api/ai", {
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body:JSON.stringify({ prompt })
  });
  const d = await r.json();
  const el = document.getElementById("ai");
  el.innerText = "";
  let i=0;
  const t = setInterval(()=>{
    if(i<d.partials.length){
      el.innerText += d.partials[i++];
    } else clearInterval(t);
  },40);
}

async function downloadIG(){
  const url=document.getElementById("ig").value;
  const r=await fetch("/api/instagram",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({url})});
  document.getElementById("igResult").innerText=JSON.stringify(await r.json(),null,2);
}

async function downloadDY(){
  const url=document.getElementById("dy").value;
  const r=await fetch("/api/douyin",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({url})});
  document.getElementById("dyResult").innerText=JSON.stringify(await r.json(),null,2);
             }
