<?php
session_start();

if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    header('Location: index.php');
    exit();
}

require_once __DIR__ . '/lib/catalog-products-helper.php';

$category = trim((string) ($_GET['category'] ?? ''));
$subcategory = trim((string) ($_GET['subcategory'] ?? ''));
$folder = trim((string) ($_GET['folder'] ?? ''));
$index = $_GET['index'] ?? null;
$isEdit = $index !== null && $index !== '';

if ($category === '' || $subcategory === '') {
    header('Location: catalog-products.php');
    exit();
}

$product = [
    'name' => '',
    'image' => '',
    'price' => '',
    'description' => '',
    'main_category' => $category,
    'subcategory' => $subcategory,
    'brand' => '',
    'productcode' => '',
    'specs' => [
        'gewicht' => '',
        'jaar' => '',
        'munitie' => '',
        'precisie' => ''
    ]
];

$jsonPath = catalog_find_primary_json_path($category, $subcategory, $folder !== '' ? $folder : null);
if ($jsonPath === null) {
    die('Geen products.json gevonden voor deze subcategorie.');
}

if ($isEdit) {
    $products = catalog_load_products_from_path($jsonPath);
    if (isset($products[(int) $index]) && is_array($products[(int) $index])) {
        $product = array_merge($product, $products[(int) $index]);
        $product['specs'] = array_merge(
            [
                'gewicht' => '',
                'jaar' => '',
                'munitie' => '',
                'precisie' => ''
            ],
            is_array($products[(int) $index]['specs'] ?? null) ? $products[(int) $index]['specs'] : []
        );
    }
}

$pageTitle = $isEdit ? 'Product Bewerken' : 'Nieuw Product';
?>
<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo htmlspecialchars($pageTitle); ?> - Producten Admin</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: #f5f5f5; color: #333; }
        .navbar { background: #173f35; color: #fff; padding: 1rem 2rem; display: flex; justify-content: space-between; align-items: center; }
        .navbar a { color: #fff; text-decoration: none; }
        .container { max-width: 900px; margin: 2rem auto; padding: 0 1rem; }
        .form-container { background: #fff; border-radius: 8px; padding: 2rem; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        h1 { color: #173f35; margin-bottom: 0.35rem; }
        .subline { color: #666; margin-bottom: 1.5rem; font-size: 0.92rem; }
        .form-group { margin-bottom: 1.2rem; }
        label { display: block; margin-bottom: 0.5rem; font-weight: 600; }
        input[type="text"], textarea { width: 100%; padding: 0.75rem; border: 2px solid #ddd; border-radius: 4px; font-size: 1rem; font-family: inherit; }
        textarea { min-height: 110px; resize: vertical; }
        input:focus, textarea:focus { outline: none; border-color: #173f35; }
        input[type="file"] { display: none; }
        .file-input-label { display: inline-block; background: #2196F3; color: #fff; padding: 0.75rem 1.2rem; border-radius: 4px; cursor: pointer; }
        .file-name { margin-top: 0.5rem; color: #666; font-size: 0.9rem; }
        .image-preview { margin-top: 1rem; max-width: 320px; border-radius: 4px; overflow: hidden; }
        .image-preview img { width: 100%; display: block; }
        .form-actions { display: flex; gap: 1rem; margin-top: 1.8rem; }
        button { flex: 1; border: none; border-radius: 4px; padding: 1rem; cursor: pointer; font-size: 1rem; font-weight: 600; }
        .btn-submit { background: #4CAF50; color: #fff; }
        .btn-cancel { background: #ddd; color: #333; }
    </style>
</head>
<body>
    <div class="navbar">
        <h1>Baus Admin</h1>
        <a href="catalog-products.php?category=<?php echo urlencode($category); ?>&subcategory=<?php echo urlencode($subcategory); ?><?php echo $folder !== '' ? '&folder=' . urlencode($folder) : ''; ?>">← Terug</a>
    </div>

    <div class="container">
        <div class="form-container">
            <h1><?php echo htmlspecialchars($pageTitle); ?></h1>
            <p class="subline"><?php echo htmlspecialchars($category); ?> / <?php echo htmlspecialchars($subcategory); ?><?php echo $folder !== '' ? ' / ' . htmlspecialchars($folder) : ''; ?></p>

            <form id="productForm">
                <div class="form-group">
                    <label for="name">Product Naam *</label>
                    <input type="text" id="name" name="name" value="<?php echo htmlspecialchars((string) ($product['name'] ?? '')); ?>" required>
                </div>

                <div class="form-group">
                    <label for="description">Beschrijving</label>
                    <textarea id="description" name="description"><?php echo htmlspecialchars((string) ($product['description'] ?? '')); ?></textarea>
                </div>

                <div class="form-group">
                    <label for="brand">Merk</label>
                    <input type="text" id="brand" name="brand" value="<?php echo htmlspecialchars((string) ($product['brand'] ?? '')); ?>">
                </div>

                <div class="form-group">
                    <label for="price">Prijs</label>
                    <input type="text" id="price" name="price" value="<?php echo htmlspecialchars((string) ($product['price'] ?? '')); ?>" placeholder="Bijv. 1499 of €1499">
                </div>

                <div class="form-group">
                    <label for="productcode">Productcode</label>
                    <input type="text" id="productcode" name="productcode" value="<?php echo htmlspecialchars((string) ($product['productcode'] ?? '')); ?>">
                </div>

                <div class="form-group">
                    <label for="specs_gewicht">Specs - Gewicht</label>
                    <input type="text" id="specs_gewicht" name="specs_gewicht" value="<?php echo htmlspecialchars((string) ($product['specs']['gewicht'] ?? '')); ?>">
                </div>

                <div class="form-group">
                    <label for="specs_jaar">Specs - Jaar</label>
                    <input type="text" id="specs_jaar" name="specs_jaar" value="<?php echo htmlspecialchars((string) ($product['specs']['jaar'] ?? '')); ?>">
                </div>

                <div class="form-group">
                    <label for="specs_munitie">Specs - Munitie</label>
                    <input type="text" id="specs_munitie" name="specs_munitie" value="<?php echo htmlspecialchars((string) ($product['specs']['munitie'] ?? '')); ?>">
                </div>

                <div class="form-group">
                    <label for="specs_precisie">Specs - Precisie</label>
                    <input type="text" id="specs_precisie" name="specs_precisie" value="<?php echo htmlspecialchars((string) ($product['specs']['precisie'] ?? '')); ?>">
                </div>

                <div class="form-group">
                    <label for="image">Afbeelding</label>
                    <label for="file-input" class="file-input-label">📤 Kies een afbeelding</label>
                    <input type="file" id="file-input" accept="image/*" onchange="previewImage(event)">
                    <div class="file-name" id="file-name"></div>
                    <?php if (!empty($product['image'])): ?>
                        <div class="image-preview" id="preview-container">
                            <img src="<?php echo htmlspecialchars((string) $product['image']); ?>" alt="Preview">
                        </div>
                    <?php else: ?>
                        <div class="image-preview" id="preview-container" style="display:none;"></div>
                    <?php endif; ?>
                </div>

                <input type="hidden" id="category" value="<?php echo htmlspecialchars($category); ?>">
                <input type="hidden" id="subcategory" value="<?php echo htmlspecialchars($subcategory); ?>">
                <input type="hidden" id="folder" value="<?php echo htmlspecialchars($folder); ?>">
                <input type="hidden" id="index" value="<?php echo $isEdit ? (int) $index : ''; ?>">
                <input type="hidden" id="isEdit" value="<?php echo $isEdit ? '1' : '0'; ?>">
                <input type="hidden" id="currentImage" value="<?php echo htmlspecialchars((string) ($product['image'] ?? '')); ?>">

                <div class="form-actions">
                    <button type="submit" class="btn-submit">✅ Opslaan</button>
                    <button type="button" class="btn-cancel" onclick="window.location.href='catalog-products.php?category=<?php echo urlencode($category); ?>&subcategory=<?php echo urlencode($subcategory); ?><?php echo $folder !== '' ? '&folder=' . urlencode($folder) : ''; ?>'">❌ Annuleren</button>
                </div>
            </form>
        </div>
    </div>

    <script>
        function previewImage(event) {
            const file = event.target.files[0];
            const fileName = document.getElementById('file-name');
            const previewContainer = document.getElementById('preview-container');
            if (!file) {
                return;
            }

            fileName.textContent = file.name;
            const reader = new FileReader();
            reader.onload = function(e) {
                previewContainer.style.display = 'block';
                previewContainer.innerHTML = '<img src="' + e.target.result + '" alt="Preview">';
            };
            reader.readAsDataURL(file);
        }

        document.getElementById('productForm').addEventListener('submit', async function(e) {
            e.preventDefault();

            const formData = new FormData();
            formData.append('name', document.getElementById('name').value);
            formData.append('description', document.getElementById('description').value);
            formData.append('brand', document.getElementById('brand').value);
            formData.append('price', document.getElementById('price').value);
            formData.append('productcode', document.getElementById('productcode').value);
            formData.append('specs_gewicht', document.getElementById('specs_gewicht').value);
            formData.append('specs_jaar', document.getElementById('specs_jaar').value);
            formData.append('specs_munitie', document.getElementById('specs_munitie').value);
            formData.append('specs_precisie', document.getElementById('specs_precisie').value);
            formData.append('category', document.getElementById('category').value);
            formData.append('subcategory', document.getElementById('subcategory').value);
            formData.append('folder', document.getElementById('folder').value);
            formData.append('index', document.getElementById('index').value);
            formData.append('isEdit', document.getElementById('isEdit').value);
            formData.append('currentImage', document.getElementById('currentImage').value);
            const imageFile = document.getElementById('file-input').files[0];
            if (imageFile) {
                formData.append('image', imageFile);
            }

            try {
                const response = await fetch('api/save-catalog-product.php', {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();
                if (data.success) {
                    const folder = document.getElementById('folder').value;
                    const folderQuery = folder ? '&folder=' + encodeURIComponent(folder) : '';
                    window.location.href = 'catalog-products.php?category=' + encodeURIComponent(document.getElementById('category').value) + '&subcategory=' + encodeURIComponent(document.getElementById('subcategory').value) + folderQuery;
                } else {
                    alert('Fout: ' + (data.error || 'Onbekende fout'));
                }
            } catch (err) {
                alert('Fout bij opslaan');
            }
        });
    </script>
</body>
</html>
