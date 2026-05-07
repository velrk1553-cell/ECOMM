<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH . 'controllers/api/Sk_Base_Api.php';

class Sk_Testimonial extends Sk_Base_Api {

    public function index() {
        $this->api_cache('testimonials', 120, function () { $this->_testimonials(); });
    }

    private function _testimonials(): void {
        $rows = $this->db
            ->select('t.id, t.author_name, t.author_title, t.quote, t.rating,
                      t.product_id, p.name AS product_name, p.slug AS product_slug,
                      p.price AS product_price, p.sale_price AS product_sale_price,
                      p.thumbnail AS product_thumbnail')
            ->from('sk_testimonials t')
            ->join('products p', 'p.id = t.product_id', 'left')
            ->where('t.status', 1)
            ->order_by('t.sort_order', 'ASC')
            ->order_by('t.created_at', 'DESC')
            ->get()
            ->result_array();

        $base = base_url();
        foreach ($rows as &$r) {
            if (!empty($r['product_thumbnail'])) {
                $r['product_image_url'] = $base . $r['product_thumbnail'];
            } else {
                $r['product_image_url'] = null;
            }
        }
        unset($r);

        $this->success($rows);
    } // end _testimonials
}
