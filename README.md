## php-simple-jsondb

## Example

```php
include("./jsondb.php");

$db = new JsonDB("data.json");

$db->set("foo", "bar");

$value = $db->get("foo");

$db->delete("foo");

$data = $db->getAll();

$db->deleteAll();
```
