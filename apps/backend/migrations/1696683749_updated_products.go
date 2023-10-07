package migrations

import (
	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase/daos"
	m "github.com/pocketbase/pocketbase/migrations"
	"github.com/pocketbase/pocketbase/tools/types"
)

func init() {
	m.Register(func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("9463u947e9svq7z")
		if err != nil {
			return err
		}

		collection.ListRule = types.Pointer("@request.auth.id != ''")

		collection.ViewRule = types.Pointer("@request.auth.id != ''")

		return dao.SaveCollection(collection)
	}, func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("9463u947e9svq7z")
		if err != nil {
			return err
		}

		collection.ListRule = nil

		collection.ViewRule = nil

		return dao.SaveCollection(collection)
	})
}
