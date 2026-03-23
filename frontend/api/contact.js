/**
 * Vercel Serverless — POST /api/contact (JSON body → SMTP)
 * Env (Vercel project → Settings → Environment Variables):
 *   SMTP_USER, SMTP_PASS, CONTACT_TO_EMAIL (optional),
 *   SMTP_HOST, SMTP_PORT, SMTP_SECURE (optional)
 */
import nodemailer from 'nodemailer';

const CONTACT_TO = (process.env.CONTACT_TO_EMAIL || 'services@atsnai.com').trim();
const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
const SMTP_PORT = Number(process.env.SMTP_PORT) || 587;
const SMTP_SECURE = process.env.SMTP_SECURE === 'true';
const SMTP_USER = process.env.SMTP_USER?.trim() || '';
const SMTP_PASS = (process.env.SMTP_PASS || '').replace(/\s/g, '');

function isNonEmptyString(v, maxLen) {
  return typeof v === 'string' && v.trim().length > 0 && v.length <= maxLen;
}

function parseBody(req) {
  if (req.body == null) return {};
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }
  return req.body;
}

export default async function handler(req, res) {
  // Required on POST responses too — browsers block cross-origin fetch without this (e.g. localhost → Vercel).
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  if (!SMTP_USER || !SMTP_PASS) {
    console.error('Missing SMTP_USER or SMTP_PASS');
    return res.status(503).json({
      ok: false,
      error: 'Email service is not configured on the server.',
    });
  }

  const body = parseBody(req);
  const { name, email, subject, message, company, phone } = body;

  if (!isNonEmptyString(name, 200)) {
    return res.status(400).json({ ok: false, error: 'Invalid or missing name.' });
  }
  if (!isNonEmptyString(email, 254) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return res.status(400).json({ ok: false, error: 'Invalid or missing email.' });
  }
  if (!isNonEmptyString(subject, 300)) {
    return res.status(400).json({ ok: false, error: 'Invalid or missing subject.' });
  }
  if (!isNonEmptyString(message, 10000) || message.trim().length < 10) {
    return res.status(400).json({ ok: false, error: 'Message must be at least 10 characters.' });
  }
  if (company != null && company !== '' && typeof company === 'string' && company.length > 200) {
    return res.status(400).json({ ok: false, error: 'Company is too long.' });
  }
  if (phone != null && phone !== '' && typeof phone === 'string' && phone.length > 40) {
    return res.status(400).json({ ok: false, error: 'Phone is too long.' });
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_SECURE,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
    tls: { rejectUnauthorized: true },
  });

  const text = [
    'New message from the ATSN Robotics contact form',
    '',
    `Name: ${name.trim()}`,
    `Email: ${email.trim()}`,
    company ? `Company: ${String(company).trim()}` : null,
    phone ? `Phone: ${String(phone).trim()}` : null,
    '',
    `Subject: ${subject.trim()}`,
    '',
    'Message:',
    message.trim(),
    '',
    `— Sent via contact form · Reply-To: ${email.trim()}`,
  ]
    .filter((line) => line !== null)
    .join('\n');

  try {
    await transporter.sendMail({
      from: `"ATSN Robotics — Contact" <${SMTP_USER}>`,
      to: CONTACT_TO,
      replyTo: email.trim(),
      subject: `[Contact] ${subject.trim()}`,
      text,
    });
    return res.status(200).json({ ok: true });
  } catch (err) {
    const code = err.responseCode || err.code;
    console.error('SMTP send failed:', err.message, code ? `(code ${code})` : '');
    const isAuth =
      String(err.message || '').includes('Invalid login') ||
      String(err.message || '').includes('authentication') ||
      code === 'EAUTH' ||
      code === 535;
    const msg = isAuth
      ? 'Gmail rejected login — check SMTP_USER has no extra spaces and SMTP_PASS is a 16-character App Password.'
      : 'Could not send email. Check server logs or try again.';
    return res.status(502).json({ ok: false, error: msg });
  }
}
