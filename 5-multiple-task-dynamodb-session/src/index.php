<?php
require '../vendor/autoload.php';

use Aws\DynamoDb\DynamoDbClient;

$client = new DynamoDbClient(array_filter([
    'version' => '2012-08-10',
    'region' => $_ENV['AWS_REGION'],
    'endpoint' => $_ENV['DYNAMODB_ENDPOINT_URL'] ?? null
]));
$sessionHandler = $client->registerSessionHandler(array_filter([
    'table_name' => $_ENV['DYNAMODB_SESSION_TABLE_NAME']
]));
$sessionHandler->register();

session_start();

$input = $_GET['input'] ?? null;
if (isset($input)) {
    $_SESSION['input'] = $input;
}
$input = $_SESSION['input'];

$sessionId = session_id();
$serverIP = $_SERVER['SERVER_ADDR'];

echo <<<HTML
Hello, App 5! This is multiple tasks but centralized session. <br/>
<strong>Session ID</strong>: {$sessionId}<br/>
<strong>Host IP</strong>: {$serverIP}<br/>
<strong>Session Value</strong>: {$input}<br/>
HTML
;