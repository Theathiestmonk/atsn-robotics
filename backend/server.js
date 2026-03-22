/**
 * Contact form → email via Gmail SMTP (App Password).
 * POST /contact  JSON { name, email, subject, message, company?, phone? }
 */
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import rateLimit from 'express-rate-limit';

const PORT = Number(process.env.PORT) || 8787;
const CONTACT_TO = (process.env.CONTACT_TO_EMAIL || 'services@atsnai.com').trim();

const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
const SMTP_PORT = Number(process.env.SMTP_PORT) || 587;
const SMTP_SECURE = process.env.SMTP_SECURE === 'true';
/** Trim — trailing spaces in .env break Gmail login */
const SMTP_USER = process.env.SMTP_USER?.trim() || '';
/** Gmail App Passwords: 16 chars; spaces in .env are OK — strip for SMTP */
const SMTP_PASS = (process.env.SMTP_PASS || '').replace(/\s/g, '');

const corsOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((s) => s.trim()).filter(Boolean)
  : true;

const app = express();
app.set('trust proxy', 1);
app.use(express.json({ limit: '48kb' }));

app.use(
  cors({
    origin: corsOrigins,
    methods: ['POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
  })
);

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, error: 'Too many submissions. Try again later.' },
});

function isNonEmptyString(v, maxLen) {
  return typeof v === 'string' && v.trim().length > 0 && v.length <= maxLen;
}

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'contact-api' });
});

app.post('/contact', contactLimiter, async (req, res) => {
  if (!SMTP_USER || !SMTP_PASS) {
    console.error('Missing SMTP_USER or SMTP_PASS in environment');
    return res.status(503).json({
      ok: false,
      error: 'Email service is not configured on the server.',
    });
  }

  const { name, email, subject, message, company, phone } = req.body || {};

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
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
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
    return res.json({ ok: true });
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
    return res.status(502).json({
      ok: false,
      error: msg,
    });
  }
});

app.use((_req, res) => {
  res.status(404).json({ ok: false, error: 'Not found' });
});

const server = app.listen(PORT, () => {
  console.log(`Contact API listening on http://localhost:${PORT}`);
  console.log(`POST /contact → ${CONTACT_TO}`);
  if (!SMTP_USER || !SMTP_PASS) {
    console.warn('⚠ Set SMTP_USER and SMTP_PASS in backend/.env');
  }
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n❌ Port ${PORT} is already in use.`);
    console.error('   Close the other terminal or run: netstat -ano | findstr :' + PORT);
    console.error('   Then: taskkill /PID <pid> /F');
    console.error('   Or pick another PORT in backend/.env and set VITE_CONTACT_API_PORT in frontend/.env.local\n');
    process.exit(1);
  }
  throw err;
});
