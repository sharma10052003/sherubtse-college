import type { Core } from '@strapi/strapi';
import { applyAdminHelp, type HelpMap } from './admin-help';

const UID = 'api::chat-assistant.chat-assistant';

/** Small wording on the chat panel. {count} is filled in by the website. */
export const LABELS = {
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

/**
 * Each seed version lists the wording for the fields it introduced, so admins
 * open a filled-in form. A version only fills fields that are empty.
 */
const VERSIONS: { fill: Record<string, unknown> }[] = [
  // v1 — the first assistant
  {
    fill: {
      enabled: true,
      title: 'Ask Sherubtse',
      subtitle: 'Answers from this website',
      launcher_label: 'Ask a question',
      greeting:
        'Kuzuzangpo! I can help you find information on this website — admissions, programmes, notices, offices, facilities and more. Type a question or choose a topic below.',
      quick_questions: [
        { label: 'Admissions', question: 'admissions' },
        { label: 'Programmes', question: 'programmes' },
        { label: 'Fees & scholarships', question: 'fees scholarship' },
        { label: 'Latest notices', question: 'announcements' },
        { label: 'Library', question: 'library' },
        { label: 'Contact an office', question: 'contact' },
      ],
      placeholder: 'Type your question…',
      results_intro: 'Here’s what I found on the website:',
      see_all_label: 'See all {count} results',
      no_results_message:
        'Sorry, I couldn’t find that on the website. Try different words, pick a topic below, or contact the College directly.',
      blocked_message:
        'I can only help with information that is published on this website for the public. For anything else, please contact the College.',
      extra_blocked_words: '',
      thanks_message: 'You’re welcome! Is there anything else I can help you find?',
      contact_label: 'Contact the College',
      contact_url: '/about/contact',
      labels: LABELS,
    },
  },
  // v2 — AI answers: new small wording (added to the existing labels)
  { fill: { labels: LABELS } },
  // v3 — the greeting bubble next to the round chat button
  { fill: { labels: LABELS } },
  // v4 — “still looking” note while the AI is slow
  { fill: { labels: LABELS } },
];

const STORE = { type: 'core', name: 'seeds', key: 'chat_assistant_version' } as const;

const isEmpty = (v: unknown) => v === null || v === undefined || v === '' || (Array.isArray(v) && v.length === 0);

const HELP: HelpMap = {
  [`content_types::${UID}`]: {
    fields: {
      enabled: 'Untick to hide the assistant on every page.',
      title: 'Name shown at the top of the chat panel.',
      subtitle: 'Small line under the name.',
      launcher_label: 'Tooltip on the round chat button.',
      greeting: 'First message visitors see.',
      quick_questions: 'Topic buttons under the greeting. “Question” is what gets searched; leave it empty to search the label.',
      placeholder: 'Grey hint inside the typing box.',
      results_intro: 'Line above the answers.',
      see_all_label: 'Link to the full search page. {count} becomes the number of results.',
      no_results_message: 'Reply when nothing on the website matches.',
      blocked_message:
        'Reply when someone asks about staff systems (admin panel, logins, passwords and similar). The assistant never answers those, whatever this says.',
      extra_blocked_words:
        'Optional extra words, separated by commas, that should get the reply above. The built-in safety list always applies too.',
      thanks_message: 'Reply when someone says thank you.',
      contact_label: 'Link shown when there is no answer.',
      contact_url: 'Where that link goes, e.g. /about/contact',
      labels: 'Small wording on the chat panel (buttons, status messages, and bubble_text: the greeting bubble beside the round button). Edit the text after each colon only.',
    },
  },
  'components::chat.quick-question': {
    mainField: 'label',
    fields: {
      label: 'Text on the button.',
      question: 'What is searched when it is clicked. Leave empty to use the button text.',
    },
  },
};

/**
 * Brings the Chat Assistant entry up to the latest seed version, once.
 * Empty fields get the default wording; anything an admin wrote is kept.
 */
export async function ensureChatAssistant({ strapi }: { strapi: Core.Strapi }) {
  const done = Number(await strapi.store.get(STORE)) || 0;
  if (done < VERSIONS.length) {
    const docs = strapi.documents(UID as any);
    const existing: any = await docs.findFirst({ populate: ['quick_questions'] } as any);
    if (!existing) {
      const data: Record<string, unknown> = {};
      for (const v of VERSIONS) Object.assign(data, v.fill);
      await docs.create({ data } as any);
    } else {
      const changes: Record<string, unknown> = {};
      for (const v of VERSIONS.slice(done)) {
        for (const [key, value] of Object.entries(v.fill)) {
          if (key === 'labels' && existing.labels && typeof existing.labels === 'object') {
            // Add only the label keys that are missing; edited ones stay.
            const merged = { ...(value as Record<string, string>), ...(changes.labels as object ?? existing.labels) };
            if (Object.keys(merged).length > Object.keys(existing.labels).length) changes.labels = merged;
          } else if (isEmpty(existing[key]) && !(key in changes)) changes[key] = value;
        }
      }
      if (Object.keys(changes).length > 0) await docs.update({ documentId: existing.documentId, data: changes } as any);
    }
    await strapi.store.set({ ...STORE, value: VERSIONS.length });
  }

  await applyAdminHelp({
    strapi,
    help: HELP,
    prefixes: ['content_types::api::chat-assistant', 'components::chat.'],
    storeKey: 'chat_assistant_main_fields_set',
  });
}
