const clean = (s, max = 4000) => typeof s === 'string' ? s.trim().slice(0,max) : '';
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({error:'Method not allowed.'});
  const body = typeof req.body === 'string' ? (() => {try{return JSON.parse(req.body)}catch{return {}}})() : req.body || {};
  if (clean(body.website)) return res.status(200).json({ok:true});
  const name=clean(body.name,100), email=clean(body.email,200), service=clean(body.service,50), location=clean(body.location,80), timeline=clean(body.timeline,150), details=clean(body.details);
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !['Laser engraving','3D printing','Not sure yet'].includes(service) || !['Local to Eugene area','Shipping needed',"Let's discuss"].includes(location) || details.length < 10) return res.status(400).json({error:'Please complete all required fields.'});
  const apiKey=process.env.RESEND_API_KEY, to=process.env.QUOTE_TO_EMAIL, from=process.env.QUOTE_FROM_EMAIL;
  if (!apiKey || !to || !from) return res.status(503).json({error:'The online inquiry form is not activated yet. Please try again after the studio publishes its contact details.'});
  const text=`New Caprio Studio inquiry\n\nName: ${name}\nEmail: ${email}\nService: ${service}\nFulfillment: ${location}\nTiming: ${timeline || 'Not specified'}\n\nProject:\n${details}`;
  try {
    const response=await fetch('https://api.resend.com/emails', {method:'POST',headers:{Authorization:`Bearer ${apiKey}`,'Content-Type':'application/json'},body:JSON.stringify({from,to:[to],reply_to:email,subject:`Caprio Studio inquiry — ${service}`,text})});
    if (!response.ok) return res.status(502).json({error:'The inquiry could not be delivered. Please try again later.'});
    return res.status(200).json({ok:true});
  } catch { return res.status(502).json({error:'The inquiry could not be delivered. Please try again later.'}); }
}
