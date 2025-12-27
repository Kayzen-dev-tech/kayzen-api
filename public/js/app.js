const cosplayer = document.getElementById("cosplayer")
for (let i = 1; i <= 15; i++) {
  const img = document.createElement("img")
  img.src = `/slide${i}.jpg`
  cosplayer.appendChild(img)
}

const bini = document.getElementById("bini")
for (let i = 1; i <= 5; i++) {
  const img = document.createElement("img")
  img.src = `/bini${i}.jpg`
  bini.appendChild(img)
}
