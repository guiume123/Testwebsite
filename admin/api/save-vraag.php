<?php
session_start();
header('Content-Type: application/json');

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        throw new Exception('Methode niet toegestaan');
    }

    $payload = json_decode(file_get_contents('php://input'), true);
    if (!is_array($payload)) {
        http_response_code(400);
        throw new Exception('Ongeldige payload');
    }

    $entry = [
        'id' => uniqid('vraag_', true),
        'naam' => trim((string)($payload['naam'] ?? '')),
        'voornaam' => trim((string)($payload['voornaam'] ?? '')),
        'email' => trim((string)($payload['email'] ?? '')),
        'telefoon' => trim((string)($payload['telefoon'] ?? '')),
        'adres' => trim((string)($payload['adres'] ?? '')),
        'woonplaats' => trim((string)($payload['woonplaats'] ?? '')),
        'bericht' => trim((string)($payload['bericht'] ?? '')),
        'submitted_at' => date('c'),
    ];

    if ($entry['naam'] === '' || $entry['email'] === '' || $entry['bericht'] === '') {
        http_response_code(422);
        throw new Exception('Naam, e-mail en bericht zijn verplicht.');
    }

    if (!filter_var($entry['email'], FILTER_VALIDATE_EMAIL)) {
        http_response_code(422);
        throw new Exception('Voer een geldig e-mailadres in.');
    }

    if ($entry['telefoon'] !== '' && !preg_match('/^\+?\d+$/', $entry['telefoon'])) {
        http_response_code(422);
        throw new Exception('Telefoon mag enkel cijfers bevatten, met optioneel + vooraan.');
    }

    $dataDir = __DIR__ . '/../data';
    $jsonPath = $dataDir . '/vraag-submissions.json';

    if (!is_dir($dataDir) && !mkdir($dataDir, 0755, true) && !is_dir($dataDir)) {
        throw new Exception('Kon data map niet aanmaken.');
    }

    $submissions = [];
    if (file_exists($jsonPath)) {
        $content = file_get_contents($jsonPath);
        $submissions = json_decode($content, true);
        if (!is_array($submissions)) {
            $submissions = [];
        }
    }

    array_unshift($submissions, $entry);

    $json = json_encode($submissions, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    if ($json === false || file_put_contents($jsonPath, $json) === false) {
        throw new Exception('Kon formulierdata niet opslaan.');
    }

    echo json_encode(['success' => true]);
} catch (Exception $e) {
    if (http_response_code() < 400) {
        http_response_code(400);
    }
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
    ]);
}
