# 封装、解封装与 MTU

## 核心概念

封装就是上一层的数据被下一层加上头部后继续传输。解封装是接收端按相反方向拆开。

例如浏览器访问网站：

```text
HTTP 数据
-> TLS 记录
-> TCP 段
-> IP 包
-> Ethernet 帧
-> 物理信号
```

## 每一层加什么

| 层 | 加入的信息 | 用途 |
|---|---|---|
| L7 应用 | URL、Header、Body | 表达业务请求 |
| L4 传输 | 源端口、目的端口、序列号 | 找进程、保证可靠或低延迟 |
| L3 网络 | 源 IP、目的 IP、TTL/Hop Limit | 跨网段转发 |
| L2 链路 | 源 MAC、目的 MAC、VLAN Tag、FCS | 本链路传输 |

## MTU 是什么

MTU 是一个链路层帧能承载的最大三层负载大小。常见以太网 MTU 是 1500 字节。加了隧道后，外层头部会吃掉一部分空间：

- IPv4 头通常 20 字节。
- TCP 头通常 20 字节，不算选项。
- VXLAN 外层会额外增加 Ethernet/IP/UDP/VXLAN 等头部。
- IPsec、GRE、WireGuard 也会增加额外开销。

## 为什么 MTU 重要

当路径中某段链路 MTU 更小，大包可能需要分片，或被丢弃。现代网络通常依赖 PMTUD（路径 MTU 发现）避免发送过大的包，但如果 ICMP 被错误拦截，就可能出现：

- 小包 ping 通，大文件下载卡住。
- TCP 建连成功，TLS 或 HTTP 大响应失败。
- VPN 内能访问一部分服务，访问复杂页面失败。

## MSS

MSS 是 TCP 每个段中应用数据的最大大小。边界设备常做 MSS Clamping，把 TCP SYN 包里的 MSS 调小，避免经过 VPN/隧道后超过路径 MTU。

## 常见排障命令

```bash
ping -M do -s 1472 8.8.8.8
tracepath example.com
ip link show
```

1472 是 IPv4 下常见测试值：1472 数据 + 8 ICMP + 20 IPv4 = 1500。

## 关联

- [[OSI 与 TCP-IP 分层模型]]
- [[VXLAN 与 EVPN]]
- [[IPsec、WireGuard 与隧道]]
- [[ICMP 与故障诊断]]

