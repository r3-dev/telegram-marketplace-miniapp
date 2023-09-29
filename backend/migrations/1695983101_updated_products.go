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

		// add
		new_store := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "ajeynuar",
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
		}`), new_store)
		collection.Schema.AddField(new_store)

		// update
		edit_images := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "idmoxmg6",
			"name": "images",
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
		}`), edit_images)
		collection.Schema.AddField(edit_images)

		return dao.SaveCollection(collection)
	}, func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("9463u947e9svq7z")
		if err != nil {
			return err
		}

		// remove
		collection.Schema.RemoveField("ajeynuar")

		// update
		edit_images := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
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
		}`), edit_images)
		collection.Schema.AddField(edit_images)

		return dao.SaveCollection(collection)
	})
}
