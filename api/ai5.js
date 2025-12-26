export default function handler(req,res){
if(req.query.key!=="KAYZEN_API_KEY")return res.status(401).json({error:"Invalid API Key"})
res.json({roleplay:`You are now acting as ${req.query.q}`})
}
