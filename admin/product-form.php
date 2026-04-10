<?php
session_start();

// Check if logged in
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    header('Location: index.php');
    exit();
}

$category = $_GET['category'] ?? 'aanbiedingen';
$index = $_GET['index'] ?? null;
$isEdit = $index !== null;

$product = [
    'name' => '',
    'price' => '',
    'description' => '',
    'image' => '',
    'brand' => ''
];

// Load existing product if editing
if ($isEdit) {
    $jsonPath = "../src/assets/products/{$category}/algemeen/products.json";
    if (file_exists($jsonPath)) {
        $products = json_decode(file_get_contents($jsonPath), true) ?? [];
        if (isset($products[$index])) {
            $product = $products[$index];
        }
    }
}

$pageTitle = $isEdit ? 'Product Bewerken' : 'Nieuw Product';
?>
<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo $pageTitle; ?> - Baus Admin</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: #f5f5f5;
            color: #333;
        }

        .navbar {
            background: #173f35;
            color: white;
            padding: 1rem 2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .navbar a {
            color: white;
            text-decoration: none;
        }

        .container {
            max-width: 800px;
            margin: 2rem auto;
            padding: 0 1rem;
        }

        .form-container {
            background: white;
            border-radius: 8px;
            padding: 2rem;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        h1 {
            margin-bottom: 2rem;
            color: #173f35;
        }

        .form-group {
            margin-bottom: 1.5rem;
        }

        label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 600;
            color: #333;
        }

        input[type="text"],
        input[type="number"],
        textarea,
        input[type="file"] {
            width: 100%;
            padding: 0.75rem;
            border: 2px solid #ddd;
            border-radius: 4px;
            font-size: 1rem;
            font-family: inherit;
            transition: border-color 0.3s;
        }

        input[type="text"]:focus,
        input[type="number"]:focus,
        textarea:focus,
        input[type="file"]:focus {
            outline: none;
            border-color: #173f35;
        }

        textarea {
            resize: vertical;
            min-height: 100px;
        }

        .image-preview {
            margin-top: 1rem;
            max-width: 300px;
            border-radius: 4px;
            overflow: hidden;
            max-height: 300px;
        }

        .image-preview img {
            width: 100%;
            height: auto;
            display: block;
        }

        .form-actions {
            display: flex;
            gap: 1rem;
            margin-top: 2rem;
        }

        button {
            flex: 1;
            padding: 1rem;
            border: none;
            border-radius: 4px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.3s;
        }

        .btn-submit {
            background: #4CAF50;
            color: white;
        }

        .btn-submit:hover {
            background: #45a049;
        }

        .btn-cancel {
            background: #ddd;
            color: #333;
        }

        .btn-cancel:hover {
            background: #ccc;
        }

        .error {
            color: #d32f2f;
            background: #ffebee;
            padding: 1rem;
            border-radius: 4px;
            margin-bottom: 1rem;
        }

        .success {
            color: #388e3c;
            background: #e8f5e9;
            padding: 1rem;
            border-radius: 4px;
            margin-bottom: 1rem;
        }

        .file-input-label {
            display: inline-block;
            background: #2196F3;
            color: white;
            padding: 0.75rem 1.5rem;
            border-radius: 4px;
            cursor: pointer;
            transition: background 0.3s;
        }

        .file-input-label:hover {
            background: #1976D2;
        }

        input[type="file"] {
            display: none;
        }

        .file-name {
            margin-top: 0.5rem;
            color: #666;
            font-size: 0.9rem;
        }
    </style>
</head>
<body>
    <div class="navbar">
        <h1>Baus Admin</h1>
        <a href="dashboard.php?category=<?php echo $category; ?>">← Terug</a>
    </div>

    <div class="container">
        <div class="form-container">
            <h1><?php echo $pageTitle; ?></h1>

            <form id="productForm">
                <div class="form-group">
                    <label for="name">Product Naam *</label>
                    <input type="text" id="name" name="name" value="<?php echo htmlspecialchars($product['name']); ?>" required>
                </div>

                <div class="form-group">
                    <label for="description">Beschrijving *</label>
                    <textarea id="description" name="description" required><?php echo htmlspecialchars($product['description'] ?? ''); ?></textarea>
                </div>

                <div class="form-group">
                    <label for="price">Prijs</label>
                    <input type="text" id="price" name="price" value="<?php echo htmlspecialchars($product['price'] ?? ''); ?>" placeholder="bv. 99,99 of 99,99 -25%">
                </div>

                <div class="form-group">
                    <label for="brand">Merk</label>
                    <input type="text" id="brand" name="brand" value="<?php echo htmlspecialchars($product['brand'] ?? ''); ?>">
                </div>

                <div class="form-group">
                    <label for="image">Afbeelding</label>
                    <label for="file-input" class="file-input-label">📤 Kies een afbeelding</label>
                    <input type="file" id="file-input" accept="image/*" onchange="previewImage(event)">
                    <div class="file-name" id="file-name"></div>
                    
                    <?php if (!empty($product['image']) && filter_var($product['image'], FILTER_VALIDATE_URL)): ?>
                        <div class="image-preview">
                            <img src="<?php echo htmlspecialchars($product['image']); ?>" alt="Preview">
                        </div>
                    <?php endif; ?>
                </div>

                <input type="hidden" id="category" value="<?php echo $category; ?>">
                <input type="hidden" id="index" value="<?php echo $isEdit ? $index : ''; ?>">
                <input type="hidden" id="isEdit" value="<?php echo $isEdit ? '1' : '0'; ?>">
                <input type="hidden" id="currentImage" value="<?php echo htmlspecialchars($product['image'] ?? ''); ?>">

                <div class="form-actions">
                    <button type="submit" class="btn-submit">✅ Opslaan</button>
                    <button type="button" class="btn-cancel" onclick="window.location.href='dashboard.php?category=<?php echo $category; ?>'">❌ Annuleren</button>
                </div>
            </form>
        </div>
    </div>

    <script>
        const form = document.getElementById('productForm');
        let uploadedImageUrl = '<?php echo htmlspecialchars($product['image'] ?? ''); ?>';

        function previewImage(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    uploadedImageUrl = e.target.result;
                    const preview = document.querySelector('.image-preview');
                    if (preview) {
                        preview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
                    } else {
                        const newPreview = document.createElement('div');
                        newPreview.className = 'image-preview';
                        newPreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
                        document.querySelector('.form-group:nth-of-type(4)').appendChild(newPreview);
                    }
                };
                reader.readAsDataURL(file);
                document.getElementById('file-name').textContent = file.name;
            }
        }

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData();
            formData.append('name', document.getElementById('name').value);
            formData.append('description', document.getElementById('description').value);
            formData.append('price', document.getElementById('price').value);
            formData.append('brand', document.getElementById('brand').value);
            formData.append('category', document.getElementById('category').value);
            formData.append('index', document.getElementById('index').value);
            formData.append('isEdit', document.getElementById('isEdit').value);
            formData.append('image', document.getElementById('file-input').files[0]);
            formData.append('currentImage', document.getElementById('currentImage').value);

            try {
                const response = await fetch('api/save-product.php', {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();

                if (data.success) {
                    window.location.href = 'dashboard.php?category=' + document.getElementById('category').value;
                } else {
                    alert('Fout: ' + (data.error || 'Onbekende fout'));
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Fout bij opslaan');
            }
        });
    </script>
</body>
</html>
