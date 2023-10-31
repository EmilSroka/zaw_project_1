<?php
namespace App\DAO;

use PDO;
use App\Errors\ValidationError;

class EventsDAO {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    public function getEvent($eventId) {
        $sql = "SELECT e.*, c.category_id, c.name as category_name, c.color_hash as category_color_hash
                FROM events e
                LEFT JOIN categories c ON e.category_id = c.category_id
                WHERE e.event_id = :event_id";

        $stmt = $this->db->prepare($sql);
        $stmt->execute(['event_id' => $eventId]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($result) {
            $result['category'] = [
                'category_id' => $result['category_id'],
                'name' => $result['category_name'],
                'color_hash' => $result['category_color_hash']
            ];
            unset($result['category_id']);
            unset($result['category_name']);
            unset($result['category_color_hash']);
        }
        return $result;
    }

    public function listEvents() {
        $sql = "SELECT e.*, c.category_id, c.name as category_name, c.color_hash as category_color_hash
                FROM events e
                LEFT JOIN categories c ON e.category_id = c.category_id";

        $stmt = $this->db->query($sql);
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

        foreach ($results as &$result) {
            $result['category'] = [
                'category_id' => $result['category_id'],
                'name' => $result['category_name'],
                'color_hash' => $result['category_color_hash']
            ];
            unset($result['category_id']);
            unset($result['category_name']);
            unset($result['category_color_hash']);
        }
        return $results;
    }

    public function addEvent($data) {
        $errors = $this->validateEventData($data);
        if (!empty($errors)) {
            throw new ValidationError('Validation failed: ' . implode(', ', $errors));
        }

        $sql = "INSERT INTO events (name, start_date, end_date, description, image_url, category_id) 
                VALUES (:name, :start_date, :end_date, :description, :image_url, :category_id)";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            ':name' => $data['name'],
            ':start_date' => $data['start_date'],
            ':end_date' => $data['end_date'] ?? null,
            ':description' => $data['description'] ?? null,
            ':image_url' => $data['image_url'] ?? null,
            ':category_id' => $data['category_id'] ?? null
        ]);    
        return $this->db->lastInsertId();
    }

    public function updateEvent($eventId, $data) {
        $errors = $this->validateEventData($data);
        if (!empty($errors)) {
            throw new ValidationError('Validation failed: ' . implode(', ', $errors));
        }
        if (empty($eventId) || empty($data['event_id']) || $eventId != $data['event_id']) {
            throw new ValidationError('Event id error: request param and body mismatch or not present)');
        }
        $data['event_id'] = $eventId;
        $sql = "UPDATE events SET name = :name, start_date = :start_date, end_date = :end_date, 
                description = :description, image_url = :image_url, category_id = :category_id 
                WHERE event_id = :event_id";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            ':event_id' => $eventId,
            ':name' => $data['name'],
            ':start_date' => $data['start_date'],
            ':end_date' => $data['end_date'] ?? null,
            ':description' => $data['description'] ?? null,
            ':image_url' => $data['image_url'] ?? null,
            ':category_id' => $data['category_id'] ?? null
        ]);
    }

    public function deleteEvent($eventId) {
        $sql = "DELETE FROM events WHERE event_id = :event_id";
        $stmt = $this->db->prepare($sql);
        $stmt->execute(['event_id' => $eventId]);
    }

    private function validateEventData($data) {
        $errors = [];
    
        $requiredFields = ['name', 'start_date'];
        foreach ($requiredFields as $field) {
            if (empty($data[$field])) {
                $errors[] = "$field is required";
            }
        }
    
        if (isset($data['name']) && !is_string($data['name'])) {
            $errors[] = "name must be a string";
        } else if (isset($data['name']) && strlen($data['name']) > 255) {
            $errors[] = "name cannot be longer than 255 characters";
        }
    
        if (isset($data['start_date']) && \DateTime::createFromFormat('Y-m-d', $data['start_date']) == false) {
            $errors[] = "start_date must be a valid date in Y-m-d format";
        }
    
        if (isset($data['end_date']) && $data['end_date'] != null && \DateTime::createFromFormat('Y-m-d', $data['end_date']) == false) {
            $errors[] = "end_date must be a valid date in Y-m-d format or null";
        }
    
        if (isset($data['category_id']) && (!is_numeric($data['category_id']) || $data['category_id'] <= 0 || floor($data['category_id']) != $data['category_id'])) {
            $errors[] = "category_id must be a positive integer";
        }
    
        return $errors;
    }    
}
