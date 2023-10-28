<?php
namespace App\DAO;

use PDO;

class Database {
    private $host; // '127.0.0.1';
    private $db = 'timeline';
    private $user; // 'service_account';
    private $pass; // 'mysecretpassword';
    private $charset = 'utf8mb4';

    public function __construct() {
        $this->host = getenv('DB_HOST');
        $this->user = getenv('DB_USER');
        $this->pass = getenv('DB_PASSWORD');
    }

    public function connect() {
        $dsn = "mysql:host=$this->host;dbname=$this->db;charset=$this->charset";
        try {
            $pdo = new PDO($dsn, $this->user, $this->pass);
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            return $pdo;
        } catch (\PDOException $e) {
            echo 'Connection failed: ' . $e->getMessage();
        }
    }
}
