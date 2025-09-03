import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { getPool, ensureSchema } from '@/lib/db';

export const config = {
  api: {
    bodyParser: false,
  },
};

function parseForm(req) {
  const uploadDir = path.join(process.cwd(), 'public', 'schoolImages');
  const form = formidable({
    multiples: false,
    uploadDir,
    keepExtensions: true,
    maxFileSize: 5 * 1024 * 1024,
    filter: part => part.mimetype?.startsWith('image/') || part.name === 'image',
  });
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      await ensureSchema();
      const pool = getPool();
      const [rows] = await pool.query('SELECT id, name, address, city, image FROM schools ORDER BY id DESC');
      return res.status(200).json({ schools: rows });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to fetch schools' });
    }
  }

  if (req.method === 'POST') {
    try {
      await ensureSchema();
      const { fields, files } = await parseForm(req);

      const name = String(fields.name || '').trim();
      const address = String(fields.address || '').trim();
      const city = String(fields.city || '').trim();
      const state = String(fields.state || '').trim();
      const contact = fields.contact ? Number(fields.contact) : null;
      const email_id = String(fields.email_id || '').trim();

      if (!name || !address || !city || !state) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      let imageRelPath = null;
      const imageFile = files.image;
      if (imageFile && !Array.isArray(imageFile)) {
        const fileName = path.basename(imageFile.newFilename || imageFile.originalFilename);
        imageRelPath = path.posix.join('/schoolImages', fileName);
      }

      const pool = getPool();
      const [result] = await pool.query(
        'INSERT INTO schools (name, address, city, state, contact, image, email_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [name, address, city, state, contact, imageRelPath, email_id]
      );

      return res.status(201).json({ id: result.insertId });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to add school' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).end('Method Not Allowed');
}
