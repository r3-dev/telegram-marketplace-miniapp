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
		new_field := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "o3ax0bqh",
			"name": "field",
			"type": "relation",
			"required": false,
			"unique": false,
			"options": {
				"collectionId": "_pb_users_auth_",
				"cascadeDelete": false,
				"minSelect": null,
				"maxSelect": 1,
				"displayFields": [
					"id"
				]
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
		collection.Schema.RemoveField("o3ax0bqh")

		return dao.SaveCollection(collection)
	})
}
