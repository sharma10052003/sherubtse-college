import type { AnnouncementType } from './vacancy-announcements';

// Shared between AnnouncementsBoard.tsx (cards, filter tiles) and the detail
// page hero (AnnouncementHero.astro) so every place an announcement's type
// shows up uses the same mark.
export const TYPE_ICONS: Record<AnnouncementType, string> = {
  vacancy_announcement: '<path d="M9 3h6M10 3v6l-5.5 9.5A1.7 1.7 0 0 0 6 21h12a1.7 1.7 0 0 0 1.5-2.5L14 9V3"/>',
  re_vacancy_announcement: '<path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/>',
  shortlisted_written: '<path d="M6 2h9l5 5v15H6z"/><path d="M14 2v6h6M9 13h8M9 17h8"/>',
  shortlisted_viva: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c0-3.6 2.9-6 6.5-6"/><path d="M17 8a3 3 0 1 0-2-5.2"/><path d="M13 21v-2a4 4 0 0 1 4-4h1a4 4 0 0 1 4 4v2"/>',
  selection_result: '<path d="m9 12 2 2 4-4"/><circle cx="12" cy="12" r="9"/>',
  general_notice: '<path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z"/><path d="M10 21h4"/>',
};

export function typeIcon(type: string): string {
  return TYPE_ICONS[type as AnnouncementType] ?? TYPE_ICONS.general_notice;
}
