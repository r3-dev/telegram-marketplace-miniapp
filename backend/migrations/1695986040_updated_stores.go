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

		// remove
		collection.Schema.RemoveField("ciu99tye")

		// add
		new_description := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "fghcuq0l",
			"name": "description",
			"type": "text",
			"required": false,
			"unique": false,
			"options": {
				"min": null,
				"max": null,
				"pattern": ""
			}
		}`), new_description)
		collection.Schema.AddField(new_description)

		return dao.SaveCollection(collection)
	}, func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("ls1eoeu2j4mxjuu")
		if err != nil {
			return err
		}

		// add
		del_description := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "ciu99tye",
			"name": "description",
			"type": "editor",
			"required": false,
			"unique": false,
			"options": {}
		}`), del_description)
		collection.Schema.AddField(del_description)

		// remove
		collection.Schema.RemoveField("fghcuq0l")

		return dao.SaveCollection(collection)
	})
}
