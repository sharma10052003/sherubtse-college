<?php
/**
 * strapi-client.php — thin read-only client for the Strapi REST API.
 * -----------------------------------------------------------------------
 * Replaces includes/db.php as the data source for the model layer.
 * stc_strapi_get() never throws — any failure (network error, non-2xx
 * status, bad JSON) returns null, so every model function's existing
 * "try the data source, fall back to defaults on failure" pattern keeps
 * working unchanged; only what's inside that check changes from a PDO
 * query to this call.
 * -----------------------------------------------------------------------
 */
if (!defined('SHERUBTSE_INIT')) {
    http_response_code(403);
    exit('Forbidden');
}

/**
 * GETs {STRAPI_URL}/api/{endpoint}?{query}, bearer-authenticated.
 * Returns the decoded response body (['data' => ..., 'meta' => ...]) on
 * success, or null on any failure. Memoized per-request by endpoint+query.
 */
function stc_strapi_get(string $endpoint, array $query = []): ?array
{
    static $cache = [];

    $cacheKey = $endpoint . '?' . http_build_query($query);
    if (array_key_exists($cacheKey, $cache)) {
        return $cache[$cacheKey];
    }

    $url = rtrim(STRAPI_URL, '/') . '/api/' . ltrim($endpoint, '/');
    if ($query) {
        $url .= '?' . http_build_query($query);
    }

    $result = null;

    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER  => true,
        CURLOPT_HTTPHEADER      => ['Authorization: Bearer ' . STRAPI_API_TOKEN],
        CURLOPT_TIMEOUT_MS      => 3000,
        CURLOPT_CONNECTTIMEOUT_MS => 500, // a healthy local Strapi answers in ms; keep the down-fallback path fast even when a page makes several calls
        CURLOPT_IPRESOLVE       => CURL_IPRESOLVE_V4, // avoid the IPv6-then-fallback delay some Windows setups have resolving "localhost"
    ]);
    $body = curl_exec($ch);
    $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlError = curl_errno($ch);
    curl_close($ch);

    if (!$curlError && $body !== false && $status >= 200 && $status < 300) {
        $decoded = json_decode($body, true);
        if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
            $result = $decoded;
        }
    }

    $cache[$cacheKey] = $result;
    return $result;
}

/**
 * Strapi 5's populated media fields come back as
 * {id, url, mime, ...} with a URL relative to the Strapi server.
 * Returns null if $media isn't a usable media object.
 */
function stc_strapi_media_url(?array $media): ?string
{
    if (empty($media['url'])) {
        return null;
    }
    return rtrim(STRAPI_URL, '/') . $media['url'];
}
