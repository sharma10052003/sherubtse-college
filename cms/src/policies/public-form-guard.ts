import { errors } from '@strapi/utils';

/**
 * Guards the three public, create-only form endpoints on the Alumni page
 * (story submission, alumni registration, newsletter sign-up):
 *  - a honeypot field (`hp_field`) that people never see and bots fill in;
 *  - a small per-visitor rate limit per endpoint;
 *  - an allow-list, so a hand-crafted request can only set the fields the
 *    form itself has (not e.g. `is_featured` or `reviewed`);
 *  - optional "must be ticked" consent fields and lower-cased emails.
 * The limiter is in-memory, which is right for this single-instance setup.
 */
interface GuardConfig {
  fields: string[];
  requireTrue?: string[];
  lowercase?: string[];
  /** Draft & Publish types: always create as a draft, whatever the request asks. */
  forceDraft?: boolean;
}

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

export default (policyContext: any, config: GuardConfig) => {
  const body = policyContext.request.body;
  const data = body?.data;
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw new errors.ValidationError('Missing form data.');
  }

  if (typeof data.hp_field === 'string' && data.hp_field.trim() !== '') {
    throw new errors.ValidationError('Submission rejected.');
  }

  const key = `${policyContext.request.ip}:${policyContext.request.path}`;
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    throw new errors.RateLimitError('Too many submissions from this connection. Please try again in a few minutes.');
  }
  recent.push(now);
  hits.set(key, recent);

  const clean: Record<string, unknown> = {};
  for (const field of config.fields) {
    if (field in data) clean[field] = data[field];
  }
  for (const field of config.lowercase ?? []) {
    if (typeof clean[field] === 'string') clean[field] = (clean[field] as string).trim().toLowerCase();
  }
  for (const field of config.requireTrue ?? []) {
    if (clean[field] !== true) throw new errors.ValidationError(`${field} must be accepted.`);
  }
  body.data = clean;
  // Assigning request.query re-serialises the query string the controller
  // reads, so this overrides any `status=published` the caller sent.
  if (config.forceDraft) policyContext.request.query = { ...policyContext.request.query, status: 'draft' };
  return true;
};
