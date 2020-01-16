package chat

type MessageType int

const (
	// BroadcastMessage 广播消息(正常的消息)
	MT_Broadcast MessageType = iota + 1

	// ConnectedMessage 上线通知
	MT_Connected

	// DisconnectedMessage 下线通知
	MT_Disconnected

	// HeartBeatMessage 心跳消息
	MT_HeartBeat

	// SystemMessage 系统消息
	MT_System

	// BreakMessage 服务断开链接通知(服务端关闭)
	MT_Break
)

func (mt MessageType) String() string {
	switch mt {
	case MT_System:
		return "系统消息"
	case MT_Broadcast:
		return ""
	case MT_HeartBeat:
		return "心跳消息"
	case MT_Connected:
		return "加入聊天室"
	case MT_Disconnected:
		return "离开聊天室"
	case MT_Break:
		return "服务端断开连接"
	}
	return "其他消息"
}

type Message struct {
	MT  MessageType
	Msg string
	//User string
}

type Response struct {
	MT     MessageType
	Msg    string
	User   string
	SendAt string
}
