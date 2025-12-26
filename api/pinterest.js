export default function handler(req,res){
if(req.query.key!=="KAYZEN_API_KEY")return res.status(401).json({error:"Invalid API Key"})
res.json({
query:req.query.q,
results:[
"https://i.pinimg.com/1.jpg",
"https://i.pinimg.com/2.jpg",
"https://i.pinimg.com/3.jpg",
"https://i.pinimg.com/4.jpg",
"https://i.pinimg.com/5.jpg"
]})
}
