<?php
/**
 * AcademicResources.php — data access for the 4 Academic Resources pages
 * (/academics/calendar, /academics/guide, /academics/reassessment-timetable,
 * /academics/timetable). Same try-Strapi/fall-back pattern as every other
 * model in this project.
 */
if (!defined('SHERUBTSE_INIT')) {
    http_response_code(403);
    exit('Forbidden');
}

require_once __DIR__ . '/../strapi-client.php';

/** Academic Calendar (Single Type), or null if not set up yet / unreachable. */
function stc_get_academic_calendar(): ?array
{
    $res = stc_strapi_get('academic-calendar', ['populate' => ['calendar_pdf']]);
    $row = $res['data'] ?? null;
    if (!$row) {
        return null;
    }
    $row['calendar_pdf_url'] = stc_strapi_media_url($row['calendar_pdf'] ?? null);
    unset($row['calendar_pdf']);
    return $row;
}

/** Academic Guide (Single Type), or null if not set up yet / unreachable. */
function stc_get_academic_guide(): ?array
{
    $res = stc_strapi_get('academic-guide', ['populate' => ['guide_pdf']]);
    $row = $res['data'] ?? null;
    if (!$row) {
        return null;
    }
    $row['guide_pdf_url'] = stc_strapi_media_url($row['guide_pdf'] ?? null);
    unset($row['guide_pdf']);
    return $row;
}

/** Lightweight {programme_name, slug} pairs for filter/cascading selects. */
function stc_get_programme_options(): array
{
    $res = stc_strapi_get('programmes', [
        'fields'     => ['programme_name', 'slug'],
        'sort'       => 'programme_name:asc',
        'pagination' => ['pageSize' => 100],
    ]);
    return $res['data'] ?? [];
}

/**
 * Reassessment timetable entries, optionally filtered by programme slug
 * and/or semester.
 * @param array{programme?:string,semester?:string} $args
 */
function stc_get_reassessment_timetable(array $args = []): array
{
    $filters = [];
    if (!empty($args['programme'])) {
        $filters['programme'] = ['slug' => ['$eq' => $args['programme']]];
    }
    if (!empty($args['semester'])) {
        $filters['semester'] = ['$eq' => $args['semester']];
    }

    $res = stc_strapi_get('reassessment-timetables', [
        'filters'    => $filters,
        'populate'   => ['programme', 'document'],
        'sort'       => 'published_date:desc',
        'pagination' => ['pageSize' => 100],
    ]);
    $rows = $res['data'] ?? [];

    return array_map(static function (array $row): array {
        $row['document_url'] = stc_strapi_media_url($row['document'] ?? null);
        $row['programme_name'] = $row['programme']['programme_name'] ?? '';
        unset($row['document'], $row['programme']);
        return $row;
    }, $rows);
}

/**
 * Programme timetable entries for the cascading Programme -> Year ->
 * Semester selectors on /academics/timetable.
 * @param array{programme?:string,year?:string,semester?:string} $args
 */
function stc_get_programme_timetable(array $args = []): array
{
    $filters = [];
    if (!empty($args['programme'])) {
        $filters['programme'] = ['slug' => ['$eq' => $args['programme']]];
    }
    if (!empty($args['year'])) {
        $filters['year'] = ['$eq' => $args['year']];
    }
    if (!empty($args['semester'])) {
        $filters['semester'] = ['$eq' => $args['semester']];
    }

    $res = stc_strapi_get('programme-timetables', [
        'filters'    => $filters,
        'populate'   => ['programme', 'timetable_file'],
        'sort'       => ['year:asc', 'semester:asc'],
        'pagination' => ['pageSize' => 100],
    ]);
    $rows = $res['data'] ?? [];

    return array_map(static function (array $row): array {
        $row['timetable_file_url'] = stc_strapi_media_url($row['timetable_file'] ?? null);
        $row['programme_name'] = $row['programme']['programme_name'] ?? '';
        $row['programme_slug'] = $row['programme']['slug'] ?? '';
        unset($row['timetable_file'], $row['programme']);
        return $row;
    }, $rows);
}
