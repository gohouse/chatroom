# chatroom
golang简单聊天室, 使用 `h5 + gorilla` 实现, 可自由拓展为多个聊天室

## 在线体现地址
[http://demo.xxjj.cf:9200](http://demo.xxjj.cf:9200)

## 运行
```shell script
go get -u github.com/gohouse/chatroom/cmd/chatroom
chatroom
```
访问: [http://localhost:9200](http://localhost:9200) 即可体验了  

## 个人二次开发
- 安装 golang  
- 使用`vgo`进行版本控制  
*nix下开启: `export GO111MODULE=on`  
windows下开启: `go env -w GO111MODULE=on`  

- 下载并运行`chatroom`
    ```shell script
    git clone https://github.com/gohouse/chatroom.git --depth=1
    cd chatroom
    go mod tidy && go mod download
    cd cmd/chatroom
    go run main.go
    ```

## 效果图
![](static/chatroom.jpg)
