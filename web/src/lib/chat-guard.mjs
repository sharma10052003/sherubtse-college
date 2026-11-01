// Safety rules for the “Ask Sherubtse” assistant, shared by the chat window
// (components/ChatAssistant.astro) and the AI chat server (chat-server/).
// Plain JavaScript so both can load it.
//
// The assistant only ever answers from public website content. On top of
// that, questions about staff systems — the admin panel, logins, passwords,
// tokens and the like — get a fixed reply and never reach the AI, and AI
// answers that mention those systems are replaced by the same reply.
// “Admin” on its own (e.g. the Administration office) is fine; it is refused
// together with login/panel/access words.

/** Lower-case, accents removed, punctuation as spaces (same as the site search). */
export const fold = (/** @type {string} */ s) =>
  String(s ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9ༀ-࿿]+/g, ' ')
    .trim();

/** Always refused, as whole words or phrases. */
const ALWAYS = [
  'strapi', 'cms', 'backend', 'back end', 'dashboard', 'admin panel', 'adminpanel', 'admin login', 'admin page',
  'admin portal', 'admin account', 'admin access', 'administrator login', 'administrator account', 'superadmin',
  'super admin', 'wp admin', 'phpmyadmin', 'content manager', 'content type builder', 'database', 'sql', 'api',
  'api key', 'apikey', 'token', 'tokens', 'password', 'passwords', 'passcode', 'credential', 'credentials',
  'ssh', 'sudo', 'root access', 'root login', 'server login', 'env file', 'localhost', '1337', 'jwt', 'secret key',
  'hack', 'hacking', 'exploit', 'system prompt', 'your instructions', 'ignore previous', 'ignore all previous',
];
/** Refused only when combined with an access word below. */
const ADMIN = ['admin', 'admins', 'administrator', 'administrators'];
const ACCESS = [
  'login', 'log in', 'logon', 'sign in', 'signin', 'panel', 'access', 'account', 'accounts', 'url', 'link', 'portal',
  'username', 'user name', 'page', 'console', 'site', 'website', 'address', 'edit', 'editor', 'manage',
];

/**
 * True when a visitor's question is about staff systems rather than public information.
 * @param {string} question
 * @param {string[]} [extra] extra words from Strapi (Global – Chat Assistant)
 */
export function isBlocked(question, extra = []) {
  const text = ` ${fold(question)} `;
  const has = (/** @type {string} */ w) => {
    const f = fold(w);
    return f !== '' && text.includes(` ${f} `);
  };
  if (ALWAYS.some(has) || extra.some(has)) return true;
  return ADMIN.some(has) && ACCESS.some(has);
}

/**
 * True when an AI answer talks about staff systems (checked after the AI replies).
 * Public pages may legitimately mention a password for a student platform, so
 * this looks for admin and internal-system terms rather than any “password”.
 * @param {string} answer
 */
export function mentionsStaffSystems(answer) {
  return /\b(admin(istrator)?\s*(panel|login|log\s*in|page|portal|account|dashboard|access|url|link)|strapi|content[\s-]*manager|phpmyadmin|wp-admin|api[\s_-]*(key|token)|localhost|:1337|\/admin\b|system prompt)/i.test(
    String(answer ?? ''),
  );
}

/**
 * Never link to anything that looks like a staff system, even if it reached the index.
 * @param {string} url
 */
export function isSafeUrl(url) {
  return !/\/admin(\/|$|[?#])|\/api\/|content-manager|wp-admin|phpmyadmin/i.test(String(url ?? ''));
}
