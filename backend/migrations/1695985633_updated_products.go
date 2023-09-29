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
		new_category := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "api8gxpz",
			"name": "category",
			"type": "relation",
			"required": false,
			"unique": false,
			"options": {
				"collectionId": "czwjh0mysgfejiu",
				"cascadeDelete": false,
				"minSelect": null,
				"maxSelect": 1,
				"displayFields": []
			}
		}`), new_category)
		collection.Schema.AddField(new_category)

		// add
		new_price := &schema.SchemaField{}
		json.Unmarshal([]byte(`{
			"system": false,
			"id": "ycvczbun",
			"name": "price",
			"type": "number",
			"required": false,
			"unique": false,
			"options": {
				"min": null,
				"max": null
			}
		}`), new_price)
		collection.Schema.AddField(new_price)

		return dao.SaveCollection(collection)
	}, func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("9463u947e9svq7z")
		if err != nil {
			return err
		}

		// remove
		collection.Schema.RemoveField("api8gxpz")

		// remove
		collection.Schema.RemoveField("ycvczbun")

		return dao.SaveCollection(collection)
	})
}
