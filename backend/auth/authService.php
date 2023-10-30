<?php
namespace App\Auth;

use PDO;
use App\Errors\UsernameAlreadyExistsError;
use App\Errors\ValidationError;
use App\Errors\AuthenticationError;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class AuthService {
    private $userDAO;
    private $key;
    private $hashAlgorithm = 'HS256';

    public function __construct($userDAO) {
        $this->userDAO = $userDAO;
        $this->key = getenv("TOKEN_KEY") ?: "mySecretKey";
    }

    public function register($data) {
        $errors = $this->validateUserData($data);
        if (!empty($errors)) {
            throw new ValidationError('Validation failed: ' . implode(', ', $errors));
        }

        $passwordHash = password_hash($data['password'], PASSWORD_DEFAULT);
        if ($passwordHash === false) {
            throw new \RuntimeException("Failed to hash password");
        }

        try {
            $this->userDAO->createUser([
                'username' => $data['username'],
                'password_hash' => $passwordHash
            ]);
        } catch (\PDOException $e) {
            throw new UsernameAlreadyExistsError('User already exists');
        } catch (\Exception $e) {
            throw new \RuntimeException("Unknown error");
        }
    }

    public function login($data) {
        $errors = $this->validateUserData($data);
        if (!empty($errors)) {
            throw new ValidationError('Validation failed: ' . implode(', ', $errors));
        }

        $user = $this->userDAO->getUserByUsername($data['username']);
        if ($user === false) {
            throw new AuthenticationError('Invalid username or password');
        }
    
        if (!password_verify($data['password'], $user['password_hash'])) {
            throw new AuthenticationError('Invalid username or password');
        }
    
        return $this->generateToken($user['username']);
    }

    public function isValidToken($token) {
        if (empty($token)) {
            return false;
        }
        try {
            $decoded = JWT::decode($token, new Key($this->key, $this->hashAlgorithm));
            return true;
        } catch (\Throwable $t) {
            return false;
        }
    }


    private function validateUserData($data) {
        $errors = [];

        $requiredFields = ['username', 'password'];
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

        if (isset($data['password']) && !is_string($data['password'])) {
            $errors[] = "password must be a string";
        } else if (isset($data['password']) && strlen($data['password']) > 255) {
            $errors[] = "password cannot be longer than 255 characters";
        }

        return $errors;
    }

    private function generateToken($username) {
        $payload = [
            "iat" => time(),
            "exp" => time() + (24 * 60 * 60), // 24h
            "username" => $username,
        ];
        $token = JWT::encode($payload, $this->key, $this->hashAlgorithm);
        return $token;
    }
}
