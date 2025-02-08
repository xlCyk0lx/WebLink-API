<?php
header('Content-Type: application/json');

// Get API key from URL
$apiKey = $_GET['key'] ?? null;

if (!$apiKey) {
    echo json_encode([
        'status' => 'error',
        'message' => 'No API key provided'
    ]);
    exit;
}

// Read player data from storage
$dataFile = "../data/players/" . $apiKey . ".json";
if (file_exists($dataFile)) {
    $playerData = json_decode(file_get_contents($dataFile), true);
    echo json_encode([
        'status' => 'success',
        'data' => $playerData
    ]);
} else {
    echo json_encode([
        'status' => 'error',
        'message' => 'Invalid API key'
    ]);
}
