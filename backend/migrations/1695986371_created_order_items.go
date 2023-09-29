package migrations

import (
	"encoding/json"

	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase/daos"
	m "github.com/pocketbase/pocketbase/migrations"
	"github.com/pocketbase/pocketbase/models"
)

func init() {
	m.Register(func(db dbx.Builder) error {
		jsonData := `{
			"id": "imm7z4sxmlmjlen",
			"created": "2023-09-29 11:19:31.141Z",
			"updated": "2023-09-29 11:19:31.141Z",
			"name": "order_items",
			"type": "base",
			"system": false,
			"schema": [
				{
					"system": false,
					"id": "durxyq7z",
					"name": "order",
					"type": "relation",
					"required": true,
					"unique": false,
					"options": {
						"collectionId": "h30palxkh5zdmcp",
						"cascadeDelete": false,
						"minSelect": null,
						"maxSelect": 1,
						"displayFields": []
					}
				},
				{
					"system": false,
					"id": "vmwjpjlm",
					"name": "product",
					"type": "relation",
					"required": true,
					"unique": false,
					"options": {
						"collectionId": "9463u947e9svq7z",
						"cascadeDelete": false,
						"minSelect": null,
						"maxSelect": 1,
						"displayFields": []
					}
				},
				{
					"system": false,
					"id": "s4zyx2dq",
					"name": "quantity",
					"type": "number",
					"required": true,
					"unique": false,
					"options": {
						"min": 0,
						"max": null
					}
				}
			],
			"indexes": [],
			"listRule": null,
			"viewRule": null,
			"createRule": null,
			"updateRule": null,
			"deleteRule": null,
			"options": {}
		}`

		collection := &models.Collection{}
		if err := json.Unmarshal([]byte(jsonData), &collection); err != nil {
			return err
		}

		return daos.New(db).SaveCollection(collection)
	}, func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("imm7z4sxmlmjlen")
		if err != nil {
			return err
		}

		return dao.DeleteCollection(collection)
	})
}
