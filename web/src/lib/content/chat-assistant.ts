import { strapiGet } from '../strapi';
import type { StrapiSingleResponse } from '../strapi';

/**
 * The “Ask Sherubtse” assistant (Strapi: Global – Chat Assistant). It answers
 * from public website content only — see components/ChatAssistant.astro.
 */
export interface ChatAssistantConfig {
  title: string;
  subtitle: string;
  launcher_label: string;
  greeting: string;
  quick_questions: { label: string; question: string }[];
  placeholder: string;
  results_intro: string;
  see_all_label: string;
  no_results_message: string;
  blocked_message: string;
  extra_blocked_words: string[];
  thanks_message: string;
  contact: { label: string; url: string } | null;
  labels: Record<keyof typeof LABELS, string>;
}

/** Neutral defaults for the small wording, used for any label left empty. */
const LABELS = {
  open_label: 'Open the chat assistant',
  close_label: 'Close',
  send_label: 'Send',
  restart_label: 'Start over',
  searching_label: 'Searching the website…',
  you_label: 'You',
  assistant_label: 'Assistant',
  unavailable_message: 'The assistant is unavailable right now. Please use the search page or the menu.',
  disclaimer: 'Answers come only from this website.',
  expand_label: 'Larger window',
  sources_label: 'From these pages',
  busy_message: 'Lots of questions right now — here are the matching pages:',
  bubble_text: 'Kuzu zangpola, how can I help you?',
  slow_label: 'Still looking — this can take a few seconds…',
};

const str = (v: unknown, fallback = '') => (typeof v === 'string' && v.trim() ? v.trim() : fallback);

/** Null when the assistant is switched off or Strapi has no entry. */
export async function getChatAssistant(): Promise<ChatAssistantConfig | null> {
  const res = await strapiGet<StrapiSingleResponse<any>>('chat-assistant', { populate: ['quick_questions'] });
  const row = res?.data;
  if (!row || row.enabled === false) return null;
  const raw = row.labels && typeof row.labels === 'object' ? row.labels : {};
  const labels = Object.fromEntries(Object.entries(LABELS).map(([k, v]) => [k, str(raw[k], v)])) as ChatAssistantConfig['labels'];
  return {
    title: str(row.title, 'Ask Sherubtse'),
    subtitle: str(row.subtitle),
    launcher_label: str(row.launcher_label, 'Ask a question'),
    greeting: str(row.greeting),
    quick_questions: ((row.quick_questions ?? []) as any[])
      .filter((q) => str(q?.label))
      .map((q) => ({ label: str(q.label), question: str(q.question, str(q.label)) })),
    placeholder: str(row.placeholder, 'Type your question…'),
    results_intro: str(row.results_intro),
    see_all_label: str(row.see_all_label, 'See all {count} results'),
    no_results_message: str(row.no_results_message),
    blocked_message: str(row.blocked_message, 'I can only help with information published on this website.'),
    extra_blocked_words: str(row.extra_blocked_words)
      .split(/[,\n]/)
      .map((w) => w.trim().toLowerCase())
      .filter(Boolean),
    thanks_message: str(row.thanks_message),
    contact: str(row.contact_label) && str(row.contact_url) ? { label: str(row.contact_label), url: str(row.contact_url) } : null,
    labels,
  };
}
