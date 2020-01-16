package chat

import (
	"github.com/BurntSushi/toml"
	"io/ioutil"
	"time"
)

type Config struct {
	Host string
	Uri  string
	Static  string
	Timeout time.Duration
}

func ParseConfig(file string, c *Config) error {
	// 解析配置
	bytes, err := ioutil.ReadFile(file)
	if err != nil {
		panic(err.Error())
	}
	return toml.Unmarshal(bytes, c)
}
