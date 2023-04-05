<?php
class JsonDB
{
    private $filename;

    function __construct($filename)
    {
        $this->filename = $filename;
    }

    function read()
    {
        $json = file_get_contents($this->filename);
        return json_decode($json, true);
    }

    function write($data)
    {
        $json = json_encode($data);
        file_put_contents($this->filename, $json);
    }

    function set($key, $value)
    {
        $data = $this->read();
        $data[$key] = $value;
        $this->write($data);
    }

    function get($key)
    {
        $data = $this->read();

        if (isset($data[$key])) {
            return $data[$key];
        } else {
            return null;
        }
    }

    function delete($key)
    {
        $data = $this->read();

        if (isset($data[$key])) {
            unset($data[$key]);
            $this->write($data);
            return true;
        } else {
            return false;
        }
    }

    function getAll()
    {
        return $this->read();
    }

    function deleteAll()
    {
        $this->write(array());
    }
}