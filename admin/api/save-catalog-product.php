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
    $category = trim((string) ($_POST['category'] ?? ''));
    $subcategory = trim((string) ($_POST['subcategory'] ?? ''));
    $folder = trim((string) ($_POST['folder'] ?? ''));
    $index = $_POST['index'] ?? null;
    $isEdit = ($_POST['isEdit'] ?? '') === '1';
    $currentImage = trim((string) ($_POST['currentImage'] ?? ''));

    if ($category === '' || $subcategory === '') {
        throw new Exception('Categorie en subcategorie zijn verplicht');
    }

    $name = trim((string) ($_POST['name'] ?? ''));
    $description = trim((string) ($_POST['description'] ?? ''));
    $brand = trim((string) ($_POST['brand'] ?? ''));
    $price = trim((string) ($_POST['price'] ?? ''));
    $productCode = trim((string) ($_POST['productcode'] ?? ''));
    $specsGewicht = trim((string) ($_POST['specs_gewicht'] ?? ''));
    $specsJaar = trim((string) ($_POST['specs_jaar'] ?? ''));
    $specsMunitie = trim((string) ($_POST['specs_munitie'] ?? ''));
    $specsPrecisie = trim((string) ($_POST['specs_precisie'] ?? ''));

    if ($name === '') {
        throw new Exception('Productnaam is verplicht');
    }

    $jsonPath = catalog_find_primary_json_path($category, $subcategory, $folder !== '' ? $folder : null);
    if ($jsonPath === null) {
        throw new Exception('Geen products.json gevonden voor deze subcategorie');
    }

    $products = catalog_load_products_from_path($jsonPath);
    $imageUrlPrefix = catalog_relative_url_prefix_for_json($jsonPath);
    $uploadDir = dirname($jsonPath) . DIRECTORY_SEPARATOR;

    $imageUrl = $currentImage;
    if (!empty($_FILES['image']['name'])) {
        $file = $_FILES['image'];
        $extension = strtolower(pathinfo((string) $file['name'], PATHINFO_EXTENSION));
        $allowed = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

        if (!in_array($extension, $allowed, true)) {
            throw new Exception('Afbeeldingstype niet toegestaan. Gebruik JPG, PNG, GIF of WEBP');
        }

        if ((int) ($file['size'] ?? 0) > 5 * 1024 * 1024) {
            throw new Exception('Afbeelding is te groot (max 5MB)');
        }

        if (!is_dir($uploadDir) && !mkdir($uploadDir, 0755, true) && !is_dir($uploadDir)) {
            throw new Exception('Uploadmap kon niet worden aangemaakt');
        }

        $filename = uniqid('product_', true) . '.' . $extension;
        $targetPath = $uploadDir . $filename;

        if (!move_uploaded_file((string) $file['tmp_name'], $targetPath)) {
            throw new Exception('Fout bij uploaden van afbeelding');
        }

        $imageUrl = $imageUrlPrefix . $filename;

        if ($isEdit && $currentImage !== '' && strpos($currentImage, $imageUrlPrefix) === 0) {
            $oldFile = catalog_absolute_file_from_image_url($currentImage);
            if (is_file($oldFile)) {
                @unlink($oldFile);
            }
        }
    }

    $base = [];
    if ($isEdit && $index !== '' && $index !== null && isset($products[(int) $index]) && is_array($products[(int) $index])) {
        $base = $products[(int) $index];
    }

    $productData = $base;
    $productData['name'] = $name;
    $productData['image'] = $imageUrl;
    $productData['price'] = $price;
    $productData['main_category'] = $category;
    $productData['subcategory'] = $subcategory;
    $productData['brand'] = $brand;
    $productData['productcode'] = $productCode;
    $productData['description'] = $description;
    $productData['specs'] = [
        'gewicht' => $specsGewicht,
        'jaar' => $specsJaar,
        'munitie' => $specsMunitie,
        'precisie' => $specsPrecisie,
    ];

    if ($isEdit && $index !== '' && $index !== null) {
        if (!isset($products[(int) $index])) {
            throw new Exception('Product niet gevonden');
        }
        $products[(int) $index] = $productData;
    } else {
        $products[] = $productData;
    }

    $json = json_encode($products, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    if ($json === false || file_put_contents($jsonPath, $json) === false) {
        throw new Exception('Fout bij opslaan van JSON bestand');
    }

    echo json_encode(['success' => true, 'message' => 'Product opgeslagen']);
} catch (Throwable $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
