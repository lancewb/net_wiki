# IXP、Peering 与 Transit

## 三个概念

| 概念 | 含义 |
|---|---|
| IXP | Internet Exchange Point，多个网络互联交换流量的平台 |
| Peering | 两个网络直接互联并交换彼此和客户流量 |
| Transit | 一个网络向上游购买“到整个互联网”的可达性 |

## Transit

小运营商、企业、内容网络如果没有足够多互联关系，通常向上游 Transit Provider 购买互联网连接。上游会把客户前缀宣告到更广的互联网，也把互联网路由传给客户。

```mermaid
flowchart LR
  Customer[客户 AS] --> Transit[上游 Transit AS] --> Internet[全球互联网]
```

## Peering

两个网络如果互相有大量流量，可以直接互联。这样可能降低成本、减少延迟、提升稳定性。

```mermaid
flowchart LR
  ISP[运营商 AS] --- CDN[CDN/内容 AS]
```

Peering 可以是：

- Public Peering：在 IXP 交换机上互联。
- Private Peering：两方通过专线/交叉连接直连。

## IXP

IXP 通常提供一个二层交换平台，参与者在上面建立 BGP 会话。大型 IXP 也可能提供 Route Server，参与者和 Route Server 建会话后可简化多方 Peering。

## 商业关系影响技术路径

BGP 并不只看技术距离。一个网络可能因为成本、合同、流量比例、地区策略选择某条路径。因此 traceroute 看到的路径可能不是物理最短路径。

## 关联

- [[互联网宏观拓扑]]
- [[自治系统 AS 与 ASN]]
- [[BGP 边界网关协议]]
- [[DNS、GSLB 与 Anycast 调度]]

