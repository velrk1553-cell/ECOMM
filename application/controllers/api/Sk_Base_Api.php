<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Sk_Base_Api extends CI_Controller {

    protected $user = null;

    public function __construct() {
        parent::__construct();
        $this->load->model(['Sk_Product_model','Sk_Order_model','Sk_User_model','Sk_Promo_model','Sk_Admin_model']);
        $this->load->library('Sk_JWT');
        $this->load->helper(['url']);
        // CORS
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }
    }

    protected function success($data = [], $message = 'Success', $status = 200) {
        $this->_json(['success' => true, 'message' => $message, 'data' => $data], $status);
    }

    protected function error($message = 'Error', $status = 400, $data = []) {
        $this->_json(['success' => false, 'message' => $message, 'data' => $data], $status);
    }

    private function _json($payload, $status) {
        http_response_code($status);
        header('Content-Type: application/json');
        echo json_encode($payload);
        exit;
    }

    /**
     * File-based response cache for public GET endpoints.
     * Checks for a valid cache file; if found, serves it and exits.
     * Otherwise runs $fn(), captures output, writes cache, then exits.
     * TTLs: categories/banners 120 s, products 60 s, settings 300 s.
     */
    protected function api_cache(string $key, int $ttl, callable $fn): void {
        $dir      = APPPATH . 'cache/api/';
        if (!is_dir($dir)) @mkdir($dir, 0755, true);
        $safe_key = preg_replace('/[^a-z0-9_-]/', '_', strtolower($key));
        $file     = $dir . $safe_key . '.json';

        if (file_exists($file) && (time() - filemtime($file)) < $ttl) {
            http_response_code(200);
            header('Content-Type: application/json');
            readfile($file);
            exit;
        }

        // Capture the response and write to cache on shutdown (runs after exit)
        ob_start();
        register_shutdown_function(function () use ($file) {
            $out = ob_get_contents();
            if ($out && strlen($out) > 2) {
                $decoded = json_decode($out, true);
                if ($decoded && !empty($decoded['success'])) {
                    @file_put_contents($file, $out, LOCK_EX);
                }
            }
        });

        $fn(); // calls $this->success() → exit
    }

    protected function auth_required() {
        $this->user = $this->sk_jwt->get_user_from_request();
        if (!$this->user) $this->error('Unauthorized. Please login.', 401);
        return $this->user;
    }

    protected function body() {
        return json_decode($this->input->raw_input_stream, true) ?? [];
    }

    protected function get_settings() {
        return $this->Sk_Admin_model->get_settings();
    }
}
