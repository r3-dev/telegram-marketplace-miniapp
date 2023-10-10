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

		collection, err := dao.FindCollectionByNameOrId("imm7z4sxmlmjlen")
		if err != nil {
			return err
		}

		// update
		edit_order := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "durxyq7z",
			"name": "order",
			"type": "relation",
			"required": true,
			"unique": false,
			"options": {
				"collectionId": "h30palxkh5zdmcp",
				"cascadeDelete": true,
				"minSelect": null,
				"maxSelect": 1,
				"displayFields": []
			}
		}`), edit_order)
		collection.Schema.AddField(edit_order)

		return dao.SaveCollection(collection)
	}, func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("imm7z4sxmlmjlen")
		if err != nil {
			return err
		}

		// update
		edit_order := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
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
		}`), edit_order)
		collection.Schema.AddField(edit_order)

		return dao.SaveCollection(collection)
	})
}
