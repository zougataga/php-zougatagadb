## Php ZougatagaDb (JSON)

## Example

```php
require_once './zougatagadb.php';

$db = new zougatagaDb();

$db->set("alllevel", [["level" => 1], ["level" => 2]]);
// -> [["level" => 1], ["level" => 2]]

$db->get("alllevel");
// -> [["level" => 1], ["level" => 2]]

$db->push("alllevel", ["level" => 1]);
// -> [["level" => 1], ["level" => 2], ["level" => 1]]

$db->pull("alllevel", function ($e) {
    return $e["level"] === 1; });
// -> [["level" => 1], ["level" => 1]]

$db->getAll();
// -> [ ["id" => "alllevel", "data" => [["level" => 1], ["level" => 2], ["level" => 1]]] ]

$db->pullDelete("alllevel", function ($e) {
    return $e["level"] === 1; });
// -> [["level" => 2]]

$db->delete("alllevel");
// -> null

$db->set("level_<userId>", 4);
// -> 4

// Ajout d'une valeur numérique à la valeur existante
$db->add("level_<userId>", 1);
// -> 5

$db->subtract("level_<userId>", 7);
// -> -2

$db->deleteAll();
// -> null
```
