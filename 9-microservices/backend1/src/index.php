<?php

header('Content-Type: application/json');

$return = [
    'value' => rand(1, 100),
    'ip' => $_SERVER['SERVER_ADDR'],
];
echo json_encode($return);
