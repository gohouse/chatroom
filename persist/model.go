package persist

type Room struct {
	RoomUuid   string `gorose:"room_uuid" json:"room_uuid"`
	RoomTitle  string `gorose:"room_title" json:"room_title"`   // 房间名
	Uuid       string `gorose:"uuid" json:"uuid"`               // 创建人
	RoomFace   string `gorose:"room_face" json:"room_face"`     // 头像
	RoomDetail string `gorose:"room_detail" json:"room_detail"` // 房间简介
	RoomBg     string `gorose:"room_bg" json:"room_bg"`         // 背景图像
	RoomType   int64  `gorose:"room_type" json:"room_type"`     // 房间类型:默认0聊天室,1一对一
	CreatedAt  string `gorose:"created_at" json:"created_at"`
	UpdatedAt  string `gorose:"updated_at" json:"updated_at"`
}

func (Room) TableName() string {
	return "room"
}

type RoomUser struct {
	RoomUuid  string `gorose:"room_uuid" json:"room_uuid"`
	Uuid      string `gorose:"uuid" json:"uuid"`
	CreatedAt string `gorose:"created_at" json:"created_at"`
}

func (RoomUser) TableName() string {
	return "room_user"
}

type Users struct {
	Uuid       string `gorose:"uuid" json:"uuid"`
	Username   string `gorose:"username" json:"username"` // 用户名
	Nickname   string `gorose:"nickname" json:"nickname"` // 昵称
	Password   string `gorose:"password" json:"password"` // 密码
	Avatar     string `gorose:"avatar" json:"avatar"`     // 头像
	CreatedAt  string `gorose:"created_at" json:"created_at"`
	UpdatedAgt string `gorose:"updated_agt" json:"updated_agt"`
}

func (Users) TableName() string {
	return "users"
}

type Friend struct {
	Id        int64  `gorose:"id" json:"id"`
	Uuid      string `gorose:"uuid" json:"uuid"`
	Uuid2     string `gorose:"uuid2" json:"uuid2"`
	CreatedAt string `gorose:"created_at" json:"created_at"`
}

func (Friend) TableName() string {
	return "friend"
}

type Message struct {
	Id        int64  `gorose:"id" json:"id"`
	RoomUuid  string `gorose:"room_uuid" json:"room_uuid"`
	Uuid      string `gorose:"uuid" json:"uuid"`
	Msg       string `gorose:"msg" json:"msg"`           // 消息
	MsgType   int64  `gorose:"msg_type" json:"msg_type"` // 消息类型:0文本,1图片,2文件
	CreatedAt string `gorose:"created_at" json:"created_at"`
}

func (Message) TableName() string {
	return "message"
}
