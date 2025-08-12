<?php
require 'config.php';

$url = 'https://api.turbosms.ua/message/send.json';

$payload = [
    'recipients' => [ '380632209770' ], // номер у форматі без "+"
    'sms' => [
        'sender' => SENDER,         // зареєстрований Альфа-ім'я
        'text' => 'Привіт! Це тестове SMS.' 
    ]
];

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer ' . API_TOKEN,
    'Content-Type: application/json'
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
// Не встановлюємо тайм-аут, щоб уникнути дублювання
// curl_setopt($ch, CURLOPT_TIMEOUT, 0);

$response = curl_exec($ch);
if ($response === false) {
    throw new Exception('cURL error: ' . curl_error($ch));
}

curl_close($ch);

$data = json_decode($response, true);
print_r($data);