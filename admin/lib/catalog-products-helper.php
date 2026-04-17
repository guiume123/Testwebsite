<?php

declare(strict_types=1);

function catalog_assets_root(): string
{
    return realpath(__DIR__ . '/../../src/assets/products') ?: (__DIR__ . '/../../src/assets/products');
}

function catalog_all_products_path(): string
{
    return __DIR__ . '/../../src/ALL PRODUCTS/products.json';
}

function catalog_load_all_products(): array
{
    $allPath = catalog_all_products_path();
    if (!file_exists($allPath)) {
        return [];
    }

    $decoded = json_decode((string) file_get_contents($allPath), true);
    return is_array($decoded) ? $decoded : [];
}

function catalog_decode_products_payload($decoded): array
{
    if (is_array($decoded) && array_is_list($decoded)) {
        return $decoded;
    }

    if (is_array($decoded) && isset($decoded['name']) && isset($decoded['image'])) {
        return [$decoded];
    }

    return [];
}

function catalog_slugify(string $value): string
{
    $value = strtolower(trim($value));
    $value = preg_replace('/\s+/', '-', $value) ?? $value;
    $value = preg_replace('/[^a-z0-9-]/', '', $value) ?? $value;
    $value = preg_replace('/-+/', '-', $value) ?? $value;
    return trim($value, '-');
}

function catalog_list_categories(): array
{
    $all = catalog_load_all_products();
    $categories = [];

    foreach ($all as $item) {
        $main = trim((string) ($item['main_category'] ?? ''));
        if ($main !== '') {
            $categories[$main] = true;
        }
    }

    $out = array_keys($categories);
    sort($out, SORT_NATURAL | SORT_FLAG_CASE);
    return $out;
}

function catalog_list_subcategories(string $category): array
{
    $all = catalog_load_all_products();
    $subcategories = [];

    foreach ($all as $item) {
        $main = trim((string) ($item['main_category'] ?? ''));
        $sub = trim((string) ($item['subcategory'] ?? ''));
        if ($main === $category && $sub !== '') {
            $subcategories[$sub] = true;
        }
    }

    $out = array_keys($subcategories);
    sort($out, SORT_NATURAL | SORT_FLAG_CASE);
    return $out;
}

function catalog_find_primary_json_path(string $category, string $subcategory, ?string $folder = null): ?string
{
    $root = catalog_assets_root();
    if (!is_dir($root)) {
        return null;
    }

    $matches = [];
    $categoryKey = catalog_slugify($category);
    $subcategoryKey = catalog_slugify($subcategory);
    $subSlug = catalog_slugify($subcategory);
    $categorySlug = catalog_slugify($category);
    $folderSlug = $folder !== null ? catalog_slugify($folder) : '';
    $iterator = new RecursiveIteratorIterator(
        new RecursiveDirectoryIterator($root, FilesystemIterator::SKIP_DOTS)
    );

    foreach ($iterator as $fileInfo) {
        /** @var SplFileInfo $fileInfo */
        if (!$fileInfo->isFile() || $fileInfo->getFilename() !== 'products.json') {
            continue;
        }

        $path = $fileInfo->getPathname();
        $decoded = json_decode((string) file_get_contents($path), true);
        $productsInFile = catalog_decode_products_payload($decoded);
        if (empty($productsInFile)) {
            continue;
        }

        $hasMatch = false;
        $subcategoriesInFile = [];
        foreach ($productsInFile as $item) {
            $main = trim((string) ($item['main_category'] ?? ''));
            $sub = trim((string) ($item['subcategory'] ?? ''));
            $mainKey = catalog_slugify($main);
            $subKey = catalog_slugify($sub);
            if ($mainKey === $categoryKey && $subKey !== '') {
                $subcategoriesInFile[$subKey] = true;
            }
            if ($mainKey === $categoryKey && $subKey === $subcategoryKey) {
                $hasMatch = true;
            }
        }

        if ($hasMatch) {
            $depth = substr_count(str_replace($root, '', $path), DIRECTORY_SEPARATOR);
            $normalizedPath = strtolower(str_replace('\\', '/', $path));
            $hasSubSlug = $subSlug !== '' && strpos($normalizedPath, '/' . $subSlug . '/') !== false;
            $hasCategorySlug = $categorySlug !== '' && strpos($normalizedPath, '/' . $categorySlug . '/') !== false;
            $hasFolderSlug = $folderSlug !== '' && strpos($normalizedPath, '/' . $folderSlug . '/') !== false;
            $isPureSubcategoryFile = count($subcategoriesInFile) === 1 && isset($subcategoriesInFile[$subcategoryKey]);
            $matches[] = [
                'path' => $path,
                'depth' => $depth,
                'hasSubSlug' => $hasSubSlug,
                'hasCategorySlug' => $hasCategorySlug,
                'hasFolderSlug' => $hasFolderSlug,
                'isPureSubcategoryFile' => $isPureSubcategoryFile
            ];
        }
    }

    if (empty($matches)) {
        return null;
    }

    usort(
        $matches,
        static function (array $a, array $b): int {
            if ($a['hasFolderSlug'] !== $b['hasFolderSlug']) {
                return $a['hasFolderSlug'] ? -1 : 1;
            }
            if ($a['isPureSubcategoryFile'] !== $b['isPureSubcategoryFile']) {
                return $a['isPureSubcategoryFile'] ? -1 : 1;
            }
            if ($a['hasSubSlug'] !== $b['hasSubSlug']) {
                return $a['hasSubSlug'] ? -1 : 1;
            }
            if ($a['hasCategorySlug'] !== $b['hasCategorySlug']) {
                return $a['hasCategorySlug'] ? -1 : 1;
            }
            return $a['depth'] <=> $b['depth'];
        }
    );
    return $matches[0]['path'];
}

function catalog_list_brand_folders_for_subcategory(string $category, string $subcategory): array
{
    $categoryKey = catalog_slugify($category);
    $subcategoryKey = catalog_slugify($subcategory);

    $primaryPath = catalog_find_primary_json_path($category, $subcategory);
    if ($primaryPath === null) {
        return [];
    }

    $subcatDir = dirname($primaryPath);
    if (!is_dir($subcatDir)) {
        return [];
    }

    $folders = [];
    $items = scandir($subcatDir);
    if ($items === false) {
        return [];
    }

    foreach ($items as $item) {
        if ($item === '.' || $item === '..') {
            continue;
        }

        $dirPath = $subcatDir . DIRECTORY_SEPARATOR . $item;
        if (!is_dir($dirPath)) {
            continue;
        }

        $jsonPath = $dirPath . DIRECTORY_SEPARATOR . 'products.json';
        if (!is_file($jsonPath)) {
            continue;
        }

        $decoded = json_decode((string) file_get_contents($jsonPath), true);
        $productsInFile = catalog_decode_products_payload($decoded);
        if (empty($productsInFile)) {
            continue;
        }

        $valid = false;
        foreach ($productsInFile as $product) {
            $main = trim((string) ($product['main_category'] ?? ''));
            $sub = trim((string) ($product['subcategory'] ?? ''));
            if (catalog_slugify($main) === $categoryKey && catalog_slugify($sub) === $subcategoryKey) {
                $valid = true;
                break;
            }
        }

        if ($valid) {
            $folders[] = $item;
        }
    }

    sort($folders, SORT_NATURAL | SORT_FLAG_CASE);
    return $folders;
}

function catalog_load_products_from_path(string $jsonPath): array
{
    if (!file_exists($jsonPath)) {
        return [];
    }

    $decoded = json_decode((string) file_get_contents($jsonPath), true);
    return catalog_decode_products_payload($decoded);
}

function catalog_relative_url_prefix_for_json(string $jsonPath): string
{
    $normalized = str_replace('\\', '/', $jsonPath);
    $marker = '/src/assets/products/';
    $pos = strpos($normalized, $marker);

    if ($pos === false) {
        return '/src/assets/products/';
    }

    $dir = str_replace('\\', '/', dirname(substr($normalized, $pos)));
    return '/' . trim($dir, '/') . '/';
}

function catalog_absolute_file_from_image_url(string $imageUrl): string
{
    return realpath(__DIR__ . '/../../') . '/' . ltrim($imageUrl, '/');
}
