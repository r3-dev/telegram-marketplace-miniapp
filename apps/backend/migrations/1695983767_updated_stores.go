package migrations

import (
	"encoding/json"

	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase/daos"
	m "github.com/pocketbase/pocketbase/migrations"
	"github.com/pocketbase/pocketbase/models/schema"
)

func init() {
	m.Register(func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("ls1eoeu2j4mxjuu")
		if err != nil {
			return err
		}

		// update
		edit_products := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "qz2vqjoq",
			"name": "products",
			"type": "relation",
			"required": false,
			"unique": false,
			"options": {
				"collectionId": "9463u947e9svq7z",
				"cascadeDelete": false,
				"minSelect": null,
				"maxSelect": null,
				"displayFields": [
					"name"
				]
			}
		}`), edit_products)
		collection.Schema.AddField(edit_products)

		return dao.SaveCollection(collection)
	}, func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("ls1eoeu2j4mxjuu")
		if err != nil {
			return err
		}

		// update
		edit_products := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "qz2vqjoq",
			"name": "products",
			"type": "relation",
			"required": false,
			"unique": false,
			"options": {
				"collectionId": "9463u947e9svq7z",
				"cascadeDelete": false,
				"minSelect": null,
				"maxSelect": null,
				"displayFields": []
			}
		}`), edit_products)
		collection.Schema.AddField(edit_products)

		return dao.SaveCollection(collection)
	})
}
