<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH . 'controllers/api/Sk_Base_Api.php';

class Sk_Auth extends Sk_Base_Api {

    public function register() {
        $data = $this->body();
        $name     = trim($data['name'] ?? '');
        $email    = trim($data['email'] ?? '');
        $password = $data['password'] ?? '';

        if (!$name || !$email || !$password) {
            return $this->error('Name, email and password are required.');
        }
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return $this->error('Invalid email address.');
        }
        if (strlen($password) < 6) {
            return $this->error('Password must be at least 6 characters.');
        }
        if ($this->Sk_User_model->get_by_email($email)) {
            return $this->error('Email already registered.');
        }

        $user_id = $this->Sk_User_model->create([
            'name'  => $name,
            'email' => $email,
            'password' => $password,
            'phone' => $data['phone'] ?? null,
        ]);

        // Save address if provided
        $address = $data['address'] ?? null;
        if ($address && !empty($address['line1'])) {
            $this->db->insert('user_addresses', [
                'user_id'    => $user_id,
                'label'      => 'Home',
                'full_name'  => $name,
                'phone'      => $data['phone'] ?? '',
                'line1'      => $address['line1'],
                'city'       => $address['city'] ?? '',
                'state'      => $address['state'] ?? '',
                'pincode'    => $address['pincode'] ?? '',
                'country'    => 'India',
                'is_default' => 1,
            ]);
        }

        $user = $this->Sk_User_model->get_by_id($user_id);
        $token = $this->sk_jwt->encode(['user_id' => $user_id, 'email' => $email]);

        $this->success([
            'token' => $token,
            'user'  => $this->_safe_user($user),
        ], 'Registration successful.', 201);
    }

    public function login() {
        $data = $this->body();
        $email    = trim($data['email'] ?? '');
        $password = $data['password'] ?? '';

        if (!$email || !$password) return $this->error('Email and password required.');

        $user = $this->Sk_User_model->get_by_email($email);
        if (!$user || !$this->Sk_User_model->verify_password($password, $user['password'])) {
            return $this->error('Invalid email or password.', 401);
        }
        if (!$user['status']) {
            return $this->error('Your account has been blocked.', 403);
        }

        $this->Sk_User_model->update_last_login($user['id']);
        $token = $this->sk_jwt->encode(['user_id' => $user['id'], 'email' => $user['email']]);

        $this->success([
            'token' => $token,
            'user'  => $this->_safe_user($user),
        ], 'Login successful.');
    }

    public function forgot_password() {
        $data  = $this->body();
        $email = trim($data['email'] ?? '');

        $user = $this->Sk_User_model->get_by_email($email);
        if (!$user) return $this->error('No account found with this email.');

        $token = $this->Sk_User_model->set_reset_token($email);

        // In production: send email with reset link
        // $this->load->library('email'); ...

        $this->success([], 'Password reset link sent to your email.');
    }

    public function otp_request() {
        $data  = $this->body();
        $phone = trim($data['phone'] ?? '');
        if (!$phone || strlen(preg_replace('/\D/', '', $phone)) < 10) {
            return $this->error('Valid phone number required.');
        }
        // In production: send real OTP via SMS/WhatsApp
        // For testing: OTP is always 123
        $this->success(['phone' => $phone], 'OTP sent to ' . $phone . '. Use 123 for testing.');
    }

    public function otp_verify() {
        $data  = $this->body();
        $phone = trim($data['phone'] ?? '');
        $otp   = trim($data['otp']   ?? '');

        if (!$phone || !$otp) return $this->error('Phone and OTP required.');

        // TODO: replace with real OTP check
        if ($otp !== '123') {
            return $this->error('Invalid OTP. Please try again.', 401);
        }

        $user = $this->Sk_User_model->get_by_phone($phone);

        if (!$user) {
            // New user — auto-register with phone
            $placeholder_email = 'ph_' . preg_replace('/\D/', '', $phone) . '@shopkart.app';
            $user_id = $this->Sk_User_model->create([
                'name'     => 'User ' . substr(preg_replace('/\D/', '', $phone), -4),
                'email'    => $placeholder_email,
                'password' => bin2hex(random_bytes(16)),
                'phone'    => $phone,
                'status'   => 1,
            ]);
            $user = $this->Sk_User_model->get_by_id($user_id);
        }

        if (!$user['status']) return $this->error('Your account has been blocked.', 403);

        $this->Sk_User_model->update_last_login($user['id']);
        $token = $this->sk_jwt->encode(['user_id' => $user['id'], 'email' => $user['email']]);

        $this->success([
            'token' => $token,
            'user'  => $this->_safe_user($user),
        ], 'Login successful.');
    }

    private function _safe_user($user) {
        unset($user['password'], $user['verify_token'], $user['reset_token'], $user['reset_expires']);
        return $user;
    }
}
