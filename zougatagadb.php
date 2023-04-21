<?php
class cipherData {
    private $key;
    private $iv;

    function __construct($obj = null) {
        $this->key = $obj['key'] ?? $this->stringToByte("zougatagaongit", 32);
        $this->iv = $obj['iv'] ?? $this->stringToByte("zougatagaongit", 16);
    }

    private function stringToByte($str, $size = 32) {
        return substr(hash("sha256", $str, true), 0, $size);
    }

    public function encryptData($data) {
        $encrypted = openssl_encrypt($data, "aes-256-cbc", $this->key, OPENSSL_RAW_DATA, $this->iv);
        return bin2hex($encrypted);
    }

    public function decryptData($data) {
        $decrypted = openssl_decrypt(hex2bin($data), "aes-256-cbc", $this->key, OPENSSL_RAW_DATA, $this->iv);
        return $decrypted;
    }
}
class zougatagaDb
{
    private $path;
    private $cipher;
    private $cryptData;
    private $data;

    public function __construct($obj = null)
    {
        $this->path = isset($obj['path']) ? $obj['path'] : './zougataga.db';
        $this->cryptData = isset($obj['cryptData']) ? $obj['cryptData'] : false;
        $this->cipher = new cipherData();
        if (!file_exists($this->path)) {
            $this->setAllData([]);
        }
        $this->data = $this->getAllData();
    }

    public function getAll()
    {
        $all = [];
        foreach ($this->data as $key => $value) {
            $all[] = ['id' => $key, 'data' => $value];
        }
        return $all;
    }

    public function deleteAll()
    {
        $this->setAllData([]);
        $this->data = $this->getAllData();
        return [];
    }

    public function set($id, $dataToSet)
    {
        if (!$id) {
            throw new Exception("No id specified");
        }
        if (!is_string($id)) {
            throw new Exception("ID: \"$id\" IS NOT a string");
        }
        if (!isset($dataToSet)) {
            throw new Exception("Data @ ID: \"$id\" IS NOT specified");
        }
        $this->data[$id] = $dataToSet;
        $this->setAllData($this->data);
        return $this->getData($id);
    }

    public function get($id)
    {
        if (!$id) {
            throw new Exception("No id specified");
        }
        if (!is_string($id)) {
            throw new Exception("ID: \"$id\" IS NOT a string");
        }
        return $this->getData($id);
    }

    public function delete($id)
    {
        if (!$id) {
            throw new Exception("No id specified");
        }
        if (!is_string($id)) {
            throw new Exception("ID: \"$id\" IS NOT a string");
        }
        unset($this->data[$id]);
        $this->setAllData($this->data);
        return $this->getData($id);
    }

    public function push($id, $dataToPush)
    {
        if (!$id) {
            throw new Exception("No id specified");
        }
        if (!is_string($id)) {
            throw new Exception("ID: \"$id\" IS NOT a string");
        }
        if (!isset($dataToPush)) {
            throw new Exception("Data @ ID: \"$id\" IS NOT specified");
        }
        $data = $this->getData($id);
        if (!is_array($data)) {
            $data = [];
        }
        $data[] = $dataToPush;
        $this->setData($id, $data);
        return $this->getData($id);
    }

    public function pull($id, $dataToFind)
    {
        if (!$id) {
            throw new Exception("No id specified");
        }
        if (!is_string($id)) {
            throw new Exception("ID: \"$id\" IS NOT a string");
        }
        if (!isset($dataToFind)) {
            throw new Exception("Data @ ID: \"$id\" IS NOT specified");
        }
        $data = $this->getData($id);
        if (!is_array($data)) {
            throw new Exception("ID: \"$id\" IS NOT an array");
        }
        return array_values(array_filter($data, function ($d) use ($dataToFind) {
            return $d == $dataToFind;
        }));
    }

    public function add($id, $number)
    {
        if (!$id)
            throw new TypeError("No id specified");
        if (!is_string($id))
            throw new TypeError("ID: '$id' IS NOT a string");
        if (!$number)
            throw new TypeError("Data @ ID: '$id' IS NOT specified");
        $data = (float) $this->getData($id) ?? 0;
        $rnumber = (float) $number;
        if (!$rnumber || is_nan($rnumber))
            throw new Error("[zougatagaDb] Data @ ID: '$id' IS NOT A number.\nFOUND: $number\nEXPECTED: number");
        return $this->setData($id, (float) ($data + $rnumber));
    }

    public function subtract($id, $number)
    {
        if (!$id)
            throw new TypeError("No id specified");
        if (!is_string($id))
            throw new TypeError("ID: '$id' IS NOT a string");
        if (!$number)
            throw new TypeError("Data @ ID: '$id' IS NOT specified");
        $data = (float) $this->getData($id) ?? 0;
        $rnumber = (float) $number;
        if (!$rnumber || is_nan($rnumber))
            throw new Error("[zougatagaDb] Data @ ID: '$id' IS NOT A number.\nFOUND: $number\nEXPECTED: number");
        return $this->setData($id, (float) ($data - $rnumber));
    }

    private function getAllData()
    {
        $jsonData = file_get_contents($this->path);
        if ($this->cryptData) {
            $jsonData = $this->cipher->decryptData($jsonData);
        }
        return json_decode($jsonData, true);
    }

    private function setAllData($data)
    {
        $jsonData = json_encode($data);
        if ($this->cryptData) {
            $jsonData = $this->cipher->encryptData($jsonData);
        }
        file_put_contents($this->path, $jsonData);
    }

    private function getData($id)
    {
        return isset($this->data[$id]) ? $this->data[$id] : null;
    }

    private function setData($id, $dataToSet)
    {
        if (!$id) {
            throw new Exception("No id specified");
        }
        if (!is_string($id)) {
            throw new Exception("ID: \"$id\" IS NOT a string");
        }
        if (!isset($dataToSet)) {
            throw new Exception("Data @ ID: \"$id\" IS NOT specified");
        }
        $this->data[$id] = $dataToSet;
        $this->setAllData($this->data);
    }

}
