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

		collection, err := dao.FindCollectionByNameOrId("9463u947e9svq7z")
		if err != nil {
			return err
		}

		// update
		edit_store := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "mcgotk5u",
			"name": "store",
			"type": "relation",
			"required": false,
			"unique": false,
			"options": {
				"collectionId": "ls1eoeu2j4mxjuu",
				"cascadeDelete": true,
				"minSelect": null,
				"maxSelect": 1,
				"displayFields": []
			}
		}`), edit_store)
		collection.Schema.AddField(edit_store)

		return dao.SaveCollection(collection)
	}, func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("9463u947e9svq7z")
		if err != nil {
			return err
		}

		// update
		edit_store := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "mcgotk5u",
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
		}`), edit_store)
		collection.Schema.AddField(edit_store)

		return dao.SaveCollection(collection)
	})
}
