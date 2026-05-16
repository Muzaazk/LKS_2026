<?php

use Illuminate\Foundation\Application;
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

// Memaksa Laravel mengabaikan subfolder /BACKEND
$uri = $_SERVER['REQUEST_URI'];
if (strpos($uri, '/lks_26/KISI_KISI_JATENG/SERVER_SIDE/BACKEND') === 0) {
    $_SERVER['REQUEST_URI'] = substr($uri, strlen('/lks_26/KISI_KISI_JATENG/SERVER_SIDE/BACKEND'));
}

// Determine if the application is in maintenance mode...
if (file_exists($maintenance = __DIR__ . '/../storage/framework/maintenance.php')) {
    require $maintenance;
}

// Register the Composer autoloader...
require __DIR__ . '/../vendor/autoload.php';

// Bootstrap Laravel and handle the request...
/** @var Application $app */
$app = require_once __DIR__ . '/../bootstrap/app.php';

$app->handleRequest(Request::capture());
