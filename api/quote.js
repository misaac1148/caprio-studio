import nodemailer from 'nodemailer';

const clean = (value, max = 4000) => typeof value === 'string' ? value.trim().slice(0, max) : '';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' });
  const body = typeof req.body === 'string'
    ? (() => { try { return JSON.parse(req.body); } catch { return {}; } })()
    : (req.body || {});

  // Hidden honeypot field to deter bot submissions.
  if (clean(body.website)) return res.status(200).json({ ok: true });

  const name = clean(body.name, 100);
  const email = clean(body.email, 200);
  const service = clean(body.service, 50);
  const location = clean(body.location, 80);
  const timeline = clean(body.timeline, 150);
  const details = clean(body.details);
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      || !['Laser engraving', '3D printing', 'Not sure yet'].includes(service)
      || !['Local to Eugene area', 'Shipping needed', "Let's discuss"].includes(location)
      || details.length < 10) {
    return res.status(400).json({ error: 'Please complete all required fields.' });
  }

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 465);
  const user = process.env.SMTP_USER;
  const password = process.env.SMTP_PASSWORD;
  const to = process.env.QUOTE_TO_EMAIL || 'info@mc3grp.com';
  const from = process.env.QUOTE_FROM_EMAIL || user;
  if (!host || !user || !password || !from || !Number.isInteger(port)) {
    return res.status(503).json({ error: 'The inquiry form email settings are not configured yet.' });
  }

  const message = [
    'New Caprio Studio inquiry', '',
    `Name: ${name}`, `Email: ${email}`,
    `Service: ${service}`, `Fulfillment: ${location}`,
    `Timing: ${timeline || 'Not specified'}`, '', 'Project:', details,
  ].join('\n');
  try {
    const transport = nodemailer.createTransport({
      host, port, secure: port === 465,
      auth: { user, pass: password },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
    });
    await transport.sendMail({
      from, to, replyTo: { name, address: email },
      subject: `Caprio Studio inquiry - ${service}`,
      text: message,
    });
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Caprio quote SMTP delivery failed:', error?.code || error?.message || 'unknown error');
    return res.status(502).json({ error: 'We could not deliver your inquiry. Please try again later.' });
  }
}
