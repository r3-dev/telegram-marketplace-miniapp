package main

import (
	"fmt"
	"os"
	"strconv"
	"time"

	initdata "github.com/Telegram-Web-Apps/init-data-golang"
	"github.com/labstack/echo/v5"
)

func getUsername(username string, id int64) string {
	if username != "" {
		return username
	} else {
		return strconv.FormatInt(id, 10)
	}
}

func initDataCheck(c echo.Context, identity string, password string) (*initdata.User, error) {
	token := os.Getenv("TELEGRAM_BOT_TOKEN")

	expIn := 24 * time.Hour

	// read the header values
	initDataRaw := c.Request().Header.Get("X-Init-Data")
	if initDataRaw == "" {
		return nil, nil
	}

	if identity != "USERNAMELESS" || password != "PASSWORDLESS" {
		return nil, fmt.Errorf("wrong credentials")
	}

	initData, errParse := initdata.Parse(initDataRaw)
	if errParse != nil {
		err := fmt.Errorf("init data parse: %w", errParse)
		return nil, err
	}

	if initData.User == nil {
		return initData.User, fmt.Errorf("no user")
	}

	if err := initdata.Validate(initDataRaw, token, expIn); err != nil {
		return initData.User, fmt.Errorf("not valid: %w", err)
	}
	return initData.User, nil
}
