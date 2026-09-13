语言: [EN](README.md) | 简中

<p align="center">
  <img src="https://img.shields.io/badge/macOS%20%7C%20Windows%20%7C%20Linux-111827?style=for-the-badge" alt="macOS Windows Linux" />
  <img src="https://img.shields.io/badge/open%20source-AGPL3.0-6d4fd1?style=for-the-badge" alt="AGPL 3.0 license" />
</p>

### 几分钟内做出精致的客户案例展示视频。
Unveil 是我们代理商团队用于展示所构建客户网站与应用的屏幕录制与编辑工具——操作讲解、演示、以及可直接用于作品集的展示视频。
Unveil 是开源项目 [Recordly](https://www.recordly.dev) 的一个分支，为我们自己的工作流程而调整。

> Logo 和产品截图即将推出——本分支不会使用 Recordly 的品牌素材。

---

## Unveil 是什么？

Unveil 是一款桌面应用，用于录制并编辑屏幕内容，内置面向演示视频的动态呈现工具。你不需要再把原始素材交给动效设计师去补缩放、光标润色或样式化背景，Unveil 可以在一个地方完成整套流程——专为精彩展示客户网站而打造。

Unveil 支持：

- **macOS** 14.0+
- **Windows** 10 Build 19041+
- **Linux** 现代发行版

平台说明：

- **macOS** 使用基于 ScreenCaptureKit 的原生捕获辅助程序。
- **Windows** 在支持的系统版本上使用原生 Windows Graphics Capture（WGC）辅助程序，并支持原生 WASAPI 音频。
- **Linux** 通过 Electron 捕获 API 录制。目前 Linux 还不支持隐藏真实光标。

---

# 核心功能

## 自动缩放、光标润色与样式化画面
Unveil 可以根据操作自动强调重点区域，平滑光标运动，添加动态效果，并将最终画面放进带有壁纸、纯色、渐变、模糊、留白和阴影的样式化边框中。

## 动态摄像头气泡叠加
你可以把摄像头素材作为气泡叠加层加入画面，使用预设位置或自定义坐标摆放，支持镜像、阴影和圆角调节，也可以让它跟随缩放变化，保证动态镜头里整体视觉更协调。

## 为演示设计的时间线编辑
使用拖拽式时间线工具处理缩放、裁剪、变速区域、注释、额外音频区域以及裁切感知编辑，并将工作保存为 `.unveil` 项目文件（旧版 `.recordly` 文件仍可打开），之后随时回来继续编辑。

## 扩展与市场

> [!NOTE]
> 当前代码库中扩展系统处于禁用状态（应用内的扩展页面仅显示占位说明）。以下描述反映的是 `EXTENSIONS.md` 中记录的设计，而非当前实际运行行为。

Recordly 的设计包含一个社区驱动的扩展系统，可用于添加光标点击音效、设备边框、浏览器模拟外壳、壁纸、渲染钩子、设置面板等功能。Unveil 继承了同样的架构，但目前不会加载或运行扩展。

---

## 全部功能

### 录制

- 录制整个显示器或单个应用窗口
- 录制完成后直接进入编辑器
- 录制麦克风音频和系统音频
- 在支持的平台上使用原生捕获后端
- 从保存的 `.unveil` 项目文件继续编辑
- 可在应用中打开已有录像或已有项目文件

### 时间线与编辑

- 拖拽式时间线编辑
- 裁掉不需要的片段
- 添加手动缩放区域
- 根据光标活动生成自动缩放建议
- 添加加速和减速区域
- 添加文本、图片和图形注释
- 在时间线上添加额外音频区域
- 裁切录制画面
- 保存并重新打开项目，保留编辑状态

### 光标控制

- 显示或隐藏渲染后的光标叠加层
- 调整光标大小
- 光标平滑
- 光标运动模糊
- 点击弹跳效果
- 光标摆动效果
- 光标循环模式，方便导出更自然的循环片段
- 使用 macOS 风格的渲染光标素材

### 摄像头叠加

- 启用或禁用摄像头叠加素材
- 上传、替换或移除摄像头素材
- 镜像摄像头画面
- 调整尺寸
- 使用预设位置或自定义 X/Y 坐标
- 调整边距
- 调整圆角程度
- 调整阴影强度
- 可选的缩放联动摄像头缩放效果

### 画面样式与背景

- 内置壁纸
- 运行时自动发现 wallpapers 目录中的壁纸
- 上传自定义背景图片
- 纯色背景
- 渐变背景
- 画面留白
- 圆角
- 背景模糊
- 投影阴影
- 最终画面的宽高比预设

### 导出

- MP4 导出
- GIF 导出
- 导出质量选择
- GIF 帧率选择
- GIF 循环开关
- GIF 尺寸预设
- 宽高比和输出尺寸控制
- 在系统文件管理器中定位导出文件

### 工作流与易用性

- 可自定义键盘快捷键
- 应用内快捷键说明
- 在编辑器中直接打开反馈和问题链接
- 编辑器偏好设置持久化
- 导出后更快恢复预览

---

# 截图

Unveil 实际界面的截图将在后续补充——此前这里展示的是 Recordly 自己的截图，并不属于本分支。

---

# 安装

## 下载构建版本

Unveil 目前还没有自己发布的构建版本——请按下方说明从源码构建。（原始 Recordly 项目的预构建版本见 [github.com/webadderallorg/Recordly/releases](https://github.com/webadderallorg/Recordly/releases)，但那是未经修改的上游构建，并非 Unveil。）

---

## 从源码构建

### 前置依赖

**macOS：** 安装 Xcode Command Line Tools（`xcode-select --install`）。

**Linux（Ubuntu / Debian）：**

```bash
sudo apt install build-essential cmake libx11-dev libxtst-dev libxrandr-dev libxt-dev
```

**Windows：** 安装 Visual Studio 2022（或 Build Tools），并勾选 C++ 工作负载和 CMake。

### 步骤

```bash
git clone https://github.com/innovatewithkishlay/Recordly.git unveil
cd unveil
npm install
npm run dev
```

如果需要打包构建：

```bash
npm run build
```

也可以使用平台专用构建命令：

- `npm run build:mac`
- `npm run build:win`
- `npm run build:linux`

---

## macOS：“App cannot be opened”

本地构建的应用可能会被 macOS 隔离。

可以用以下命令移除隔离标记：

```bash
xattr -rd com.apple.quarantine /Applications/Unveil.app
```

---

# 系统要求

| 平台 | 最低版本 | 说明 |
|---|---|---|
| **macOS** | macOS 14.0 (Sonoma) | 使用 ScreenCaptureKit 捕获音频和麦克风所必需。 |
| **Windows** | Windows 10 20H1（Build 19041，2020 年 5 月） | 原生 Windows Graphics Capture（WGC）辅助程序及最佳光标隐藏行为所必需。 |
| **Linux** | 任意现代发行版 | 通过 Electron 捕获录制。系统音频通常需要 PipeWire。 |

> [!IMPORTANT]
> 在 Windows 19041 之前的版本上，录制仍可能通过回退捕获方式工作，但真实系统光标可能仍会出现在视频中。

---

# 使用方法

## 录制

1. 启动 Unveil。
2. 选择屏幕或窗口。
3. 选择麦克风和系统音频选项。
4. 开始录制。
5. 停止录制后进入编辑器。

## 编辑

在编辑器中，你可以：

- 添加裁剪、缩放、变速区域和注释
- 调整光标行为和预览音量
- 使用壁纸、纯色、渐变、模糊、留白和圆角来美化画面
- 添加或调整摄像头叠加素材
- 添加额外音频区域
- 裁切画面并选择宽高比

你可以随时将工作保存为 `.unveil` 项目。

## 导出

支持以下导出格式：

- **MP4**，适合常规视频输出
- **GIF**，适合轻量分享和循环片段

你可以在导出前调整格式相关设置，例如质量、GIF 帧率、GIF 循环方式和输出尺寸。

---

# 限制

### 光标捕获

Unveil 会在录制画面上渲染一个经过美化的光标叠加层，但真实系统光标是否能被隐藏仍取决于平台能力。

**macOS**
- ScreenCaptureKit 可以较干净地排除真实光标。

**Windows**
- 最佳效果需要 Windows 10 Build 19041+ 和原生捕获辅助程序。
- 较旧版本会回退到 Electron 捕获，因此真实光标可能仍会显示。

**Linux**
- Electron 桌面捕获目前不支持隐藏真实光标。
- 如果同时启用渲染光标叠加，导出中可能会同时看到真实光标和样式化光标。

### 系统音频

系统音频支持因平台而异。

**Windows**
- 原生 WASAPI 支持

**Linux**
- 通常需要 PipeWire

**macOS**
- 需要 macOS 14.0+ 和基于 ScreenCaptureKit 的工作流

---

# 工作原理

Unveil 将平台相关的捕获层与基于渲染器的编辑、导出流程结合在一起。

**捕获**
- Electron 负责录制流程和应用级控制
- macOS 使用原生 ScreenCaptureKit 辅助程序
- Windows 在可用时使用原生 Windows Graphics Capture（WGC）辅助程序和原生音频辅助程序

**编辑**
- 时间线区域定义缩放、裁剪、变速、音频叠加和注释
- 光标和摄像头样式都保存在编辑器状态中

**渲染**
- 场景合成由 **PixiJS** 负责

**导出**
- 预览使用的同一套场景逻辑会被用于导出 MP4 或 GIF

**项目**
- `.unveil` 文件会保存源媒体路径和编辑器状态，方便后续继续编辑

---

# 贡献

欢迎贡献。

特别需要帮助的方向包括：

- Linux 录制与光标行为改进
- 导出性能与稳定性优化
- UI 和 UX 打磨
- 本地化工作
- 更多编辑工具与工作流优化

请尽量让 Pull Request 保持聚焦，测试录制、编辑、导出流程，并避免无关重构。

请参阅 `CONTRIBUTING.md` 了解具体指南。

---

# 社区

本分支的问题反馈和功能建议：

https://github.com/innovatewithkishlay/Recordly/issues

---

# 支持者名单（上游 Recordly 项目）

以下名单感谢的是本分支所基于的原始 Recordly 项目的支持者，而非 Unveil 本身。

[![Ko-Fi](https://img.shields.io/badge/Ko--fi-F16061?style=for-the-badge&logo=ko-fi&logoColor=white)](https://ko-fi.com/webadderall)

- Tadees
- buildwithfur
- Tobias
- Anonymous Supporter
- Tandava Appadoo
- Digitalfastmind
- Roberto Marcelino
- Rajan RK
- Francesco
- Erwan
- Anonymous supporter

---

# 许可证

Unveil 是 Recordly 的一个分支，与 Recordly 一样基于 **AGPL 3.0** 发布。

---

# 致谢

## 鸣谢

Unveil 构建于开源项目 [Recordly](https://www.recordly.dev) 之上，并为我们代理商团队的客户展示工作流进行了调整。

Recordly 本身最初是从 [OpenScreen](https://github.com/siddharthvaddem/openscreen) 分叉而来，之后已逐步演变为一个不同的项目。

Recordly 创建者  
[@webadderall](https://x.com/webadderall)

---
