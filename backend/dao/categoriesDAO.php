<?php
namespace App\DAO;

use PDO;
use App\Errors\ValidationError;

class CategoriesDAO {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    public function addCategory($data) {
        $errors = $this->validateCategoryData($data);
        if (!empty($errors)) {
            throw new ValidationError('Validation failed: ' . implode(', ', $errors));
        }
        $sql = "INSERT INTO categories (name, color_hash) VALUES (:name, :color_hash)";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            'name' => $data['name'] ?? null,
            'color_hash' => $data['color_hash'] ?? null
        ]);
        return $this->db->lastInsertId();
    }

    public function updateCategory($id, $data) {
        $errors = $this->validateCategoryData($data);
        if (!empty($errors)) {
            throw new ValidationError('Validation failed: ' . implode(', ', $errors));
        }
        if (empty($id) || empty($data['category_id']) || $id != $data['category_id']) {
            throw new ValidationError('Category id error: request param and body mismatch or not present)');
        }
        $sql = "UPDATE categories SET name = :name, color_hash = :color_hash WHERE category_id = :id";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            'id' => $id,
            'name' => $data['name'] ?? null,
            'color_hash' => $data['color_hash'] ?? null
        ]);
    }

    public function deleteCategory($id) {
        $sql = "DELETE FROM categories WHERE category_id = :id";
        $stmt = $this->db->prepare($sql);
        $stmt->execute(['id' => $id]);
    }

    private function validateCategoryData($data) {
        $errors = [];
    
        if (empty($data['name'])) {
            $errors[] = 'Name is required';
        } else if (!is_string($data['name']) || strlen($data['name']) > 255) {
            $errors[] = 'Name must be a string and not exceed 255 characters';
        }
    
        if (isset($data['color_hash']) && (!is_string($data['color_hash']) || strlen($data['color_hash']) > 255)) {
            $errors[] = 'Color hash must be a string and not exceed 255 characters';
        }
    
        return $errors;
    }
}