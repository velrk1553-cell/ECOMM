<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH . 'controllers/api/Sk_Base_Api.php';

class Sk_Banner extends Sk_Base_Api {

    /** GET /shopkart-api/banners — hero slides */
    public function index() {
        $this->api_cache('banners_hero', 120, function () { $this->_banners('hero'); });
    }

    /** GET /shopkart-api/collection-banners — tabbed collection section */
    public function collection() {
        $this->api_cache('banners_collection', 120, function () { $this->_banners('collection'); });
    }

    /** GET /shopkart-api/offer-banner — single active offer popup */
    public function offer() {
        $this->api_cache('banners_offer', 120, function () { $this->_offer_banner(); });
    }

    private function _banners(string $type): void {
        $banners = $this->db
            ->where('status', 1)
            ->where('type', $type)
            ->order_by('sort_order', 'ASC')
            ->get('sk_banners')
            ->result_array();

        $this->_add_image_url($banners);
        $this->success($banners);
    }

    private function _offer_banner(): void {
        $banner = $this->db
            ->where('status', 1)
            ->where('type', 'offer')
            ->order_by('sort_order', 'ASC')
            ->limit(1)
            ->get('sk_banners')
            ->row_array();

        $this->success($banner ?: null);
    }

    private function _add_image_url(&$banners) {
        $base = base_url();
        foreach ($banners as &$b) {
            $img = $b['image'] ?? '';
            $b['image_url'] = (!$img) ? '' : (strpos($img, 'http') === 0 ? $img : $base . $img);
        }
    }
}
