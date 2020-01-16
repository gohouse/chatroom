# chatroom
golang简单聊天室, 使用 `h5 + gorilla` 实现, 可自由拓展为多个聊天室

## 在线体现地址
[http://demo.xxjj.cf:9200](http://demo.xxjj.cf:9200)

## 运行
- 使用`vgo`进行版本控制  

```shell script
git clone https://github.com/gohouse/chatroom.git
cd chatroom
go mod tidy && go mod download
cd cmd/chatroom
go run main.go
```

## 效果图
![](client/chatroom.jpg)
