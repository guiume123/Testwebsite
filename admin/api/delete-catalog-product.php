<?php
session_start();

if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'Niet ingelogd']);
    exit();
}

header('Content-Type: application/json');

require_once __DIR__ . '/../lib/catalog-products-helper.php';

try {
    $payload = json_decode((string) file_get_contents('php://input'), true);
    if (!is_array($payload)) {
        throw new Exception('Ongeldige request payload');
    }

    $category = trim((string) ($payload['category'] ?? ''));
    $subcategory = trim((string) ($payload['subcategory'] ?? ''));
    $folder = trim((string) ($payload['folder'] ?? ''));
    $index = $payload['index'] ?? null;

    if ($category === '' || $subcategory === '') {
        throw new Exception('Categorie en subcategorie zijn verplicht');
    }

    if ($index === null || $index === '') {
        throw new Exception('Geen product index opgegeven');
    }

    $jsonPath = catalog_find_primary_json_path($category, $subcategory, $folder !== '' ? $folder : null);
    if ($jsonPath === null || !file_exists($jsonPath)) {
        throw new Exception('Products bestand niet gevonden');
    }

    $products = catalog_load_products_from_path($jsonPath);
    $idx = (int) $index;

    if (!isset($products[$idx])) {
        throw new Exception('Product niet gevonden');
    }

    $imageUrl = (string) ($products[$idx]['image'] ?? '');
    $imageUrlPrefix = catalog_relative_url_prefix_for_json($jsonPath);
    if ($imageUrl !== '' && strpos($imageUrl, $imageUrlPrefix) === 0) {
        $imageFile = catalog_absolute_file_from_image_url($imageUrl);
        if (is_file($imageFile)) {
            @unlink($imageFile);
        }
    }

    unset($products[$idx]);
    $products = array_values($products);

    $json = json_encode($products, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    if ($json === false || file_put_contents($jsonPath, $json) === false) {
        throw new Exception('Fout bij opslaan van JSON bestand');
    }

    echo json_encode(['success' => true, 'message' => 'Product verwijderd']);
} catch (Throwable $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
