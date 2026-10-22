import { strapiGet, mediaUrl } from '../strapi';
import type { StrapiListResponse, StrapiSingleResponse } from '../strapi';
import { renderArticle, inline } from '../article-text';

/**
 * Admissions content from Strapi. Four places in the admin:
 *   Admission – Page Settings            → the /admissions landing page
 *   Admission – Bhutanese Applicants     → /admissions/bhutanese
 *   Admission – International Applicants → /admissions/international
 *   Admission – Enquiry Form Settings    → the enquiry form
 * plus Notices with Category “Admissions” (each with an applicant audience).
 */

export type Audience = 'bhutanese' | 'international';
export const AUDIENCES: Audience[] = ['bhutanese', 'international'];
const ENDPOINT: Record<Audience, string> = {
  bhutanese: 'admission-bhutanese',
  international: 'admission-international-applicants',
};

/** Formats a YYYY-MM-DD (or ISO) date, e.g. “1 March 2026”. */
export function fmtDate(value: string | null | undefined, opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' }) {
  if (!value) return '';
  const d = new Date(value.length === 10 ? `${value}T00:00:00Z` : value);
  return Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString('en-GB', { ...opts, timeZone: 'UTC' });
}
/** “1–15 March 2026”, “15 April – 5 May 2026”, or a single date. */
export function fmtRange(from: string | null, to: string | null) {
  if (from && to) {
    const [fy, fm] = from.split('-'), [ty, tm] = to.split('-');
    if (fy === ty && fm === tm) return `${fmtDate(from, { day: 'numeric' })}–${fmtDate(to)}`;
    if (fy === ty) return `${fmtDate(from, { day: 'numeric', month: 'long' })} – ${fmtDate(to)}`;
    return `${fmtDate(from)} – ${fmtDate(to)}`;
  }
  return fmtDate(from || to);
}

const html = (md: string | null | undefined) => (md && md.trim() ? renderArticle(md).html : null);
const text = (s: string | null | undefined) => (s && s.trim() ? s.trim() : null);

/** “Title — detail” lines (one per line) → items; detail may hold [links](…). */
function splitLines(value: string | null | undefined) {
  return (value ?? '')
    .split(/\r?\n/)
    .map((l) => l.replace(/^\s*(?:[-*•]|\d+[.)])\s+/, '').trim())
    .filter(Boolean)
    .map((l) => {
      const m = l.match(/^(.+?)\s+[—–-]\s+(.+)$/);
      return m ? { title_html: inline(m[1]), detail_html: inline(m[2]) } : { title_html: inline(l), detail_html: null };
    });
}
export type LineItem = ReturnType<typeof splitLines>[number];

export interface Fact { label: string; value: string }
export interface Route {
  title: string;
  for_programmes: string | null;
  description: string | null;
  opens_on: string | null;
  closes_on: string | null;
  steps: LineItem[];
  portal: { label: string; url: string } | null;
}
export interface Requirement { programme: string; minimum: string; selection: string | null; seats: string | null }
export interface Fee { item: string; amount: string; period: string | null; note: string | null }
export interface Scholarship {
  title: string;
  summary: string | null;
  eligibility: string[];
  how_to_apply: string | null;
  deadline: string | null;
  link: { label: string; url: string } | null;
}
export interface Faq { question: string; answer_html: string }
export interface InfoBlock { title: string; body_html: string }
export interface Contact { name: string; role: string | null; email: string | null; phone: string | null; note: string | null }
export interface LinkItem { label: string; url: string; external: boolean }

export interface AudienceGuide {
  audience: Audience;
  card_title: string;
  card_description: string | null;
  intro: string | null;
  key_facts: Fact[];
  apply_intro_html: string | null;
  routes: Route[];
  documents: LineItem[];
  requirements_intro_html: string | null;
  requirements: Requirement[];
  fees_intro_html: string | null;
  fees: Fee[];
  fees_note_html: string | null;
  scholarships_intro_html: string | null;
  scholarships: Scholarship[];
  faqs: Faq[];
  more_info: InfoBlock[];
  contacts: Contact[];
  links: LinkItem[];
}

const DEFAULT_TITLES: Record<Audience, string> = { bhutanese: 'Bhutanese applicants', international: 'International applicants' };

export async function getAudienceGuide(audience: Audience): Promise<AudienceGuide> {
  const res = await strapiGet<StrapiSingleResponse<any>>(ENDPOINT[audience], { populate: '*' });
  const d = res?.data ?? {};
  const rows = (k: string) => (Array.isArray(d[k]) ? d[k] : []) as any[];
  return {
    audience,
    card_title: d.card_title || DEFAULT_TITLES[audience],
    card_description: text(d.card_description),
    intro: text(d.intro),
    key_facts: rows('key_facts').filter((f) => f.label && f.value).map((f) => ({ label: f.label, value: f.value })),
    apply_intro_html: html(d.apply_intro),
    routes: rows('application_routes')
      .filter((r) => r.title)
      .map((r) => ({
        title: r.title,
        for_programmes: text(r.for_programmes),
        description: text(r.description),
        opens_on: r.opens_on ?? null,
        closes_on: r.closes_on ?? null,
        steps: splitLines(r.steps),
        portal: r.portal_url ? { label: r.portal_label || 'Apply', url: r.portal_url } : null,
      })),
    documents: splitLines(d.required_documents),
    requirements_intro_html: html(d.requirements_intro),
    requirements: rows('requirements')
      .filter((r) => r.programme && r.minimum)
      .map((r) => ({ programme: r.programme, minimum: r.minimum, selection: text(r.selection), seats: text(r.seats) })),
    fees_intro_html: html(d.fees_intro),
    fees: rows('fees').filter((f) => f.item && f.amount).map((f) => ({ item: f.item, amount: f.amount, period: text(f.period), note: text(f.note) })),
    fees_note_html: html(d.fees_note),
    scholarships_intro_html: html(d.scholarships_intro),
    scholarships: rows('scholarships')
      .filter((s) => s.title)
      .map((s) => ({
        title: s.title,
        summary: text(s.summary),
        eligibility: (s.eligibility ?? '').split(/\r?\n/).map((l: string) => l.replace(/^\s*[-*•]\s+/, '').trim()).filter(Boolean),
        how_to_apply: text(s.how_to_apply),
        deadline: s.deadline ?? null,
        link: s.link_url ? { label: s.link_label || 'Details', url: s.link_url } : null,
      })),
    faqs: rows('faqs').filter((f) => f.question && f.answer).map((f) => ({ question: f.question, answer_html: html(f.answer) ?? '' })),
    more_info: rows('more_info').filter((b) => b.title && b.body).map((b) => ({ title: b.title, body_html: html(b.body) ?? '' })),
    contacts: rows('contacts')
      .filter((c) => c.name)
      .map((c) => ({ name: c.name, role: text(c.role), email: text(c.email), phone: text(c.phone), note: text(c.note) })),
    links: rows('links').filter((l) => l.label && l.url).map((l) => ({ label: l.label, url: l.url, external: /^https?:\/\//i.test(l.url) })),
  };
}

// ---------------------------------------------------------------------------

const LABEL_DEFAULTS = {
  card_button: "See how to apply",
  switch_label: "Applying as someone else?",
  tab_apply: "How to Apply",
  tab_requirements: "Requirements",
  tab_fees: "Fees",
  tab_scholarships: "Scholarships",
  tab_notices: "Notices",
  tab_faqs: "FAQs",
  tab_more: "More Info",
  tab_contact: "Contact",
  documents_heading: "Documents you need",
  status_open: "Open now",
  status_upcoming: "Opens soon",
  status_closed: "Closed",
  deadline_label: "Apply by",
  minimum_label: "Minimum",
  selection_label: "Selection",
  seats_label: "Seats",
  links_heading: "Useful links & forms",
  notices_empty: "There are no current admission notices.",
  notices_past: "Past notices",
  notices_all: "All announcements",
  ask_button: "Ask a question",
  filter_all: "Everyone",
  date_next: "Next",
  date_passed: "Passed",
  faq_expand: "Open all",
  faq_collapse: "Close all",
};
export type Labels = typeof LABEL_DEFAULTS;

export interface KeyDate { date: string; label: string; audience: 'all' | Audience }
export interface AdmissionsPage {
  eyebrow: string | null;
  heading: string;
  subtitle: string | null;
  intro: string | null;
  hero_image: { url: string; alt: string } | null;
  choose_heading: string;
  choose_intro: string | null;
  dates_heading: string;
  dates_intro: string | null;
  key_dates: KeyDate[];
  notices_heading: string;
  help_heading: string;
  help_intro: string | null;
  labels: Labels;
  seo_title: string | null;
  seo_description: string | null;
}

export async function getAdmissionsPage(): Promise<AdmissionsPage> {
  const res = await strapiGet<StrapiSingleResponse<any>>('admissions-overview', { populate: ['hero_image', 'key_dates', 'labels', 'seo'] });
  const p = res?.data ?? {};
  const heroUrl = mediaUrl(p.hero_image);
  return {
    eyebrow: text(p.eyebrow),
    heading: p.heading || 'Admissions',
    subtitle: text(p.subtitle),
    intro: text(p.intro),
    hero_image: heroUrl ? { url: heroUrl, alt: p.hero_image_alt ?? '' } : null,
    choose_heading: p.choose_heading || 'Who’s applying?',
    choose_intro: text(p.choose_intro),
    dates_heading: p.dates_heading || 'Key dates',
    dates_intro: text(p.dates_intro),
    key_dates: ((p.key_dates ?? []) as any[])
      .filter((k) => k.date && k.label)
      .map((k) => ({ date: k.date, label: k.label, audience: k.audience || 'all' }))
      .sort((a, b) => a.date.localeCompare(b.date)),
    notices_heading: p.notices_heading || 'Admission notices',
    help_heading: p.help_heading || 'Still have a question?',
    help_intro: text(p.help_intro),
    labels: Object.fromEntries(Object.entries(LABEL_DEFAULTS).map(([k, v]) => [k, text(p.labels?.[k]) ?? v])) as Labels,
    seo_title: p.seo?.title ?? null,
    seo_description: p.seo?.description ?? null,
  };
}

// ---------------------------------------------------------------------------

export interface AdmissionNotice {
  id: number;
  title: string;
  summary: string | null;
  audience: 'all' | Audience;
  published: string;
  closes: string | null;
  expires: string | null;
  archived: boolean;
  featured: boolean;
  urgent: boolean;
}

export async function getAdmissionNotices(): Promise<AdmissionNotice[]> {
  const res = await strapiGet<StrapiListResponse<any>>('notices', {
    filters: { category: { $eq: 'admissions' } },
    fields: ['title', 'summary', 'admission_audience', 'publish_at', 'publishedAt', 'application_closes', 'expires_at', 'is_archived', 'is_featured', 'urgency'],
    sort: ['publish_at:desc'],
    pagination: { pageSize: 100 },
  });
  return ((res?.data ?? []) as any[]).map((n) => ({
    id: n.id,
    title: n.title,
    summary: text(n.summary),
    audience: n.admission_audience || 'all',
    published: n.publish_at || n.publishedAt,
    closes: n.application_closes ?? null,
    expires: n.expires_at ?? null,
    archived: !!n.is_archived,
    featured: !!n.is_featured,
    urgent: n.urgency === 'urgent',
  }));
}

export const noticesFor = (all: AdmissionNotice[], audience: Audience) => all.filter((n) => n.audience === 'all' || n.audience === audience);

// ---------------------------------------------------------------------------

export interface EnquirySettings {
  title: string;
  introduction: string | null;
  labels: Record<'name' | 'email' | 'phone' | 'applicant' | 'programme' | 'category' | 'message' | 'consent' | 'submit', string>;
  show_phone: boolean;
  phone_required: boolean;
  show_programme: boolean;
  programme_required: boolean;
  categories: string[];
  confirmation: string;
  error: string;
  privacy_notice: string | null;
  privacy_url: string | null;
  programmes: string[];
}

export async function getEnquirySettings(): Promise<EnquirySettings> {
  const [settings, progs] = await Promise.all([
    strapiGet<StrapiSingleResponse<any>>('admission-enquiry-setting', { populate: { enquiry_categories: { fields: ['label'] } } }),
    strapiGet<StrapiListResponse<any>>('programmes', { fields: ['programme_name', 'display_order'], sort: ['display_order:asc', 'programme_name:asc'], pagination: { pageSize: 100 } }),
  ]);
  const e = settings?.data ?? {};
  return {
    title: e.title || 'Ask an Admissions Question',
    introduction: text(e.introduction),
    labels: {
      name: e.name_label || 'Full name',
      email: e.email_label || 'Email address',
      phone: e.phone_label || 'Phone number',
      applicant: e.applicant_category_label || 'I am applying as',
      programme: e.programme_label || 'Programme of interest',
      category: e.enquiry_category_label || 'Your question is about',
      message: e.message_label || 'Your question',
      consent: e.consent_label || 'I agree that Sherubtse College may use these details to reply to my enquiry.',
      submit: e.submit_label || 'Send enquiry',
    },
    show_phone: e.show_phone !== false,
    phone_required: !!e.phone_required,
    show_programme: e.show_programme !== false,
    programme_required: !!e.programme_required,
    categories: (e.enquiry_categories ?? []).map((o: any) => o?.label).filter(Boolean),
    confirmation: e.confirmation_message || 'Thank you — your enquiry has been received. The Admissions team will reply by email.',
    error: e.error_message || 'Sorry, your enquiry could not be sent. Please try again, or contact the Admissions team directly.',
    privacy_notice: text(e.privacy_notice),
    privacy_url: text(e.privacy_policy_url),
    programmes: ((progs?.data ?? []) as any[]).map((p) => p.programme_name).filter(Boolean),
  };
}
