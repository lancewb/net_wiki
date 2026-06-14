# IPv4 协议

## IPv4 做什么

IPv4 是互联网最广泛使用的网络层协议。它提供无连接、尽力而为的包转发。

## 关键字段

| 字段 | 作用 |
|---|---|
| 源 IP | 发送方地址 |
| 目的 IP | 接收方地址 |
| TTL | 每过一跳减一，防止无限循环 |
| Protocol | 上层协议，例如 TCP/UDP/ICMP |
| Identification/Fragment | 分片相关 |
| Header Checksum | 头部校验 |

## 尽力而为

IPv4 不保证：

- 一定送达。
- 按顺序送达。
- 不重复。
- 不丢包。

可靠性通常由 TCP 或应用层实现。

## TTL

TTL 每经过一个三层设备减一。减到 0 时路由器丢弃包并通常返回 ICMP Time Exceeded。traceroute 就利用这一点观察路径。

## 分片

如果包大于下一段链路 MTU，IPv4 可能分片。现代网络更推荐通过 PMTUD 和 MSS 调整避免分片。

## 私有地址和 NAT

IPv4 地址空间不足导致私有地址和 NAT 大规模使用。理解 IPv4 几乎必须理解 [[NAT、PAT 与 CGNAT]]。

## 关联

- [[IP 地址、子网与 CIDR]]
- [[ICMP 与故障诊断]]
- [[NAT、PAT 与 CGNAT]]
- [[IPv6 协议]]

