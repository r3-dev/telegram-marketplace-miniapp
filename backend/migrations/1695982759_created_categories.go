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
			"id": "czwjh0mysgfejiu",
			"created": "2023-09-29 10:19:19.262Z",
			"updated": "2023-09-29 10:19:19.262Z",
			"name": "categories",
			"type": "base",
			"system": false,
			"schema": [
				{
					"system": false,
					"id": "wukpyraw",
					"name": "name",
					"type": "text",
					"required": false,
					"unique": false,
					"options": {
						"min": null,
						"max": null,
						"pattern": ""
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

		collection, err := dao.FindCollectionByNameOrId("czwjh0mysgfejiu")
		if err != nil {
			return err
		}

		return dao.DeleteCollection(collection)
	})
}
