# 无线局域网 WLAN 拓扑

## WLAN 组成

企业无线网络通常包括：

- AP：无线接入点。
- WLC/云管平台：集中管理 AP。
- 交换机：给 AP 供电和上联。
- 认证系统：802.1X、Portal、RADIUS。
- VLAN/子网：员工、访客、IoT 分区。

## 集中转发

```mermaid
flowchart LR
  Client[无线终端] --> AP[AP]
  AP -. CAPWAP/隧道 .- WLC[无线控制器]
  WLC --> Core[核心/三层网关]
  Core --> Internet[出口/内网]
```

优点：策略集中。缺点：控制器和隧道路径可能成为瓶颈。

## 本地转发

```mermaid
flowchart LR
  Client[无线终端] --> AP[AP]
  AP --> Switch[接入交换机]
  Switch --> Core[核心/网关]
```

优点：路径短，适合大流量。缺点：分支策略一致性需要设计。

## SSID、VLAN 与安全

常见设计：

| SSID | VLAN | 策略 |
|---|---|---|
| Corp-WiFi | 员工 VLAN | 802.1X，访问内网 |
| Guest-WiFi | 访客 VLAN | Portal，只能上网 |
| IoT-WiFi | IoT VLAN | 只允许访问指定服务 |

## 漫游

无线终端移动时会在 AP 间漫游。设计要考虑：

- AP 覆盖和信道规划。
- 认证切换速度。
- VLAN/网关位置。
- 语音视频业务的时延。

## 常见问题

- 信号强但干扰大。
- AP 上联 VLAN 配错。
- DHCP 地址池不足。
- 访客网未正确隔离。
- 终端漫游导致业务短断。

## 关联

- [[局域网基础拓扑]]
- [[VLAN 与 Trunk]]
- [[DHCP 协议]]
- [[防火墙、ACL 与安全域]]

