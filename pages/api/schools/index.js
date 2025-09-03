import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { getPool, ensureSchema } from '@/lib/db';

const JSON_STORE = path.join(process.cwd(), 'data', 'schools.json');
const ensureJsonStore = () => {
  const dir = path.dirname(JSON_STORE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(JSON_STORE)) fs.writeFileSync(JSON_STORE, JSON.stringify([]));
};
const readJsonSchools = () => {
  ensureJsonStore();
  try {
    const raw = fs.readFileSync(JSON_STORE, 'utf8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
};
const writeJsonSchools = (schools) => {
  ensureJsonStore();
  fs.writeFileSync(JSON_STORE, JSON.stringify(schools, null, 2));
};

function hasMysqlEnv() {
  return Boolean(
    process.env.MYSQL_HOST &&
    process.env.MYSQL_USER &&
    process.env.MYSQL_PASSWORD &&
    process.env.MYSQL_DATABASE
  );
}

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
      if (hasMysqlEnv()) {
        await ensureSchema();
        const pool = getPool();
        const [rows] = await pool.query('SELECT id, name, address, city, image FROM schools ORDER BY id DESC');
        return res.status(200).json({ schools: rows });
      }
      const schools = readJsonSchools();
      return res.status(200).json({ schools });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to fetch schools' });
    }
  }

  if (req.method === 'POST') {
    try {
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
      const imageFileCandidate = files.image;
      const imageFile = Array.isArray(imageFileCandidate) ? imageFileCandidate[0] : imageFileCandidate;
      if (imageFile) {
        const fileName = path.basename(imageFile.newFilename || imageFile.originalFilename || imageFile.filepath || '');
        if (fileName) {
          imageRelPath = path.posix.join('/schoolImages', fileName);
        }
      }

      if (hasMysqlEnv()) {
        await ensureSchema();
        const pool = getPool();
        const [result] = await pool.query(
          'INSERT INTO schools (name, address, city, state, contact, image, email_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [name, address, city, state, contact, imageRelPath, email_id]
        );
        return res.status(201).json({ id: result.insertId });
      }

      const schools = readJsonSchools();
      const id = schools.length ? Math.max(...schools.map(s => s.id || 0)) + 1 : 1;
      const newSchool = { id, name, address, city, state, contact, image: imageRelPath, email_id };
      schools.push(newSchool);
      writeJsonSchools(schools);
      return res.status(201).json({ id });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to add school' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).end('Method Not Allowed');
}
