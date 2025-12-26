export default function handler(req,res){
if(req.query.key!=="KAYZEN_API_KEY")return res.status(401).json({error:"Invalid API Key"})
res.json({service:"mxdrop",target:"https://mxdrop.to",query:req.query.q})
}
