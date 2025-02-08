<?php
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

if ($data && isset($data['apiKey'])) {
    $storageDir = "data/players/";
    if (!is_dir($storageDir)) {
        mkdir($storageDir, 0777, true);
    }

    file_put_contents(
        $storageDir . $data['apiKey'] . ".json",
        json_encode($data, JSON_PRETTY_PRINT)
    );

    echo json_encode([
        'status' => 'success',
        'message' => 'Data stored successfully'
    ]);
} else {
    echo json_encode([
        'status' => 'error',
        'message' => 'Invalid data received'
    ]);
}
