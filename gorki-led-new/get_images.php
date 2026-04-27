<?php
header('Content-Type: application/json');

$uploadDir = 'images/';
$type = $_GET['type'] ?? 'gallery';
$targetDir = $uploadDir . $type . '/';

$response = ['success' => false, 'message' => '', 'files' => []];

if (file_exists($targetDir)) {
    $files = scandir($targetDir);
    $imageFiles = [];
    
    foreach ($files as $file) {
        if ($file !== '.' && $file !== '..') {
            $filePath = $targetDir . $file;
            if (is_file($filePath)) {
                $fileInfo = pathinfo($filePath);
                $imageFiles[] = [
                    'name' => $file,
                    'path' => $filePath,
                    'url' => $filePath,
                    'size' => filesize($filePath),
                    'type' => mime_content_type($filePath),
                    'uploadDate' => date('c', filemtime($filePath))
                ];
            }
        }
    }
    
    // Сортируем по дате загрузки (новые сначала)
    usort($imageFiles, function($a, $b) {
        return strtotime($b['uploadDate']) - strtotime($a['uploadDate']);
    });
    
    $response['success'] = true;
    $response['files'] = $imageFiles;
    $response['message'] = 'Найдено ' . count($imageFiles) . ' файлов';
} else {
    $response['message'] = 'Директория не существует';
}

echo json_encode($response);
?>
