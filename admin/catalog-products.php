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

$categories = catalog_list_categories();
$subcategories = $category !== '' ? catalog_list_subcategories($category) : [];

$products = [];
$jsonPath = null;
$pathError = null;
$brandFolders = [];
$isGewerenKarabijnen = $category === 'Wapens' && $subcategory === 'Geweren en Karabijnen';

if ($category !== '' && $subcategory !== '') {
    if ($isGewerenKarabijnen && $folder === '') {
        $brandFolders = catalog_list_brand_folders_for_subcategory($category, $subcategory);
        if (empty($brandFolders)) {
            $pathError = 'Geen merkfolders gevonden voor Geweren en Karabijnen.';
        }
    } else {
        $jsonPath = catalog_find_primary_json_path($category, $subcategory, $folder !== '' ? $folder : null);
        if ($jsonPath === null) {
            $pathError = 'Geen products.json gevonden voor deze subcategorie.';
        } else {
            $products = catalog_load_products_from_path($jsonPath);
        }
    }
}
?>
<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Producten</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: #f5f5f5; color: #333; }
        .navbar { background: #173f35; color: white; padding: 1rem 2rem; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        .navbar a { color: white; text-decoration: none; padding: 0.5rem 1rem; background: rgba(255,255,255,0.2); border-radius: 4px; }
        .container { width: 100%; margin: 2rem 0; }
        .layout { display: grid; grid-template-columns: 280px minmax(0,1fr); gap: 1.5rem; align-items: start; }
        .sidebar { background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); padding: 1rem; }
        .main { min-width: 0; padding-right: 1rem; }
        .tabs { display: flex; flex-direction: column; gap: 0.35rem; border-bottom: 2px solid #ddd; padding-bottom: 0.75rem; }
        .tab-btn { padding: 1rem; border: none; background: none; text-align: left; cursor: pointer; color: #666; border-bottom: 3px solid transparent; font-size: 1rem; }
        .tab-btn.active { color: #173f35; border-bottom-color: #173f35; }
        .header { margin-bottom: 1rem; }
        .header h2 { color: #173f35; margin-bottom: 0.35rem; }
        .header p { color: #666; font-size: 0.92rem; }
        .breadcrumbs { margin-bottom: 1.25rem; font-size: 0.9rem; color: #666; }
        .breadcrumbs a { color: #173f35; text-decoration: none; }
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 1rem; }
        .item-card { background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); padding: 1rem; }
        .item-card h3 { color: #173f35; font-size: 1rem; margin-bottom: 0.65rem; }
        .item-card p { color: #666; font-size: 0.85rem; margin-bottom: 0.6rem; }
        .item-card a { color: #173f35; text-decoration: none; font-weight: 600; }
        .products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem; }
        .product-card { background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        .product-image { width: 100%; height: 200px; object-fit: cover; background: #f0f0f0; }
        .product-info { padding: 1rem; }
        .product-info h3 { color: #173f35; font-size: 1rem; margin-bottom: 0.5rem; }
        .product-info p { font-size: 0.85rem; color: #666; margin-bottom: 0.5rem; }
        .actions { display: flex; gap: 0.5rem; margin-top: 0.8rem; }
        .btn { flex: 1; padding: 0.55rem; border: none; border-radius: 4px; font-size: 0.85rem; font-weight: 600; cursor: pointer; }
        .btn-add { background: #4CAF50; color: #fff; padding: 0.8rem 1.2rem; margin-bottom: 1rem; border-radius: 4px; border: none; cursor: pointer; font-weight: 600; }
        .btn-edit { background: #2196F3; color: #fff; }
        .btn-delete { background: #f44336; color: #fff; }
        .empty { padding: 1.5rem; background: #fff; border-radius: 8px; color: #777; }
        .error { padding: 1rem; background: #ffebee; color: #b71c1c; border-radius: 8px; margin-bottom: 1rem; }
        @media (max-width: 768px) {
            .layout { grid-template-columns: 1fr; }
            .main { padding: 0 1rem; }
        }
    </style>
</head>
<body>
    <div class="navbar">
        <h1>Baus Admin</h1>
        <div>
            <a href="dashboard.php">Dashboard</a>
            <a href="dashboard.php?logout=1" style="margin-left: 0.5rem;">Uitloggen</a>
        </div>
    </div>

    <div class="container">
        <div class="layout">
            <aside class="sidebar">
                <div class="tabs">
                    <button class="tab-btn" onclick="window.location.href='dashboard.php?tab=products&category=aanbiedingen'">Aanbiedingen</button>
                    <button class="tab-btn" onclick="window.location.href='dashboard.php?tab=products&category=tweedehands'">Tweedehands</button>
                    <button class="tab-btn active" onclick="window.location.href='catalog-products.php'">Producten</button>
                    <button class="tab-btn" onclick="window.location.href='dashboard.php?tab=berichten'">Vraagformulier Berichten</button>
                </div>
            </aside>

            <section class="main">
                <?php if ($category === ''): ?>
                    <div class="header">
                        <h2>Producten</h2>
                        <p>Kies een categorie</p>
                    </div>
                    <div class="grid">
                        <?php foreach ($categories as $cat): ?>
                            <article class="item-card">
                                <h3><?php echo htmlspecialchars($cat); ?></h3>
                                <a href="?category=<?php echo urlencode($cat); ?>">Open categorie →</a>
                            </article>
                        <?php endforeach; ?>
                    </div>
                <?php elseif ($subcategory === ''): ?>
                    <div class="breadcrumbs"><a href="catalog-products.php">Producten</a> / <?php echo htmlspecialchars($category); ?></div>
                    <div class="header">
                        <h2><?php echo htmlspecialchars($category); ?></h2>
                        <p>Kies een subcategorie</p>
                    </div>
                    <div class="grid">
                        <?php foreach ($subcategories as $sub): ?>
                            <article class="item-card">
                                <h3><?php echo htmlspecialchars($sub); ?></h3>
                                <a href="?category=<?php echo urlencode($category); ?>&subcategory=<?php echo urlencode($sub); ?>">Open subcategorie →</a>
                            </article>
                        <?php endforeach; ?>
                    </div>
                <?php else: ?>
                    <div class="breadcrumbs">
                        <a href="catalog-products.php">Producten</a>
                        / <a href="?category=<?php echo urlencode($category); ?>"><?php echo htmlspecialchars($category); ?></a>
                        / <a href="?category=<?php echo urlencode($category); ?>&subcategory=<?php echo urlencode($subcategory); ?>"><?php echo htmlspecialchars($subcategory); ?></a>
                        <?php if ($folder !== ''): ?> / <?php echo htmlspecialchars($folder); ?><?php endif; ?>
                    </div>
                    <div class="header">
                        <h2><?php echo htmlspecialchars($folder !== '' ? $folder : $subcategory); ?></h2>
                        <p>Beheer producten van deze subcategorie</p>
                    </div>

                    <?php if ($pathError !== null): ?>
                        <div class="error"><?php echo htmlspecialchars($pathError); ?></div>
                    <?php elseif ($isGewerenKarabijnen && $folder === ''): ?>
                        <div class="grid">
                            <?php foreach ($brandFolders as $brandFolder): ?>
                                <article class="item-card">
                                    <h3><?php echo htmlspecialchars($brandFolder); ?></h3>
                                    <a href="?category=<?php echo urlencode($category); ?>&subcategory=<?php echo urlencode($subcategory); ?>&folder=<?php echo urlencode($brandFolder); ?>">Open merk →</a>
                                </article>
                            <?php endforeach; ?>
                        </div>
                    <?php else: ?>
                        <button class="btn-add" onclick="window.location.href='catalog-product-form.php?category=<?php echo urlencode($category); ?>&subcategory=<?php echo urlencode($subcategory); ?><?php echo $folder !== '' ? '&folder=' . urlencode($folder) : ''; ?>'">➕ Nieuw Product Toevoegen</button>

                        <?php if (empty($products)): ?>
                            <div class="empty">Geen producten gevonden in deze subcategorie.</div>
                        <?php else: ?>
                            <div class="products-grid">
                                <?php foreach ($products as $index => $product): ?>
                                    <article class="product-card">
                                        <?php if (!empty($product['image'])): ?>
                                            <img src="<?php echo htmlspecialchars((string) $product['image']); ?>" alt="<?php echo htmlspecialchars((string) ($product['name'] ?? 'Product')); ?>" class="product-image">
                                        <?php else: ?>
                                            <div class="product-image" style="display:flex;align-items:center;justify-content:center;color:#bbb;">Geen afbeelding</div>
                                        <?php endif; ?>
                                        <div class="product-info">
                                            <h3><?php echo htmlspecialchars((string) ($product['name'] ?? 'Naamloos product')); ?></h3>
                                            <?php if (!empty($product['brand'])): ?>
                                                <p><strong>Merk:</strong> <?php echo htmlspecialchars((string) $product['brand']); ?></p>
                                            <?php endif; ?>
                                            <p><?php echo htmlspecialchars(substr((string) ($product['description'] ?? ''), 0, 110)); ?><?php echo strlen((string) ($product['description'] ?? '')) > 110 ? '...' : ''; ?></p>
                                            <div class="actions">
                                                <button class="btn btn-edit" onclick="window.location.href='catalog-product-form.php?category=<?php echo urlencode($category); ?>&subcategory=<?php echo urlencode($subcategory); ?>&index=<?php echo $index; ?><?php echo $folder !== '' ? '&folder=' . urlencode($folder) : ''; ?>'">Wijzigen</button>
                                                <button class="btn btn-delete" onclick="deleteProduct(<?php echo $index; ?>)">Verwijderen</button>
                                            </div>
                                        </div>
                                    </article>
                                <?php endforeach; ?>
                            </div>
                        <?php endif; ?>
                    <?php endif; ?>
                <?php endif; ?>
            </section>
        </div>
    </div>

    <script>
        function deleteProduct(index) {
            if (!confirm('Weet je zeker dat je dit product wilt verwijderen?')) {
                return;
            }

            fetch('api/delete-catalog-product.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    category: '<?php echo addslashes($category); ?>',
                    subcategory: '<?php echo addslashes($subcategory); ?>',
                    folder: '<?php echo addslashes($folder); ?>',
                    index: index
                })
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        window.location.reload();
                    } else {
                        alert('Fout: ' + (data.error || 'Onbekende fout'));
                    }
                })
                .catch(() => alert('Fout bij verwijderen'));
        }
    </script>
</body>
</html>
