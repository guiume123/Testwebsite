<?php
session_start();

// Check if logged in
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    header('Location: index.php');
    exit();
}

// Get the current tab/category
$category = $_GET['category'] ?? 'aanbiedingen';
$validCategories = ['aanbiedingen', 'tweedehands'];

if (!in_array($category, $validCategories)) {
    $category = 'aanbiedingen';
}

// Get products for current category
$jsonPath = "../src/assets/products/{$category}/algemeen/products.json";
$products = [];

if (file_exists($jsonPath)) {
    $jsonContent = file_get_contents($jsonPath);
    $products = json_decode($jsonContent, true) ?? [];
}

// Handle logout
if (isset($_GET['logout'])) {
    session_destroy();
    header('Location: index.php');
    exit();
}
?>
<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Baus Admin Dashboard</title>
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
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .navbar h1 {
            font-size: 1.5rem;
        }

        .navbar a {
            color: white;
            text-decoration: none;
            padding: 0.5rem 1rem;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 4px;
            transition: background 0.3s;
        }

        .navbar a:hover {
            background: rgba(255, 255, 255, 0.3);
        }

        .container {
            max-width: 1200px;
            margin: 2rem auto;
            padding: 0 1rem;
        }

        .tabs {
            display: flex;
            gap: 1rem;
            margin-bottom: 2rem;
            border-bottom: 2px solid #ddd;
        }

        .tab-btn {
            padding: 1rem;
            background: none;
            border: none;
            cursor: pointer;
            font-size: 1rem;
            color: #666;
            border-bottom: 3px solid transparent;
            transition: all 0.3s;
        }

        .tab-btn.active {
            color: #173f35;
            border-bottom-color: #173f35;
        }

        .tab-btn:hover {
            color: #173f35;
        }

        .products-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 1.5rem;
        }

        .product-card {
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s, box-shadow 0.3s;
        }

        .product-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
        }

        .product-image {
            width: 100%;
            height: 200px;
            object-fit: cover;
            background: #f0f0f0;
        }

        .product-info {
            padding: 1rem;
        }

        .product-info h3 {
            font-size: 1rem;
            margin-bottom: 0.5rem;
            margin-top: 0;
            color: #173f35;
        }

        .product-info p {
            font-size: 0.85rem;
            color: #666;
            margin-bottom: 0.5rem;
        }

        .price {
            font-weight: bold;
            color: #d97636;
            margin-bottom: 1rem;
        }

        .actions {
            display: flex;
            gap: 0.5rem;
        }

        .btn {
            flex: 1;
            padding: 0.5rem;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.85rem;
            font-weight: 600;
            transition: background 0.3s;
        }

        .btn-edit {
            background: #2196F3;
            color: white;
        }

        .btn-edit:hover {
            background: #1976D2;
        }

        .btn-delete {
            background: #f44336;
            color: white;
        }

        .btn-delete:hover {
            background: #da190b;
        }

        .btn-add {
            background: #4CAF50;
            color: white;
            padding: 1rem 2rem;
            font-size: 1rem;
            margin-bottom: 2rem;
        }

        .btn-add:hover {
            background: #45a049;
        }

        .empty-state {
            text-align: center;
            padding: 3rem 1rem;
            color: #999;
        }

        .empty-state img {
            width: 80px;
            margin-bottom: 1rem;
            opacity: 0.5;
        }

        @media (max-width: 768px) {
            .products-grid {
                grid-template-columns: 1fr;
            }

            .navbar {
                flex-direction: column;
                gap: 1rem;
            }
        }
    </style>
</head>
<body>
    <div class="navbar">
        <h1>Baus Admin Dashboard</h1>
        <a href="?logout=1">Uitloggen</a>
    </div>

    <div class="container">
        <div class="tabs">
            <button class="tab-btn <?php echo $category === 'aanbiedingen' ? 'active' : ''; ?>" 
                    onclick="window.location.href='?category=aanbiedingen'">
                Aanbiedingen
            </button>
            <button class="tab-btn <?php echo $category === 'tweedehands' ? 'active' : ''; ?>" 
                    onclick="window.location.href='?category=tweedehands'">
                Tweedehands
            </button>
        </div>

        <button class="btn btn-add" onclick="window.location.href='product-form.php?category=<?php echo $category; ?>'">
            ➕ Nieuw Product Toevoegen
        </button>

        <?php if (empty($products)): ?>
            <div class="empty-state">
                <p>Geen producten gevonden.</p>
                <p>Klik op "Nieuw Product Toevoegen" om te starten.</p>
            </div>
        <?php else: ?>
            <div class="products-grid">
                <?php foreach ($products as $index => $product): ?>
                    <div class="product-card">
                        <?php if (!empty($product['image'])): ?>
                            <img src="<?php echo htmlspecialchars($product['image']); ?>" alt="<?php echo htmlspecialchars($product['name']); ?>" class="product-image">
                        <?php else: ?>
                            <div class="product-image" style="background: #f0f0f0; display: flex; align-items: center; justify-content: center; color: #ccc;">
                                Geen afbeelding
                            </div>
                        <?php endif; ?>
                        
                        <div class="product-info">
                            <h3><?php echo htmlspecialchars($product['name']); ?></h3>
                            <?php if (!empty($product['price'])): ?>
                                <p class="price"><?php echo htmlspecialchars($product['price']); ?></p>
                            <?php endif; ?>
                            <p><?php echo substr(htmlspecialchars($product['description'] ?? ''), 0, 80) . (strlen($product['description'] ?? '') > 80 ? '...' : ''); ?></p>
                            
                            <div class="actions">
                                <button class="btn btn-edit" onclick="window.location.href='product-form.php?category=<?php echo $category; ?>&index=<?php echo $index; ?>'">
                                    Wijzigen
                                </button>
                                <button class="btn btn-delete" onclick="deleteProduct(<?php echo $index; ?>)">
                                    Verwijderen
                                </button>
                            </div>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>
    </div>

    <script>
        function deleteProduct(index) {
            if (confirm('Weet je zeker dat je dit product wilt verwijderen?')) {
                fetch('api/delete-product.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        category: '<?php echo $category; ?>',
                        index: index
                    })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        location.reload();
                    } else {
                        alert('Fout: ' + (data.error || 'Onbekende fout'));
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Fout bij verwijderen');
                });
            }
        }
    </script>
</body>
</html>
