<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

$user = urlencode($_GET['user'] ?? '');
$url = "https://script.google.com/macros/s/AKfycbzw6008EncsbBkpVdaiRxXmY5hSirYqPCWo2ZspG9Ba_8C83EK-aPQnXTCNTX-NJZwHzA/exec?user=$user";

echo file_get_contents($url);
?>
