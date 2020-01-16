package chat

import (
	"github.com/gohouse/date"
	"github.com/gohouse/t"
	"github.com/gorilla/websocket"
	"log"
	"time"
)

type Client struct {
	room    *Room
	conn    *websocket.Conn
	aliveAt time.Time
	//User    string
	user string
}

func (cli *Client) ReadMessage() {
	for {
		var msg Message
		err := cli.conn.ReadJSON(&msg)
		if err != nil {
			log.Println("读取消息错误:", cli.conn.RemoteAddr(), err.Error())
			// 加入到离开队列
			go cli.Leave()
			break
		}
		log.Println("读取到消息入队列: ", t.New(msg).String())
		// 加入广播消息
		go cli.room.Broadcast(cli, &msg)
	}
}


func (cli *Client) Join() {
	go cli.room.BuildJoin(cli)

	var resp = Response{
		MT:     MT_Connected,
		Msg:    MT_Connected.String(),
		User:   cli.user,
		SendAt: time.Now().Format(date.DateTimeFormat),
	}

	go cli.room.BuildResponse(&resp)
}

func (cli *Client) Leave() {
	go cli.room.BuildLeave(cli)

	var resp = Response{
		MT:     MT_Disconnected,
		Msg:    MT_Disconnected.String(),
		User:   cli.user,
		SendAt: time.Now().Format(date.DateTimeFormat),
	}

	go cli.room.BuildResponse(&resp)
}

