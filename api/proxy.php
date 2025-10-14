<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

$month = urlencode($_GET['month'] ?? '');
$user = urlencode($_GET['user'] ?? '');
$url = "https://script.google.com/macros/s/AKfycbwk9FlN1pfUjQdqlXVuTwP1J_0EI3_76RmbsvLfrM6SgFisdTlipbXeGdvqX_TxGE3XOg/exec?month=$month&user=$user";

echo file_get_contents($url);
?>