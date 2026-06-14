# ICMP 与故障诊断

## ICMP 是什么

ICMP 用于网络层控制和错误报告。它不是只为 ping 服务。

## 常见用途

| 用途 | 说明 |
|---|---|
| Echo Request/Reply | ping |
| Time Exceeded | traceroute 路径发现 |
| Destination Unreachable | 不可达反馈 |
| Fragmentation Needed | IPv4 PMTUD |
| ICMPv6 Packet Too Big | IPv6 PMTUD 必需 |

## ping 能说明什么

ping 通说明：

- 目的地址至少能收到 ICMP Echo。
- 回程路径可用。

ping 不通不一定说明业务不通，因为 ICMP 可能被禁用或限速。

## traceroute 原理

traceroute 发送 TTL/Hop Limit 逐渐增加的探测包。每一跳 TTL 到 0 后返回 Time Exceeded，从而显示中间路径。

## ICMP 不应全部封死

过度拦截 ICMP 会影响：

- PMTUD。
- IPv6 邻居发现和错误报告。
- 排障。

安全策略应精细限制，而不是粗暴全部丢弃。

## 关联

- [[IPv4 协议]]
- [[IPv6 协议]]
- [[封装、解封装与 MTU]]
- [[网络可观测性与排障工具]]

