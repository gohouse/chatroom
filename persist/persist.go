package persist

// MessageType 消息类型
type MessageType int

const (
	// Text 文本
	Text MessageType = iota
	// Image 图片
	Image
	// File 文件
	File
)

// Persister 消息持久化适配器
type Persister interface {
	Store(room_uuid string, uuid string, msg string, msgType MessageType) error
	Load(room_uuid string, limit, page int) (map[string]interface{},error)
}
