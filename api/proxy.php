<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

// ----- CORS -----
if (isset($_SERVER['HTTP_ORIGIN'])) {
    // Дозволяємо рівно той origin, звідки прийшов запит
    header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN']);
} else {
    // Фолбек (наприклад, для curl)
    header("Access-Control-Allow-Origin: *");
}

header("Vary: Origin");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json; charset=utf-8');

// Якщо preflight-запит (OPTIONS) — відповідаємо й завершуємося
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204); // No Content
    exit;
}

// ----- Далі твій проксі -----

$baseUrl = "https://script.google.com/macros/s/AKfycbyWg0D7o-Dy9IXqH5NQMKzvRCIAAPJg6HxP_E5ap3UDYhqk10CRUiwtI5WEEt215T3MCA/exec";

// Проксі передає всі GET-параметри (user, mode, debug тощо)
$query = http_build_query($_GET);
$url = $baseUrl . ($query ? ('?' . $query) : '');

// ---- 1. Якщо є cURL — використовуємо його ----
if (function_exists('curl_init')) {
    $ch = curl_init();
    curl_setopt_array($ch, [
        CURLOPT_URL            => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_TIMEOUT        => 10,
    ]);

    $response = curl_exec($ch);

    if ($response === false) {
        $err  = curl_error($ch);
        $code = curl_errno($ch);
        curl_close($ch);

        http_response_code(502);
        echo json_encode([
            'error'   => true,
            'source'  => 'curl',
            'code'    => $code,
            'message' => 'cURL error: ' . $err,
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($httpCode !== 200) {
        http_response_code(502);
        echo json_encode([
            'error'    => true,
            'source'   => 'curl',
            'httpCode' => $httpCode,
            'message'  => 'Apps Script HTTP ' . $httpCode,
            'response' => $response,
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    echo $response;
    exit;
}

// ---- 2. Fallback: file_get_contents ----
if (!ini_get('allow_url_fopen')) {
    http_response_code(500);
    echo json_encode([
        'error'   => true,
        'source'  => 'php',
        'message' => 'Неможливо зробити HTTP-запит: немає cURL і вимкнено allow_url_fopen.',
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

$context = stream_context_create([
    'http' => [
        'method'  => 'GET',
        'timeout' => 10,
    ]
]);

$response = @file_get_contents($url, false, $context);

if ($response === false) {
    http_response_code(502);
    echo json_encode([
        'error'   => true,
        'source'  => 'file_get_contents',
        'message' => 'Не вдалося отримати відповідь від Apps Script (file_get_contents).',
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

echo $response;
exit;
