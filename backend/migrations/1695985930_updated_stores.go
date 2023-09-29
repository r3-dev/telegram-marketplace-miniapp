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

		// add
		new_description := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "ciu99tye",
			"name": "description",
			"type": "editor",
			"required": false,
			"unique": false,
			"options": {}
		}`), new_description)
		collection.Schema.AddField(new_description)

		// add
		new_field := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "10macb6f",
			"name": "field",
			"type": "file",
			"required": false,
			"unique": false,
			"options": {
				"maxSelect": 1,
				"maxSize": 5242880,
				"mimeTypes": [
					"image/jpeg",
					"image/png",
					"image/svg+xml",
					"image/gif",
					"image/webp"
				],
				"thumbs": [],
				"protected": false
			}
		}`), new_field)
		collection.Schema.AddField(new_field)

		return dao.SaveCollection(collection)
	}, func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("ls1eoeu2j4mxjuu")
		if err != nil {
			return err
		}

		// remove
		collection.Schema.RemoveField("ciu99tye")

		// remove
		collection.Schema.RemoveField("10macb6f")

		return dao.SaveCollection(collection)
	})
}
