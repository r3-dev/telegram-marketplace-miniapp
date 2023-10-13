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
			"id": "ja5hvsr0lfju8ci",
			"created": "2023-10-12 08:44:03.075Z",
			"updated": "2023-10-12 08:44:03.075Z",
			"name": "product_variants",
			"type": "base",
			"system": false,
			"schema": [
				{
					"system": false,
					"id": "9vf3h7gu",
					"name": "field",
					"type": "relation",
					"required": false,
					"unique": false,
					"options": {
						"collectionId": "9463u947e9svq7z",
						"cascadeDelete": true,
						"minSelect": null,
						"maxSelect": 1,
						"displayFields": []
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

		collection, err := dao.FindCollectionByNameOrId("ja5hvsr0lfju8ci")
		if err != nil {
			return err
		}

		return dao.DeleteCollection(collection)
	})
}
