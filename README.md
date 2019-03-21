## 简单基于TCP的RPC实现

### 环境要求

- node >= 9

### 启动方式

```
node testS.js // 模拟server 监听
```

```
node testC.js // 模拟客户端调用
```

### 实现功能点

- 二进制协议的基本解析
- service方法注册