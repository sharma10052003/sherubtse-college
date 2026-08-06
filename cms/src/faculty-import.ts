/**
 * faculty-import.ts — a small self-contained tool for bulk-importing
 * Faculty Profile entries from an Excel (.xlsx) file. Served directly by
 * Strapi's own Koa server (same host/port as the admin panel), reachable
 * at http://localhost:1337/faculty-import — deliberately NOT a full
 * Strapi admin-panel plugin (that requires a separate build pipeline);
 * this is a plain HTML page + a couple of routes, protected by a simple
 * password gate (set FACULTY_IMPORT_PASSWORD in cms/.env).
 *
 * Column names in the spreadsheet map 1:1 to Faculty Profile's fields
 * (see COLUMNS below) — download the template from the page itself for
 * the exact expected headers. Every column except full_name may be left
 * blank; slug auto-generates from full_name if omitted.
 */
import type { Core } from '@strapi/strapi';
import Router from '@koa/router';
import multer from '@koa/multer';
import * as XLSX from 'xlsx';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });
const COOKIE_NAME = 'stc_faculty_import_auth';
const PASSWORD = process.env.FACULTY_IMPORT_PASSWORD || 'sherubtse-import';

const COLUMNS = [
  'full_name', 'slug', 'department', 'position', 'employee_id', 'short_biography',
  'date_joined', 'employment_status', 'highest_qualification', 'university',
  'specialization', 'research_areas', 'teaching_subjects', 'work_experience',
  'languages', 'college_email', 'personal_email', 'phone_number', 'office_location',
  'office_hours', 'google_maps_link', 'linkedin_url', 'google_scholar_url',
  'researchgate_url', 'orcid_url', 'personal_website_url', 'photo_url', 'is_featured', 'sort_order',
];

const COLUMN_NOTES: Record<string, string> = {
  full_name: 'Required. The only field that must be filled in.',
  slug: 'Optional — auto-generated from full_name if left blank (e.g. "Dr. Sonam Dorji" -> "dr-sonam-dorji").',
  department: 'Must match an existing Department name exactly (case-insensitive), e.g. "Commerce". If it doesn\'t match, the profile is still created, just without a department set.',
  employment_status: '"active" or "inactive" — defaults to "active" if blank or anything else.',
  date_joined: 'Format: YYYY-MM-DD (e.g. 2020-07-01). Leave blank if unknown.',
  is_featured: '"true"/"yes"/"1" to feature this person on the directory, otherwise leave blank.',
  sort_order: 'A number controlling card order (lower = earlier). Leave blank for default ordering.',
  photo_url: 'Optional — a direct URL to a photo (must end in an image file, publicly reachable). The importer downloads it and attaches it as the Profile Picture automatically.',
  research_areas: 'Comma-separated, e.g. "Bhutanese Studies, Linguistics".',
  teaching_subjects: 'Comma-separated, e.g. "Macroeconomics, Statistics".',
  languages: 'Comma-separated, e.g. "English, Dzongkha".',
};

function slugify(text: string): string {
  return (text || '')
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-+|-+$)/g, '') || 'faculty';
}

function truthy(v: unknown): boolean {
  const s = String(v ?? '').trim().toLowerCase();
  return s === 'true' || s === 'yes' || s === '1' || s === 'y';
}

function looksLikeDate(v: unknown): boolean {
  return typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v.trim());
}

function pageShell(title: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
<style>
  :root { --maroon:#7A1B2B; --maroon-dark:#4E1019; --gold:#C7962C; --cream:#FAF7F1; --ink:#221A17; --ink-soft:#5B4E48; --line:#E4DCD1; }
  * { box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: var(--cream); color: var(--ink); margin:0; padding: 40px 20px; }
  .card { max-width: 720px; margin: 0 auto; background: #fff; border-radius: 14px; padding: 32px 36px; box-shadow: 0 8px 30px rgba(0,0,0,0.08); border-top: 4px solid var(--maroon); }
  h1 { font-size: 1.5rem; margin-top:0; color: var(--maroon); font-family: Georgia, serif; }
  h2 { font-size: 1.1rem; color: var(--maroon-dark); margin-top: 28px; }
  p { line-height: 1.6; color: var(--ink-soft); }
  a.btn, button { display:inline-block; background: var(--maroon); color:#fff; padding: 10px 20px; border-radius: 8px; text-decoration:none; border:none; font-size:0.95rem; cursor:pointer; font-weight:600; }
  a.btn.secondary, button.secondary { background: var(--gold); color: var(--ink); }
  .row { display:flex; gap: 12px; flex-wrap:wrap; align-items:center; margin-top: 8px; }
  input[type=file], input[type=password] { display:block; width:100%; padding: 10px; margin: 10px 0 18px; border:1px solid var(--line); border-radius: 8px; font-size: 0.95rem; }
  ul { padding-left: 20px; color: var(--ink-soft); }
  .ok { color: #2E7D4F; font-weight:600; } .err { color: #B3261E; } .warn { color: #9C6B00; }
  table { width:100%; border-collapse: collapse; margin-top: 10px; font-size: 0.88rem; }
  td, th { text-align:left; padding: 7px 8px; border-bottom: 1px solid #eee; }
  code { background: var(--cream); padding: 1px 5px; border-radius: 4px; }
  .summary { display:flex; gap: 20px; margin: 16px 0; }
  .summary div { background: var(--cream); border-radius: 10px; padding: 12px 18px; text-align:center; }
  .summary strong { display:block; font-size: 1.6rem; color: var(--maroon); }
</style>
</head>
<body><div class="card">${body}</div></body>
</html>`;
}

function isAuthed(ctx: any): boolean {
  return ctx.cookies.get(COOKIE_NAME, { signed: true }) === 'ok';
}

function extFromUrlOrType(url: string, contentType: string | null): string {
  const fromUrl = path.extname(new URL(url).pathname).toLowerCase();
  if (fromUrl && fromUrl.length <= 5) return fromUrl;
  const map: Record<string, string> = { 'image/png': '.png', 'image/jpeg': '.jpg', 'image/webp': '.webp', 'image/gif': '.gif' };
  return map[contentType || ''] || '.jpg';
}

/**
 * Downloads a remote image and registers it in Strapi's Media Library
 * via the upload plugin's internal service (in-process, no HTTP/token
 * needed since this already runs inside the Strapi server). Returns the
 * new media entry's id, or null on any failure (never throws — a failed
 * photo shouldn't block the rest of the row from being created).
 */
async function downloadAndUploadImage(strapi: Core.Strapi, url: string, nameHint: string): Promise<number | null> {
  let tmpPath = '';
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const contentType = res.headers.get('content-type');
    const buf = Buffer.from(await res.arrayBuffer());

    const ext = extFromUrlOrType(url, contentType);
    const filename = `${nameHint.toLowerCase().replace(/[^a-z0-9]+/g, '-')}${ext}`;
    tmpPath = path.join(os.tmpdir(), `faculty-import-${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
    fs.writeFileSync(tmpPath, buf);

    const uploadService = strapi.plugin('upload').service('upload');
    const [uploaded] = await uploadService.upload({
      data: {},
      files: {
        filepath: tmpPath,
        originalFilename: filename,
        mimetype: contentType || 'image/jpeg',
        size: buf.length,
      },
    });
    return uploaded?.id ?? null;
  } catch (e) {
    return null;
  } finally {
    if (tmpPath) {
      try { fs.unlinkSync(tmpPath); } catch (e) { /* ignore */ }
    }
  }
}

export default function registerFacultyImport({ strapi }: { strapi: Core.Strapi }) {
  const router = new Router();

  router.get('/faculty-import/login', (ctx) => {
    ctx.type = 'html';
    ctx.body = pageShell('Faculty Import — Login', `
      <h1>Faculty Import</h1>
      <p>Enter the import password to continue.</p>
      <form method="POST" action="/faculty-import/login" enctype="multipart/form-data">
        <input type="password" name="password" placeholder="Password" required autofocus>
        <button type="submit">Continue</button>
      </form>
      ${ctx.query.error ? '<p class="err">Incorrect password — try again.</p>' : ''}
    `);
  });

  router.post('/faculty-import/login', (upload as any).none(), (ctx) => {
    const submitted = (ctx.request.body as any)?.password;
    if (submitted === PASSWORD) {
      ctx.cookies.set(COOKIE_NAME, 'ok', { signed: true, httpOnly: true, maxAge: 8 * 60 * 60 * 1000 });
      ctx.redirect('/faculty-import');
    } else {
      ctx.redirect('/faculty-import/login?error=1');
    }
  });

  router.get('/faculty-import', (ctx) => {
    if (!isAuthed(ctx)) return ctx.redirect('/faculty-import/login');
    ctx.type = 'html';
    ctx.body = pageShell('Import Faculty from Excel', `
      <h1><i>🎓</i> Import Faculty from Excel</h1>
      <p>Upload a spreadsheet of faculty members to create their profiles in bulk. Only <strong>full_name</strong> is required — everything else can be left blank.</p>

      <div class="row">
        <a class="btn secondary" href="/faculty-import/template">Download Excel Template</a>
      </div>

      <h2>Upload your filled-in spreadsheet</h2>
      <form method="POST" action="/faculty-import/upload" enctype="multipart/form-data">
        <input type="file" name="file" accept=".xlsx,.xls" required>
        <button type="submit">Import</button>
      </form>

      <h2>Column reference</h2>
      <table>
        <tr><th>Column</th><th>Notes</th></tr>
        ${COLUMNS.map((c) => `<tr><td><code>${c}</code></td><td>${COLUMN_NOTES[c] || '&mdash;'}</td></tr>`).join('')}
      </table>
    `);
  });

  router.get('/faculty-import/template', (ctx) => {
    if (!isAuthed(ctx)) return ctx.redirect('/faculty-import/login');

    const exampleRow: Record<string, string> = {
      full_name: 'Dr. Sonam Dorji',
      slug: '',
      department: 'Science & Mathematics',
      position: 'Assistant Professor',
      employee_id: 'EMP-101',
      short_biography: 'A short paragraph about this person.',
      date_joined: '2020-07-01',
      employment_status: 'active',
      highest_qualification: 'PhD',
      university: 'Example University',
      specialization: 'Applied Mathematics',
      research_areas: 'Statistics, Data Science',
      teaching_subjects: 'Calculus, Linear Algebra',
      work_experience: 'A paragraph describing prior roles.',
      languages: 'English, Dzongkha',
      college_email: 'sonam.dorji@sherubtse.edu.bt',
      personal_email: '',
      phone_number: '',
      office_location: 'Science Building, Room 12',
      office_hours: 'Mon-Fri: 10:00 AM - 12:00 PM',
      google_maps_link: '',
      linkedin_url: '',
      google_scholar_url: '',
      researchgate_url: '',
      orcid_url: '',
      personal_website_url: '',
      photo_url: 'https://example.com/path/to/photo.jpg',
      is_featured: 'false',
      sort_order: '1',
    };

    const dataSheet = XLSX.utils.json_to_sheet([exampleRow], { header: COLUMNS });
    const notesRows = COLUMNS.map((c) => ({ Column: c, Notes: COLUMN_NOTES[c] || '' }));
    const notesSheet = XLSX.utils.json_to_sheet(notesRows);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, dataSheet, 'Faculty Data');
    XLSX.utils.book_append_sheet(wb, notesSheet, 'Instructions');

    const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
    ctx.set('Content-Disposition', 'attachment; filename="faculty-import-template.xlsx"');
    ctx.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    ctx.body = buf;
  });

  router.post('/faculty-import/upload', upload.single('file'), async (ctx) => {
    if (!isAuthed(ctx)) return ctx.redirect('/faculty-import/login');

    const file = (ctx as any).file || (ctx.request as any).file;
    if (!file) {
      ctx.type = 'html';
      ctx.body = pageShell('Import Failed', `<h1>No file received</h1><p>Please go back and choose a .xlsx file.</p><a class="btn" href="/faculty-import">Back</a>`);
      return;
    }

    let rows: Record<string, any>[];
    try {
      const wb = XLSX.read(file.buffer, { type: 'buffer' });
      const sheet = wb.Sheets[wb.SheetNames[0]];
      rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });
    } catch (e) {
      ctx.type = 'html';
      ctx.body = pageShell('Import Failed', `<h1>Could not read that file</h1><p>Make sure it's a valid .xlsx file exported from Excel.</p><a class="btn" href="/faculty-import">Back</a>`);
      return;
    }

    // Normalize headers (case-insensitive / trimmed) to the expected column names.
    const normalizeRow = (row: Record<string, any>) => {
      const out: Record<string, any> = {};
      for (const key of Object.keys(row)) {
        const norm = key.toString().trim().toLowerCase();
        const match = COLUMNS.find((c) => c === norm);
        if (match) out[match] = row[key];
      }
      return out;
    };

    const departmentDocs = await strapi.documents('api::department.department' as any).findMany({ fields: ['department_name'] as any });
    const departmentMap = new Map<string, string>();
    for (const d of departmentDocs as any[]) {
      departmentMap.set(String(d.department_name).trim().toLowerCase(), d.documentId);
    }

    const existingProfiles = await strapi.documents('api::faculty-profile.faculty-profile' as any).findMany({ fields: ['slug'] as any });
    const usedSlugs = new Set<string>((existingProfiles as any[]).map((p) => p.slug));

    const created: { name: string; slug: string }[] = [];
    const warnings: string[] = [];
    const errors: string[] = [];

    for (let i = 0; i < rows.length; i++) {
      const rowNum = i + 2; // header is row 1
      const raw = normalizeRow(rows[i]);
      const isBlankRow = Object.values(raw).every((v) => String(v).trim() === '');
      if (isBlankRow) continue;

      const fullName = String(raw.full_name || '').trim();
      if (!fullName) {
        errors.push(`Row ${rowNum}: missing full_name — skipped.`);
        continue;
      }

      let slug = slugify(String(raw.slug || fullName));
      let candidate = slug;
      let n = 2;
      while (usedSlugs.has(candidate)) {
        candidate = `${slug}-${n}`;
        n++;
      }
      slug = candidate;
      usedSlugs.add(slug);

      const data: Record<string, any> = { full_name: fullName, slug };

      const textFields = [
        'position', 'employee_id', 'short_biography', 'highest_qualification', 'university',
        'specialization', 'research_areas', 'teaching_subjects', 'work_experience', 'languages',
        'college_email', 'personal_email', 'phone_number', 'office_location', 'office_hours',
        'google_maps_link', 'linkedin_url', 'google_scholar_url', 'researchgate_url', 'orcid_url',
        'personal_website_url',
      ];
      for (const f of textFields) {
        const v = String(raw[f] ?? '').trim();
        if (v) data[f] = v;
      }

      const status = String(raw.employment_status || '').trim().toLowerCase();
      data.employment_status = status === 'active' || status === 'inactive' ? status : 'active';

      if (looksLikeDate(raw.date_joined)) data.date_joined = raw.date_joined;

      data.is_featured = truthy(raw.is_featured);

      const sortOrder = parseInt(String(raw.sort_order), 10);
      data.sort_order = Number.isFinite(sortOrder) ? sortOrder : 0;

      const deptName = String(raw.department || '').trim();
      if (deptName) {
        const deptId = departmentMap.get(deptName.toLowerCase());
        if (deptId) {
          data.department = deptId;
        } else {
          warnings.push(`Row ${rowNum} (${fullName}): department "${deptName}" not found — created without a department.`);
        }
      }

      const photoUrl = String(raw.photo_url || '').trim();
      if (photoUrl) {
        const mediaId = await downloadAndUploadImage(strapi, photoUrl, slug);
        if (mediaId) {
          data.profile_picture = mediaId;
        } else {
          warnings.push(`Row ${rowNum} (${fullName}): could not download/attach photo from ${photoUrl} — profile created without it.`);
        }
      }

      try {
        await strapi.documents('api::faculty-profile.faculty-profile' as any).create({ data, status: 'published' } as any);
        created.push({ name: fullName, slug });
      } catch (e: any) {
        errors.push(`Row ${rowNum} (${fullName}): ${e?.message || 'failed to create'}`);
      }
    }

    ctx.type = 'html';
    ctx.body = pageShell('Import Complete', `
      <h1>Import Complete</h1>
      <div class="summary">
        <div><strong>${created.length}</strong>Created</div>
        <div><strong>${warnings.length}</strong>Warnings</div>
        <div><strong>${errors.length}</strong>Errors</div>
      </div>
      ${created.length ? `<h2>Created</h2><ul>${created.map((c) => `<li class="ok">${c.name} <code>/${c.slug}</code></li>`).join('')}</ul>` : ''}
      ${warnings.length ? `<h2>Warnings</h2><ul>${warnings.map((w) => `<li class="warn">${w}</li>`).join('')}</ul>` : ''}
      ${errors.length ? `<h2>Errors</h2><ul>${errors.map((e) => `<li class="err">${e}</li>`).join('')}</ul>` : ''}
      <div class="row" style="margin-top:24px">
        <a class="btn" href="/faculty-import">Import Another File</a>
        <a class="btn secondary" href="http://localhost:1337/admin/content-manager/collection-types/api::faculty-profile.faculty-profile">Review in Strapi Admin</a>
      </div>
    `);
  });

  strapi.server.app.use(router.routes()).use(router.allowedMethods());
}
