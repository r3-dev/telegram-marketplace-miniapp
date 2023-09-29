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
			"id": "9463u947e9svq7z",
			"created": "2023-09-29 10:23:56.568Z",
			"updated": "2023-09-29 10:23:56.568Z",
			"name": "products",
			"type": "base",
			"system": false,
			"schema": [
				{
					"system": false,
					"id": "3ho0t2r5",
					"name": "name",
					"type": "text",
					"required": true,
					"unique": false,
					"options": {
						"min": null,
						"max": null,
						"pattern": ""
					}
				},
				{
					"system": false,
					"id": "0tkzwpy2",
					"name": "description",
					"type": "text",
					"required": false,
					"unique": false,
					"options": {
						"min": null,
						"max": null,
						"pattern": ""
					}
				},
				{
					"system": false,
					"id": "idmoxmg6",
					"name": "field",
					"type": "file",
					"required": false,
					"unique": false,
					"options": {
						"maxSelect": 99,
						"maxSize": 5242880,
						"mimeTypes": [
							"image/jpeg",
							"image/vnd.mozilla.apng",
							"image/png",
							"image/gif",
							"image/webp"
						],
						"thumbs": [],
						"protected": false
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

		collection, err := dao.FindCollectionByNameOrId("9463u947e9svq7z")
		if err != nil {
			return err
		}

		return dao.DeleteCollection(collection)
	})
}
