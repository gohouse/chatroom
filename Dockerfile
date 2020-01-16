FROM ababy/golang-dependency

# 作者
LABEL maintainer="fizzday <fizzday@yeah.net>" \
        Description="golang-alpine git gohou/chatroom"

RUN apk add curl
RUN go get -u github.com/gohouse/chatroom/cmd/chatroom
