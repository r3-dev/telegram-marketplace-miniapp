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
	"time"

	initdata "github.com/Telegram-Web-Apps/init-data-golang"
	"github.com/go-chi/chi/v5"
	"github.com/joho/godotenv"
	"github.com/labstack/echo/v5"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/plugins/migratecmd"
	// uncomment once you have at least one .go migration file in the "migrations" directory
	// _ "yourpackage/migrations"
)

func telegramCheck(app core.App) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {

			token := os.Getenv("TELEGRAM_BOT_TOKEN")

			expIn := 24 * time.Hour

			// read the header values
			initDataRaw := c.Request().Header.Get("X-Init-Data")
			if initDataRaw == "" {
				return next(c)
			}

			initData, errParse := initdata.Parse(initDataRaw)
			if errParse != nil {
				err := fmt.Errorf("init data parse: %w", errParse)
				return err
			}

			if initData.User == nil {
				return fmt.Errorf("no user")
			}

			if err := initdata.Validate(initDataRaw, token, expIn); err != nil {
				return err
			}
			// authorizing regular users (the same could be done for admins)
			user, err := app.Dao().FindRecordsByIds("users", []string{strconv.Itoa(int(initData.User.ID))})
			if err != nil {
				return err
				// or if you want a formatted error
				// rest.NewUnauthorizedError("User doesn't exist", err)
			}

			// "authenticating" the user
			// for admins it would be `c.Set(apis.ContextAdminKey, admin)`
			c.Set("USER-KEY", user)

			return next(c)
		}
	}
}

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal(err)
	}

	app := pocketbase.New()

	// loosely check if it was executed using "go run"
	exePath := os.Args[0]
	isDevMode := strings.HasPrefix(exePath, os.TempDir()) || strings.Contains(exePath, "debug")

	migratecmd.MustRegister(app, app.RootCmd, migratecmd.Config{
		// enable auto creation of migration files when making collection changes in the Admin UI
		// (the isGoRun check is to enable it only during development)
		Automigrate: isDevMode,
	})

	// serves static files from the provided public dir (if exists)
	app.OnBeforeServe().Add(func(e *core.ServeEvent) error {
		e.Router.GET("/*", apis.StaticDirectoryHandler(os.DirFS("./pb_public"), false))

		e.Router.Pre(telegramCheck(app))

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
