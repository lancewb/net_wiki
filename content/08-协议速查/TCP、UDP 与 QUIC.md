# TCP、UDP 与 QUIC

## TCP

TCP 是面向连接的可靠传输协议。它提供：

- 三次握手。
- 序列号和确认。
- 重传。
- 拥塞控制。
- 流量控制。
- 有序字节流。

典型应用：HTTP/1.1、HTTP/2、SSH、数据库连接。

## TCP 三次握手

```text
Client -> Server: SYN
Server -> Client: SYN, ACK
Client -> Server: ACK
```

握手成功后才开始传输应用数据。

## UDP

UDP 是无连接报文协议。它不提供可靠性和顺序保证，但开销小、延迟低。

典型应用：DNS、部分语音视频、游戏、QUIC、WireGuard。

## QUIC

QUIC 运行在 UDP 之上，把可靠传输、拥塞控制、连接迁移、TLS 1.3 加密集成在一起。HTTP/3 基于 QUIC。

QUIC 的优势：

- 减少握手延迟。
- 避免 TCP 队头阻塞影响多个流。
- 连接迁移更适合移动网络。
- 默认加密。

## 防火墙视角

- TCP 有明显连接状态。
- UDP 也会被有状态设备创建临时会话，但超时时间通常更短。
- QUIC 使用 UDP/443，可能绕过一些传统基于 TCP 的代理和检测。

## 关联

- [[TLS、HTTP 与 HTTPS]]
- [[DNS 协议]]
- [[IPsec、WireGuard 与隧道]]
- [[端到端实例：局域网到公网再到对端局域网]]

