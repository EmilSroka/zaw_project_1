<?php
namespace App\DAO;

use PDO;

class UsersDAO {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    public function createUser($data) {
        $errors = $this->validateUserData($data);
        if (!empty($errors)) {
            throw new \Exception('Validation failed: ' . implode(', ', $errors));
        }

        $sql = "INSERT INTO users (username, password_hash) VALUES (:username, :password_hash)";
        $stmt = $this->db->prepare($sql);
        $stmt->execute($data);
        return $this->db->lastInsertId();
    }

    public function updateUser($userId, $data) {
        $errors = $this->validateUserData($data);
        if (!empty($errors)) {
            throw new \Exception('Validation failed: ' . implode(', ', $errors));
        }

        $data['user_id'] = $userId;
        $sql = "UPDATE users SET username = :username, password_hash = :password_hash WHERE user_id = :user_id";
        $stmt = $this->db->prepare($sql);
        $stmt->execute($data);
    }

    public function getUser($userId) {
        $sql = "SELECT * FROM users WHERE user_id = :user_id";
        $stmt = $this->db->prepare($sql);
        $stmt->execute(['user_id' => $userId]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function deleteUser($userId) {
        $sql = "DELETE FROM users WHERE user_id = :user_id";
        $stmt = $this->db->prepare($sql);
        $stmt->execute(['user_id' => $userId]);
    }

    private function validateUserData($data) {
        $errors = [];

        $requiredFields = ['username', 'password_hash'];
        foreach ($requiredFields as $field) {
            if (empty($data[$field])) {
                $errors[] = "$field is required";
            }
        }

        if (isset($data['username']) && !is_string($data['username'])) {
            $errors[] = "username must be a string";
        } else if (isset($data['username']) && strlen($data['username']) > 255) {
            $errors[] = "username cannot be longer than 255 characters";
        }

        if (isset($data['password_hash']) && !is_string($data['password_hash'])) {
            $errors[] = "password_hash must be a string";
        } else if (isset($data['password_hash']) && strlen($data['password_hash']) > 255) {
            $errors[] = "password_hash cannot be longer than 255 characters";
        }

        return $errors;
    }
}
