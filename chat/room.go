package chat

import (
	"fmt"
	"github.com/gohouse/chatroom/persist"
	"github.com/gohouse/chatroom/util"
	"github.com/gohouse/date"
	"github.com/gohouse/t"
	"github.com/gorilla/websocket"
	"log"
	"net/http"
	"time"
)

const (
	socketBufferSize  = 1024
	messageBufferSize = 256
)

type Room struct {
	persist.Persister
	upgrade    *websocket.Upgrader
	join       chan *Client
	leave      chan *Client
	clients    map[*Client]bool
	topic      string
	broadcast  chan *Response
	persistMsg chan *persist.Message
}

func NewRoom(ps persist.Persister) *Room {
	var upgrade = &websocket.Upgrader{
		//ReadBufferSize:  socketBufferSize,
		//WriteBufferSize: socketBufferSize,
		CheckOrigin: func(r *http.Request) bool {
			return true
		},
	}
	return &Room{
		Persister: ps,
		upgrade:   upgrade,
		join:      make(chan *Client),
		leave:     make(chan *Client),
		clients:   make(map[*Client]bool),
		broadcast: make(chan *Response),
		persistMsg:make(chan *persist.Message),
	}
}

func (room *Room) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	var user = r.FormValue("u")
	// 升级为 websocket
	conn, err := room.upgrade.Upgrade(w, r, nil)
	if err != nil {
		fmt.Println("websocket error:", err)
		return
	}
	fmt.Println("client connect :", conn.RemoteAddr())

	// 注册客户端
	var cli = Client{
		room:    room,
		conn:    conn,
		aliveAt: time.Now(),
		user:    user,
	}
	// 加入到加入聊天室队列
	go cli.Join()
	log.Println("注册客户端: ", conn.RemoteAddr())

	//// 生命周期维护
	//go ws.TimeoutCheck(conn)
	// 读取消息
	go cli.ReadMessage()
}

func (room *Room) Work() {
	for {
		select {
		case cli := <-room.join: // 加入房间
			// 上线通知
			log.Println("join room: ", cli.conn.RemoteAddr())
			//room.clients[cli] = true
			util.WithLockContext(func() {
				room.clients[cli] = true
			})
		case cli := <-room.leave: // 离开房间
			log.Println("leave room: ", cli.conn.RemoteAddr(), t.New(cli).String())
			cli.conn.Close()
			//delete(room.clients, cli)
			util.WithLockContext(func() {
				delete(room.clients, cli)
			})
		case resp := <-room.broadcast:
			log.Println("broadcast: ", t.New(resp).String())
			for cli := range room.clients {
				err := cli.conn.WriteJSON(resp)
				if err != nil {
					go cli.Leave()
				}
			}
		}
	}
}

func (room *Room) Broadcast(cli *Client, msg *Message) {
	var resp = Response{
		MT:     msg.MT,
		Msg:    msg.Msg,
		User:   cli.user,
		SendAt: time.Now().Format(date.DateTimeFormat),
	}

	cli.room.broadcast <- &resp
}

func (room *Room) BuildJoin(cli *Client) {
	room.join <- cli
}
func (room *Room) BuildLeave(cli *Client) {
	room.leave <- cli
}
func (room *Room) BuildResponse(resp *Response) {
	room.broadcast <- resp
}
