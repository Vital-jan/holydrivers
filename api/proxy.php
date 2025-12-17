<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

$baseUrl = "https://script.google.com/macros/s/AKfycbx5264AvFWU_oB9shgI19fh2sEkzWgyXs_yQFWl6gZafA_S4L9lnr9t9yFDkGqwr4e9DA/exec";
$user = $_GET['user'] ?? '';
$user = trim($user);

if ($user !== '') {
    $url = $baseUrl . '?user=' . urlencode($user);
} else {
    $url = $baseUrl;
}

echo file_get_contents($url);

?>
