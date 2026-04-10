<?php
session_start();

// Check if logged in
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'Niet ingelogd']);
    exit();
}

header('Content-Type: application/json');

try {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $category = $data['category'] ?? null;
    $index = $data['index'] ?? null;

    if (!$category || !in_array($category, ['aanbiedingen', 'tweedehands'])) {
        throw new Exception('Ongeldige categorie');
    }

    if ($index === null || $index === '') {
        throw new Exception('Geen product index opgegeven');
    }

    // Load products
    $jsonPath = "../../src/assets/products/{$category}/algemeen/products.json";
    
    if (!file_exists($jsonPath)) {
        throw new Exception('Products bestand niet gevonden');
    }

    $products = json_decode(file_get_contents($jsonPath), true) ?? [];

    if (!isset($products[(int)$index])) {
        throw new Exception('Product niet gevonden');
    }

    // Delete image if it exists
    $product = $products[(int)$index];
    if (!empty($product['image']) && strpos($product['image'], '/images/admin/') !== false) {
        $imageFile = '../../public' . $product['image'];
        if (file_exists($imageFile)) {
            unlink($imageFile);
        }
    }

    // Remove product from array
    unset($products[(int)$index]);
    
    // Re-index the array
    $products = array_values($products);

    // Save updated products
    $jsonContent = json_encode($products, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    if (!file_put_contents($jsonPath, $jsonContent)) {
        throw new Exception('Fout bij opslaan van JSON bestand');
    }

    echo json_encode(['success' => true, 'message' => 'Product verwijderd']);

} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
