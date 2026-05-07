<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH . 'controllers/api/Sk_Base_Api.php';

class Sk_Order extends Sk_Base_Api {

    public function checkout() {
        $this->auth_required();
        $data = $this->body();

        // Validate address
        $addr = $data['address'] ?? null;
        if (!$addr || empty($addr['full_name']) || empty($addr['line1'])) {
            return $this->error('Shipping address is required.');
        }

        // Build cart
        $user_id = $this->user['user_id'];
        $items   = $this->db->where('user_id', $user_id)->get('cart')->result_array();
        if (empty($items)) return $this->error('Cart is empty.');

        $settings = $this->get_settings();
        $subtotal = 0;
        $order_items = [];

        foreach ($items as $item) {
            $p = $this->Sk_Product_model->get_by_id($item['product_id']);
            if (!$p || $p['status'] !== 'active') return $this->error("Product '{$p['name']}' is no longer available.");
            if ($p['stock'] < $item['quantity']) return $this->error("Insufficient stock for '{$p['name']}'.");
            $price    = $p['effective_price'] ?? $p['sale_price'] ?? $p['price'];
            $sub      = round($price * $item['quantity'], 2);
            $subtotal += $sub;
            $order_items[] = [
                'product_id'   => $p['id'],
                'product_name' => $p['name'],
                'product_sku'  => $p['sku'],
                'thumbnail'    => $p['thumbnail'],
                'price'        => $price,
                'quantity'     => $item['quantity'],
                'subtotal'     => $sub,
            ];
        }

        // Promo
        $discount = 0;
        $promo_code = null;
        if (!empty($data['promo_code'])) {
            $check = $this->Sk_Promo_model->validate($data['promo_code'], $user_id, $subtotal);
            if ($check['valid']) {
                $discount   = $check['discount'];
                $promo_code = $data['promo_code'];
            }
        }

        $shipping = $subtotal >= ($settings['free_shipping_above'] ?? 999) ? 0 : ($settings['shipping_charge'] ?? 50);
        $tax      = round($subtotal * ($settings['tax_rate'] ?? 18) / 100, 2);
        $total    = round($subtotal - $discount + $shipping + $tax, 2);

        $order_data = [
            'user_id'          => $user_id,
            'subtotal'         => $subtotal,
            'shipping'         => $shipping,
            'tax'              => $tax,
            'discount'         => $discount,
            'promo_code'       => $promo_code,
            'total'            => $total,
            'payment_method'   => $data['payment_method'] ?? 'razorpay',
            'payment_status'   => 'pending',
            'status'           => 'pending',
            'notes'            => $data['note'] ?? $data['notes'] ?? null,
            'shipping_name'    => $addr['full_name'],
            'shipping_phone'   => $addr['phone'] ?? '',
            'shipping_line1'   => $addr['line1'],
            'shipping_line2'   => $addr['line2'] ?? '',
            'shipping_city'    => $addr['city'],
            'shipping_state'   => $addr['state'],
            'shipping_pincode' => $addr['pincode'],
            'shipping_country' => $addr['country'] ?? 'India',
        ];

        $order_id = $this->Sk_Order_model->create($order_data, $order_items);

        // Record promo usage
        if ($promo_code && !empty($check['promo'])) {
            $this->Sk_Promo_model->record_usage($check['promo']['id'], $user_id, $order_id);
        }

        // Clear cart
        $this->db->where('user_id', $user_id)->delete('cart');

        $order = $this->Sk_Order_model->get_by_id($order_id, $user_id);

        // Send confirmation email (non-blocking — ignore errors)
        $this->load->helper('sk_mailer');
        $settings = $this->get_settings();
        sk_mail_order_confirmation($order, $settings);

        $this->success(['order' => $order], 'Order placed successfully.', 201);
    }

    public function index() {
        $this->auth_required();
        $page   = max(1, (int)($this->input->get('page') ?? 1));
        $limit  = 10;
        $offset = ($page - 1) * $limit;
        $orders = $this->Sk_Order_model->get_user_orders($this->user['user_id'], $limit, $offset);
        // Attach items to each order for frontend display
        foreach ($orders as &$o) {
            $o['items'] = $this->Sk_Order_model->get_items($o['id']);
        }
        unset($o);
        $this->success($orders);
    }

    public function show($id) {
        $this->auth_required();
        $order = $this->Sk_Order_model->get_by_id($id, $this->user['user_id']);
        if (!$order) return $this->error('Order not found.', 404);
        $this->success($order);
    }

    public function cancel($id) {
        $this->auth_required();
        $order = $this->Sk_Order_model->get_by_id((int)$id, $this->user['user_id']);
        if (!$order) return $this->error('Order not found.', 404);
        if ($order['status'] !== 'pending') {
            return $this->error('Only pending orders can be cancelled.');
        }
        $this->Sk_Order_model->update_status((int)$id, 'cancelled');
        $this->Sk_Order_model->update_payment_status((int)$id, 'failed');
        $this->success([], 'Order cancelled.');
    }
}
