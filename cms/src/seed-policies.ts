import type { Core } from '@strapi/strapi';

/**
 * About – Text Pages → the two policy pages linked from the footer:
 *   /about/privacy        Privacy Policy
 *   /about/accessibility  Accessibility Statement
 * Created once, only if no page with that address exists, so anything staff
 * edit or replace is never overwritten. The wording describes what the
 * website actually does (checked against its code), in the simple Markdown
 * the page template understands: ## headings, - lists, **bold**, [links](…).
 * The Office of the President / the College should review the wording
 * before launch. Edit it in Content Manager → About – Text Pages.
 */

const UID = 'api::page.page';
const OWNER_SLUG = 'ict-and-digital-services';
const STORE = { type: 'core', name: 'seeds', key: 'policy_pages_version' } as const;
const VERSION = 1;

const contactLines = (email: string, phone: string, address: string) =>
  [`- Email: [${email}](mailto:${email})`, phone && `- Telephone: ${phone}`, address && `- Post: ${address}`, '- Or use our [contact page](/about/contact) to find the right office.']
    .filter(Boolean)
    .join('\n');

const privacy = (email: string, phone: string, address: string) => `Sherubtse College, a constituent college of the Royal University of Bhutan, respects your privacy. This page explains what information this website collects, why, and the choices you have. We have tried to keep it short and in plain language.

## The short version

- We do **not** use advertising or tracking cookies, and we do not run analytics that follow you around the web.
- We only collect personal information when **you send it to us** through a form on this website.
- We do not sell your information or use it for advertising.
- You can ask us to correct or delete what you have sent us at any time.

## Information you give us

When you use one of our forms, we collect the details you type in so that the right office can reply to you or keep a record of your request.

- **Admission enquiries:** your name, email address, telephone number (if you give it), whether you are applying as a Bhutanese or international applicant, the programme and topic you ask about, and your message.
- **Contact enquiries:** your name, email address, telephone number (if you give it), the subject and department you choose, and your message.
- **Alumni registration:** your name and contact details, your programme and year of graduation, where you work or live, your interests, and whether you agree to be included in the alumni directory.
- **Newsletter:** your email address, and your consent to receive the newsletter.

Forms that need your agreement (such as the newsletter and the alumni directory) ask you to tick a box first. Please do not put sensitive information, such as passwords or identity numbers, in a message.

## How we use it

- To answer your question or pass it to the office that can help.
- To process your request, such as sending the newsletter you asked for.
- To keep the College's normal records of enquiries and to improve our service.

Enquiries are stored in the College's content management system. They are read by the staff of the office the enquiry is for, and by the staff who look after this website. We do not share them with anyone outside the College, except where the law requires it.

## The College assistant

The "Ask Sherubtse" assistant answers questions using the public pages of this website only. When you ask it a question:

- Your question, and the few public passages of this website that match it, are sent to **Google's Gemini service**, which writes the answer.
- The assistant has no access to staff systems or to the forms described above, and it will not discuss them.
- Your conversation is kept in your browser only until you close the tab. The assistant does not keep a record of who asked what, and it is not linked to your name.

Please do not type personal or confidential information into the assistant.

## Cookies and what your browser remembers

This website does **not** set cookies of its own. It remembers a few small preferences in your browser, so the page works the way you left it. None of these leave your device:

- your chosen text size on news articles;
- whether you paused the video on the home page;
- which applicant group (Bhutanese or international) you picked on the Admissions page;
- your conversation with the assistant, until you close the tab.

You can clear these at any time in your browser's settings. Fonts are served from this website, not from an outside provider.

## Other websites

Some pages link to, or embed items from, other services, for example Google Maps, a video on the History page, the College's library and virtual learning environment, and the Royal University of Bhutan's website. When you open or play them, those services may set their own cookies or collect their own information. Their privacy policies apply, not this one.

## Keeping it safe

Our forms are protected against automated spam, and access to the content management system is limited to College staff with accounts. No website can be completely secure, so please take care with what you send.

## How long we keep it

We keep enquiries and registrations only as long as we need them to deal with your request and for the College's normal records. Newsletter addresses are kept for as long as you stay subscribed.

## Your choices

You can ask us to:

- tell you what information we hold about you;
- correct it if it is wrong;
- delete it, or stop sending you the newsletter.

## Contact us

${contactLines(email, phone, address)}

## Changes to this policy

If we change how this website handles information, we will update this page. The date it was last reviewed is shown at the top.`;

const accessibility = (email: string, phone: string, address: string) => `Sherubtse College wants everyone to be able to use this website, including people who use screen readers, keyboards, voice control or magnification, people with low vision or colour blindness, and people on small screens or slow connections. This page describes what we have done and where we still fall short.

## Our aim

We aim for this website to meet the **Web Content Accessibility Guidelines (WCAG) 2.2, level AA**. The website has not yet been independently audited, so we do not claim full conformance. We test as we build and will fix problems as we find them.

## What we do

- **Keyboard:** links, buttons, menus, tabs and the College assistant are designed to be used with the keyboard alone. A "Skip to main content" link appears first when you press Tab.
- **Focus:** a strong gold outline shows where you are on the page.
- **Screen readers:** pages use headings, landmarks and labelled controls. We add descriptive text to images that carry meaning and hide purely decorative ones. The search results and the assistant announce new content as it appears.
- **Colour and contrast:** the navy and gold colours were chosen for strong contrast, for example navy text on white is well above the AA requirement. We try not to rely on colour alone to give information.
- **Reduced motion:** the website has gentle animations, such as scrolling photos, counting numbers and floating panels. If your device is set to "reduce motion", they stop. Photo shows and scrolling lists can also be paused, and the video on the home page has a pause button.
- **Text size:** you can enlarge text with your browser, and pages reflow without sideways scrolling down to phone width. News articles also have a text-size control.
- **Small screens:** the website works on phones and tablets, with a bottom navigation bar on phones.
- **Forms:** form fields are labelled, required fields are marked, and error messages say what to fix.

## Known limitations

- Some **older documents**, forms and scanned PDFs, such as past notices, newsletters and forms, may not be fully accessible to screen readers. If you cannot use one, tell us and we will provide the information in another way.
- Some **older news photos** may have short descriptions. We are improving them.
- **Linked and embedded services**, such as the library, the virtual learning environment, videos and Google Maps, are run by others and may not meet the same standard.
- The **College assistant** is a text tool that depends on a third-party service, and it may occasionally be slow or unavailable. The search page and the menus always work as an alternative.

## Tell us about a problem

If something on this website is hard to use, or you need information in another format, such as large print, a different file type or a phone call, please tell us. Say what page you were on, what you were trying to do, and what device or assistive technology you use. We will reply and try to put it right.

${contactLines(email, phone, address)}

## Review

We review this statement whenever the website changes in a significant way. The date it was last reviewed is shown at the top.`;

export async function ensurePolicyPages({ strapi }: { strapi: Core.Strapi }) {
  if ((Number(await strapi.store.get(STORE)) || 0) >= VERSION) return;
  const docs = strapi.documents(UID as any) as any;
  const owner = await strapi.documents('api::unit.unit' as any).findFirst({ filters: { slug: { $eq: OWNER_SLUG } } } as any);
  const settings: any = await strapi.documents('api::site-settings.site-settings' as any).findFirst();
  const email = settings?.official_emails?.[0] ?? 'info@sherubtse.edu.bt';
  const phone = settings?.phones?.[0] ?? '';
  const address = settings?.address ?? '';
  const today = new Date().toISOString().slice(0, 10);

  const pages = [
    { slug: 'privacy', title: 'Privacy Policy', body: privacy(email, phone, address) },
    { slug: 'accessibility', title: 'Accessibility Statement', body: accessibility(email, phone, address) },
  ];
  for (const p of pages) {
    const existing = await docs.findFirst({ filters: { slug: { $eq: p.slug } }, status: 'draft' });
    if (existing || !owner) continue;
    const created = await docs.create({
      data: { ...p, owning_unit: owner.documentId, last_reviewed: today, review_interval: 'annual' },
    });
    await docs.publish({ documentId: created.documentId });
  }
  await strapi.store.set({ ...STORE, value: VERSION });
}
