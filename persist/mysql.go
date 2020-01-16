package persist

import (
	"github.com/gohouse/chatroom/model"
	"github.com/gohouse/gorose/v2"
)

// Mysql ...
type Mysql struct {
	*gorose.Engin
}

// NewMysql ...
func NewMysql(ge *gorose.Engin) *Mysql {
	return &Mysql{ge}
}

// Store ...
func (m *Mysql) Store(msg *model.Message) (int64, error) {
	if msg.Id == 0 {
		return m.Engin.NewOrm().Insert(msg)
	}
	return m.Engin.NewOrm().Update(msg)
}

// Load ...
func (m *Mysql) Load(room_uuid string) (interface{}, error) {
	return m.Engin.NewOrm().
		Table(model.Message{}).
		Where("room_uuid", room_uuid).
		Order("id desc").
		Limit(100).
		Get()
}
