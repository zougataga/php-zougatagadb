<?php

class zougatagaDb
{
    private $path;
    private $data;

    public function __construct($obj = null)
    {
        $this->path = isset($obj['path']) ? $obj['path'] : './zougataga.db';
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
        return json_decode($jsonData, true);
    }

    private function setAllData($data)
    {
        $jsonData = json_encode($data);
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
