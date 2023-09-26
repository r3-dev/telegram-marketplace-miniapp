package main

import (
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"
	"strings"

	"github.com/go-chi/chi/v5"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/plugins/migratecmd"
	// uncomment once you have at least one .go migration file in the "migrations" directory
	// _ "yourpackage/migrations"
)

func main() {
	app := pocketbase.New()

	// loosely check if it was executed using "go run"
	isGoRun := strings.HasPrefix(os.Args[0], os.TempDir())

	migratecmd.MustRegister(app, app.RootCmd, migratecmd.Config{
		// enable auto creation of migration files when making collection changes in the Admin UI
		// (the isGoRun check is to enable it only during development)
		Automigrate: isGoRun,
	})

	// serves static files from the provided public dir (if exists)
	app.OnBeforeServe().Add(func(e *core.ServeEvent) error {
		e.Router.GET("/*", apis.StaticDirectoryHandler(os.DirFS("./pb_public"), false))
		return nil
	})

	go reverseProxy()

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
