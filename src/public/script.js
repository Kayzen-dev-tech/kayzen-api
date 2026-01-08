// Socket.io realtime clock
const socket = io();
const timeEl = document.getElementById("time");
const dateEl = document.getElementById("date");
const statusEl = document.getElementById("status");

socket.on("update_time", (data) => {
  timeEl.textContent = data.time;
  dateEl.textContent = data.date;
  statusEl.textContent = data.status;
  statusEl.style.color = data.status === "ONLINE" ? "#00ff00" : "#ff1493";
});

// Zero Two AI
const aiPrompt = document.getElementById("ai-prompt");
const aiSend = document.getElementById("ai-send");
const aiResponse = document.getElementById("ai-response");

aiSend.addEventListener("click", async () => {
  const prompt = aiPrompt.value.trim();
  if (!prompt) return alert("Masukkan prompt dulu 💖");

  aiResponse.textContent = "";
  aiResponse.innerHTML = `<span style="color:#ff69b4;">Zero Two sedang berpikir...</span>`;

  try {
    const res = await fetch("/api/v1/ai", {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({prompt})
    });
    const data = await res.json();
    aiResponse.textContent = "";
    let idx=0;
    const typingInterval=setInterval(()=>{
      if(idx<data.partials.length){
        aiResponse.textContent+=data.partials[idx];
        idx++;
      }else{clearInterval(typingInterval);}
    },50);
  }catch(err){
    aiResponse.textContent="Error: Tidak bisa menghubungi Zero Two AI 😢";
  }
});

// Instagram Downloader
const instaUrl=document.getElementById("insta-url");
const instaDownload=document.getElementById("insta-download");
const instaResult=document.getElementById("insta-result");

instaDownload.addEventListener("click",async()=>{
  const url=instaUrl.value.trim();
  if(!url) return alert("Masukkan link Instagram dulu 💖");

  instaResult.textContent="Memproses download... 💫";

  try{
    const res=await fetch("/api/v1/instagram",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({url})
    });
    const data=await res.json();
    if(data.error){
      instaResult.textContent=`Error: ${data.error}`;
    }else{
      instaResult.innerHTML=`✅ Video siap di-download:<br><a href="${data.url}" target="_blank" style="color:#ff69b4;">${data.title || "Download Video"}</a>`;
    }
  }catch(err){
    instaResult.textContent="Error: Gagal menghubungi server 😢";
  }
});

// Douyin/TikTok Downloader
const douyinUrl = document.getElementById("douyin-url");
const douyinDownload = document.getElementById("douyin-download");
const douyinResult = document.getElementById("douyin-result");

douyinDownload.addEventListener("click", async () => {
  const url = douyinUrl.value.trim();
  if (!url) return alert("Masukkan link Douyin/TikTok dulu 💖");

  douyinResult.textContent = "Memproses download... 💫";

  try {
    const res = await fetch("/api/v1/douyin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url })
    });
    const data = await res.json();

    if (!data.success) {
      douyinResult.textContent = `Error: ${data.message}`;
    } else {
      let mediaLinks = "";
      if (data.media && data.media.length) {
        mediaLinks = data.media.map(m => `<a href="${m.url}" target="_blank" style="color:#ff69b4;">${m.format || 'Video'}</a>`).join("<br>");
      }
      douyinResult.innerHTML = `
        ✅ Media siap di-download:<br>
        <strong>${data.title}</strong><br>
        ${mediaLinks}
      `;
    }
  } catch (err) {
    douyinResult.textContent = "Error: Gagal menghubungi server Douyin 😢";
  }
});