/**
 * Shared shape for the one "Unit" template that renders Unit, ClubRecord
 * and ResearchCentre identically (Stack doc §06 wireframe: "identical for
 * every department, administrative unit, research centre and club").
 * Each content module maps its own Strapi type into this shape.
 */
export interface UnitLike {
  kind: 'academic' | 'administrative' | 'research_centre' | 'student_body' | 'club';
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  photo_url: string | null;
  head?: { full_name: string; slug: string } | null;
  contact?: { email?: string | null; phone?: string | null; office?: string | null; hours?: string | null } | null;
  last_reviewed: string;
}
