# Ethernet 以太网

## 以太网负责什么

以太网工作在链路层，负责同一链路或二层广播域内的帧传输。

## 以太网帧关键字段

| 字段 | 作用 |
|---|---|
| 目的 MAC | 下一跳或本地目标 |
| 源 MAC | 当前发送方 |
| EtherType | 上层协议类型，例如 IPv4/IPv6/ARP |
| Payload | 上层数据 |
| FCS | 帧校验 |

## MAC 地址

MAC 地址用于二层转发。交换机通过学习源 MAC，把 MAC 与端口关联。

```text
MAC 表：
AA:AA:AA:AA:AA:AA -> port 1
BB:BB:BB:BB:BB:BB -> port 2
```

## 广播、组播、单播

- 单播：发给一个 MAC。
- 广播：发给 `ff:ff:ff:ff:ff:ff`。
- 组播：发给一组接收者。

ARP 请求就是典型广播。

## VLAN Tag

802.1Q VLAN Tag 把 VLAN ID 放进以太网帧中，让 Trunk 链路承载多个 VLAN。

## 关联

- [[二层网络与三层网络]]
- [[VLAN 与 Trunk]]
- [[ARP 与 IPv6 NDP]]
- [[STP 与二层环路]]

