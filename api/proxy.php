<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

$user = urlencode($_GET['user'] ?? '');
$url = "https://script.google.com/macros/s/AKfycbwh7EP4_Awgip2AIlT7fvGcmqxN-tW9TohgFq7e12f6dOZPxgd7FdPws6ECr6YdBu5oTw/exec?user=$user";

echo file_get_contents($url);
?>