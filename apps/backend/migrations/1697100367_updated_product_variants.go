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

		collection, err := dao.FindCollectionByNameOrId("ja5hvsr0lfju8ci")
		if err != nil {
			return err
		}

		// update
		edit_product := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "9vf3h7gu",
			"name": "product",
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
		}`), edit_product)
		collection.Schema.AddField(edit_product)

		return dao.SaveCollection(collection)
	}, func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("ja5hvsr0lfju8ci")
		if err != nil {
			return err
		}

		// update
		edit_product := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
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
		}`), edit_product)
		collection.Schema.AddField(edit_product)

		return dao.SaveCollection(collection)
	})
}
