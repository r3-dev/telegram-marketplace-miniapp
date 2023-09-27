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
			"id": "ls1eoeu2j4mxjuu",
			"created": "2023-09-27 10:37:58.076Z",
			"updated": "2023-09-27 10:37:58.076Z",
			"name": "stores",
			"type": "base",
			"system": false,
			"schema": [
				{
					"system": false,
					"id": "b8ib9byi",
					"name": "name",
					"type": "text",
					"required": true,
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

		collection, err := dao.FindCollectionByNameOrId("ls1eoeu2j4mxjuu")
		if err != nil {
			return err
		}

		return dao.DeleteCollection(collection)
	})
}
