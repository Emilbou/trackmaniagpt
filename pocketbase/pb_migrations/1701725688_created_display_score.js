/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "39xsvr25z95jq7e",
    "created": "2023-12-04 21:34:48.319Z",
    "updated": "2023-12-04 21:34:48.319Z",
    "name": "display_score",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "6os1k6sr",
        "name": "Nom_joueur",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "iiexiaeo",
        "name": "player_score",
        "type": "number",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "noDecimal": false
        }
      }
    ],
    "indexes": [],
    "listRule": "",
    "viewRule": "",
    "createRule": "",
    "updateRule": "",
    "deleteRule": "",
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("39xsvr25z95jq7e");

  return dao.deleteCollection(collection);
})
