<?php

function callService($url) {
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_URL, $url);
    $result = curl_exec($ch);
    curl_close($ch);
    return json_decode($result);
}

$url1 = $_ENV['BACKEND1_URL'];
$url2 = $_ENV['BACKEND2_URL'];

$result1 = callService($url1);
$result2 = callService($url2);

header('Content-Type: application/json');

$return = [
    'frontend' => [
        'ip' => $_SERVER['SERVER_ADDR']
    ],
    'backend1' => $result1,
    'backend2' => $result2,
];
echo json_encode($return);