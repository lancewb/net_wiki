# ARP 与 IPv6 NDP

## ARP 做什么

ARP 用于 IPv4 网络中把 IP 地址解析成 MAC 地址。

主机要发给 `192.168.1.1`，但以太网需要 MAC，于是发送：

```text
Who has 192.168.1.1? Tell 192.168.1.10
```

网关回应自己的 MAC。

## ARP 只在本地二层广播域内工作

ARP 不会跨路由器传播。跨网段通信时，主机 ARP 的是默认网关 MAC，而不是远端服务器 MAC。

## ARP 表

主机会缓存 IP 到 MAC 的映射：

```text
192.168.1.1 -> 00:11:22:33:44:55
```

## Proxy ARP

某些设备可以代替其他主机回应 ARP，叫 Proxy ARP。它能解决一些特殊场景，但也可能隐藏地址规划问题。

## IPv6 NDP

IPv6 不用 ARP，而用 NDP（Neighbor Discovery Protocol）。NDP 基于 ICMPv6，负责：

- 邻居地址解析。
- 路由器发现。
- 前缀发现。
- 地址重复检测 DAD。
- SLAAC 自动地址配置。

## 安全问题

- ARP 欺骗可导致中间人攻击。
- IPv6 RA 欺骗可让终端使用恶意网关。
- 防护方式包括 DHCP Snooping、Dynamic ARP Inspection、RA Guard 等。

## 关联

- [[Ethernet 以太网]]
- [[IPv4 协议]]
- [[IPv6 协议]]
- [[默认网关与下一跳]]

