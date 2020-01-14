package chatroom

import (
	"flag"
	"fmt"
	"github.com/gohouse/t"
	"github.com/gohouse/chatroom/util"
	"log"
	"net/http"
)

var (
	f string
)

var conf Config

func init() {
	flag.StringVar(&f, "f", "", "配置文件")
	flag.Parse()
	// 解析配置
	if f!= "" {
		err := ParseConfig(f, &conf)
		if err != nil {
			panic(err.Error())
		}
	}
	if conf.Host == "" {
		conf.Host = "localhost:9200"
	}
	if conf.Uri == "" {
		conf.Uri = "/ws"
	}
	if conf.Static == "" {
		conf.Static = "client"
	}
}

func Run() {

	// 初始化房间
	room := NewRoom()
	// 房间开始工作
	go room.Work()

	// 前端静态页面渲染
	http.Handle("/client/", http.StripPrefix("/client/", http.FileServer(http.Dir(conf.Static))))
	// 获取配置接口
	http.HandleFunc("/getconfig", getConfig)
	// ws 服务地址
	http.Handle(conf.Uri, room)

	// 开启服务
	log.Printf("visit: http://%s/%s/client.html\n", conf.Host, "client")
	log.Fatal(http.ListenAndServe(conf.Host, nil))
}

func getConfig(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintln(w, t.New(map[string]string{
		"username": util.GetFullName(),
	}).String())
}
