package main

import (
	"fmt"
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"
	"strconv"
	"strings"

	"github.com/go-chi/chi/v5"
	"github.com/joho/godotenv"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/models"
	"github.com/pocketbase/pocketbase/plugins/migratecmd"

	// uncomment once you have at least one .go migration file in the "migrations" directory
	_ "pb-stack/migrations"
)

func main() {
	// loosely check if it was executed using "go run"
	exePath := os.Args[0]
	isDevMode := strings.HasPrefix(exePath, os.TempDir()) || strings.Contains(exePath, "debug")

	if isDevMode {
		err := godotenv.Load("../../.env")
		if err != nil {
			log.Fatal(err)
		}
	}

	app := pocketbase.New()

	migratecmd.MustRegister(app, app.RootCmd, migratecmd.Config{
		// enable auto creation of migration files when making collection changes in the Admin UI
		// (the isGoRun check is to enable it only during development)
		Automigrate: isDevMode,
	})

	// serves static files from the provided public dir (if exists)
	app.OnBeforeServe().Add(func(e *core.ServeEvent) error {
		e.Router.GET("/*", apis.StaticDirectoryHandler(os.DirFS("./pb_public"), false))

		//e.Router.Pre(telegramCheck(app))

		return nil
	})

	app.OnRecordBeforeAuthWithPasswordRequest().Add(func(e *core.RecordAuthWithPasswordEvent) error {

		initDataUser, err := initDataCheck(e.HttpContext, e.Identity, e.Password)
		if initDataUser == nil {
			log.Println("no init data")
			return nil
		} else if err != nil {
			log.Println("something wrong: " + err.Error())
			return err
		}

		// authorizing regular users (the same could be done for admins)
		user, err := app.Dao().FindRecordById("users", strconv.FormatInt(initDataUser.ID, 10))
		if err != nil {
			// TODO: Check if the error is a "not found" error
			log.Default().Println("user not found, creating new one...")

			collection, errFind := app.Dao().FindCollectionByNameOrId("users")
			if errFind != nil {
				return err
			}

			record := models.NewRecord(collection)

			// set individual fields
			// or bulk load with record.Load(map[string]any{...})
			username := getUsername(initDataUser.Username, initDataUser.ID)
			record.Set("id", initDataUser.ID)
			record.Set("username", username)

			if errVerify := record.SetPassword("PASSWORDLESS"); errVerify != nil {
				return errVerify
			}
			if errVerify := record.SetVerified(true); errVerify != nil {
				return errVerify
			}

			if errSave := app.Dao().SaveRecord(record); errSave != nil {
				return errSave
			}

			user = record
		} else {
			log.Default().Println("user found: " + user.Id)
		}

		// "authenticating" the user
		// for admins it would be `c.Set(apis.ContextAdminKey, admin)`
		//e.HttpContext.Set(apis.ContextAuthRecordKey, user)

		if errAuthResp := apis.RecordAuthResponse(app, e.HttpContext, user, nil); errAuthResp != nil {
			return errAuthResp
		}
		return fmt.Errorf("skip")
	})

	// fires for every auth collection
	app.OnRecordBeforeAuthRefreshRequest().Add(func(e *core.RecordAuthRefreshEvent) error {
		initDataUser, err := initDataCheck(e.HttpContext, "USERNAMELESS", "PASSWORDLESS")
		if initDataUser == nil {
			log.Println("no init data")
			return nil
		} else if err != nil {
			log.Println("something wrong: " + err.Error())
			return err
		}

		return nil
	})

	if isDevMode {
		go reverseProxy()
	}

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}

func reverseProxy() {

	log.Println("starting reverse proxy...")

	remoteBackend, err := url.Parse("http://localhost:8090")
	if err != nil {
		panic(err)
	}

	remoteFrontend, err := url.Parse("http://localhost:4321")
	if err != nil {
		panic(err)
	}

	handlerBackend := func(p *httputil.ReverseProxy) func(http.ResponseWriter, *http.Request) {
		return func(w http.ResponseWriter, r *http.Request) {
			r.Host = remoteBackend.Host
			w.Header().Set("X-Ben", "Rad")
			p.ServeHTTP(w, r)
		}
	}

	handlerFrontend := func(p *httputil.ReverseProxy) func(http.ResponseWriter, *http.Request) {
		return func(w http.ResponseWriter, r *http.Request) {
			log.Println("GET page from " + r.URL.String())
			r.Host = remoteFrontend.Host
			w.Header().Set("X-Ben", "Rad")
			p.ServeHTTP(w, r)
		}
	}

	proxyBackend := httputil.NewSingleHostReverseProxy(remoteBackend)
	proxyFrontend := httputil.NewSingleHostReverseProxy(remoteFrontend)

	r := chi.NewRouter()

	r.HandleFunc("/api/*", handlerBackend(proxyBackend))
	r.HandleFunc("/_/*", handlerBackend(proxyBackend))
	r.HandleFunc("/*", handlerFrontend(proxyFrontend))

	err = http.ListenAndServe(":3000", r)
	if err != nil {
		panic(err)
	}
}
