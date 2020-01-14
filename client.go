package chatroom

import (
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
			go func() {
				cli.room.leave <- cli
			}()
			break
		}
		log.Println("读取到消息入队列: ", t.New(msg).String())
		// 加入广播消息
		go cli.room.Broadcast(cli, &msg)
	}
}
