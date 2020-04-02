<?php

session_start();

$input = $_GET['input'] ?? null;
if (isset($input)) {
    $_SESSION['input'] = $input;
}
$input = $_SESSION['input'];

$sessionId = session_id();
$serverIP = $_SERVER['SERVER_ADDR'];

echo <<<HTML
Hello, App 3! This is multiple tasks but local session. <br/>
<strong>Session ID</strong>: {$sessionId}<br/>
<strong>Host IP</strong>: {$serverIP}<br/>
<strong>Session Value</strong>: {$input}<br/>
HTML
;