import Image from "next/image"

export default function Home() {
  return (
    <main style={{fontFamily:"sans-serif"}}>
      <div style={{position:"relative"}}>
        <Image src="/banner.jpg" alt="banner" width={1200} height={400} />
        <div style={{position:"absolute",bottom:20,left:20}}>
          <Image src="/profile.jpg" alt="profile" width={120} height={120} style={{borderRadius:"50%"}} />
          <h2>Kayzen Izumi</h2>
        </div>
      </div>

      <h3>Cosplayer Slides</h3>
      <div style={{display:"flex",overflowX:"auto"}}>
        {Array.from({length:15}).map((_,i)=>(
          <Image key={i} src={`/slide${i+1}.jpg`} alt="" width={200} height={300} />
        ))}
      </div>

      <h3>My Bini Slides</h3>
      <div style={{display:"flex",overflowX:"auto"}}>
        {Array.from({length:5}).map((_,i)=>(
          <Image key={i} src={`/bini${i+1}.jpg`} alt="" width={200} height={300} />
        ))}
      </div>

      <h3>About Me</h3>
      <p>Kayzen Izumi</p>

      <h3>About My Bini</h3>
      <p>@h___rvn</p>

      <h3>About Web API</h3>
      <p>Web API untuk download, search, AI sederhana dan media utility.</p>

      <h3>Media Sosial</h3>
      <ul>
        <li>WhatsApp: 628152313006</li>
        <li>Telegram: @nonewpo</li>
        <li>Instagram: @kayzenfry</li>
        <li>YouTube: @kayzenfry</li>
        <li>TikTok: @scz_kayzen</li>
      </ul>

      <h3>Media Sosial My Bini</h3>
      <ul>
        <li>Instagram: @h___rvn</li>
      </ul>

      <h3>Update API</h3>
      <a href="https://whatsapp.com/channel/0029VbBRpUN8F2pMzHjQqz3S">WhatsApp Channel</a>
    </main>
  )
}
