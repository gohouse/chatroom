package main

import (
	"fmt"
	"github.com/gohouse/converter"
)
func main() {
	err := converter.NewTable2Struct().
		Config(&converter.T2tConfig{StructNameToHump:true}).
		SavePath("model/model.go").
		Dsn("root:123456@tcp(localhost:3306)/chat?charset=utf8mb4").
		TagKey("gorose").
		RealNameMethod("TableName").
		EnableJsonTag(true).
		Prefix("").
		//DB(booter.NewBooter().Engin.œGetQueryDB()).
		Run()
	fmt.Println(err)
}