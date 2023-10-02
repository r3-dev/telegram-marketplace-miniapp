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
			"id": "h30palxkh5zdmcp",
			"created": "2023-09-29 11:15:31.174Z",
			"updated": "2023-09-29 11:15:31.174Z",
			"name": "orders",
			"type": "base",
			"system": false,
			"schema": [
				{
					"system": false,
					"id": "1guoprpf",
					"name": "user",
					"type": "relation",
					"required": false,
					"unique": false,
					"options": {
						"collectionId": "_pb_users_auth_",
						"cascadeDelete": false,
						"minSelect": null,
						"maxSelect": 1,
						"displayFields": []
					}
				},
				{
					"system": false,
					"id": "4rgmm8qp",
					"name": "store",
					"type": "relation",
					"required": false,
					"unique": false,
					"options": {
						"collectionId": "ls1eoeu2j4mxjuu",
						"cascadeDelete": false,
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

		collection, err := dao.FindCollectionByNameOrId("h30palxkh5zdmcp")
		if err != nil {
			return err
		}

		return dao.DeleteCollection(collection)
	})
}
