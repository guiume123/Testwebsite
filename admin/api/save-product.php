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
    $category = $_POST['category'] ?? null;
    $index = $_POST['index'] ?? null;
    $isEdit = $_POST['isEdit'] === '1';
    $currentImage = $_POST['currentImage'] ?? '';
    
    if (!$category || !in_array($category, ['aanbiedingen', 'tweedehands'])) {
        throw new Exception('Ongeldige categorie');
    }

    $categoryPaths = [
        'aanbiedingen' => [
            'jsonPath' => '../../src/TWEEDEHANDS-AANBIEDINGEN/aanbiedingen/aanbiedingen/products.json',
            'imageDir' => '../../src/TWEEDEHANDS-AANBIEDINGEN/aanbiedingen/aanbiedingen/',
            'imageUrlPrefix' => '/src/TWEEDEHANDS-AANBIEDINGEN/aanbiedingen/aanbiedingen/'
        ],
        'tweedehands' => [
            'jsonPath' => '../../src/TWEEDEHANDS-AANBIEDINGEN/tweedehands/tweedehands/products.json',
            'imageDir' => '../../src/TWEEDEHANDS-AANBIEDINGEN/tweedehands/tweedehands/',
            'imageUrlPrefix' => '/src/TWEEDEHANDS-AANBIEDINGEN/tweedehands/tweedehands/'
        ]
    ];
    $paths = $categoryPaths[$category];

    // Get product data
    $name = trim($_POST['name'] ?? '');
    $description = trim($_POST['description'] ?? '');
    $price = trim($_POST['price'] ?? '');
    $brand = trim($_POST['brand'] ?? '');

    if (empty($name) || empty($description)) {
        throw new Exception('Naam en beschrijving zijn verplicht');
    }

    // Handle image upload
    $imageUrl = $currentImage;
    if (!empty($_FILES['image']['name'])) {
        $file = $_FILES['image'];
        $uploadDir = $paths['imageDir'];
        
        // Create directory if it doesn't exist
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        $fileExtension = pathinfo($file['name'], PATHINFO_EXTENSION);
        $allowed = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
        
        if (!in_array(strtolower($fileExtension), $allowed)) {
            throw new Exception('Afbeeldingstype niet toegestaan. Gebruik JPG, PNG, GIF of WEBP');
        }

        // Validate file size (max 5MB)
        if ($file['size'] > 5 * 1024 * 1024) {
            throw new Exception('Afbeelding is te groot (max 5MB)');
        }

        // Generate unique filename
        $filename = uniqid('product_') . '.' . strtolower($fileExtension);
        $filepath = $uploadDir . $filename;

        if (!move_uploaded_file($file['tmp_name'], $filepath)) {
            throw new Exception('Fout bij uploaden van afbeelding');
        }

        $imageUrl = $paths['imageUrlPrefix'] . $filename;

        // Delete old image if editing
        if ($isEdit && !empty($currentImage) && strpos($currentImage, $paths['imageUrlPrefix']) === 0) {
            $oldFile = '../../' . ltrim($currentImage, '/');
            if (file_exists($oldFile)) {
                unlink($oldFile);
            }
        }
    }

    // Load or create products file
    $jsonPath = $paths['jsonPath'];
    $jsonDir = dirname($jsonPath);
    
    if (!is_dir($jsonDir)) {
        mkdir($jsonDir, 0755, true);
    }

    $products = [];
    if (file_exists($jsonPath)) {
        $content = file_get_contents($jsonPath);
        $products = json_decode($content, true) ?? [];
    }

    // Create or update product
    $productData = [
        'name' => $name,
        'image' => $imageUrl,
        'price' => $price ?: null,
        'description' => $description,
        'main_category' => ucfirst(str_replace('-', ' ', $category)) === 'Tweedehands' ? 'Tweedehands' : 'Aanbiedingen',
        'subcategory' => null,
        'brand' => $brand ?: null,
        'link' => "/?category={$category}"
    ];

    if ($isEdit && $index !== '' && $index !== null) {
        // Update existing product
        if (isset($products[(int)$index])) {
            $products[(int)$index] = $productData;
        } else {
            throw new Exception('Product niet gevonden');
        }
    } else {
        // Add new product
        $products[] = $productData;
    }

    // Save to JSON file
    $jsonContent = json_encode($products, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    if (!file_put_contents($jsonPath, $jsonContent)) {
        throw new Exception('Fout bij opslaan van JSON bestand');
    }

    echo json_encode(['success' => true, 'message' => 'Product opgeslagen']);

} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
