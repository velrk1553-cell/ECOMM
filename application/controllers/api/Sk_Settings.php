<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH . 'controllers/api/Sk_Base_Api.php';

class Sk_Settings extends Sk_Base_Api {

    /** GET /shopkart-api/site-settings — public settings for the frontend */
    public function index() {
        $this->api_cache('site_settings', 300, function () { $this->_settings(); });
    }

    private function _settings(): void {
        $rows = $this->db->where_in('key', [
            'newsletter_popup_enabled',
            'site_name',
            'currency_symbol',
            'top_bar_enabled',
            'top_bar_text',
            'whatsapp_enabled',
            'whatsapp_number'
        ])->get('settings')->result_array();

        $map = [];
        foreach ($rows as $r) $map[$r['key']] = $r['value'];

        $map['newsletter_popup_enabled'] = isset($map['newsletter_popup_enabled'])
            ? (bool)(int)$map['newsletter_popup_enabled'] : true;
        $map['top_bar_enabled'] = isset($map['top_bar_enabled'])
            ? (bool)(int)$map['top_bar_enabled'] : true;
        $map['whatsapp_enabled'] = isset($map['whatsapp_enabled'])
            ? (bool)(int)$map['whatsapp_enabled'] : false;

        $this->success($map);
    }
}
