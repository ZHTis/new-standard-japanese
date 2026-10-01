# 新标准日本语 · iPad 自用安装版

此工程把现有学习界面、80 课原创核心练习打包到 iPad App 内。使用 SwiftUI + WKWebView，日语朗读和录音通过系统原生接口完成。目标为 iPadOS 16 及以上。不依赖 localhost、不需要 Mac 常开、不需要上架 App Store。

## 当前状态

工程与离线资源已经准备好；本机未安装完整版 Xcode，因此尚未进行 iOS 编译、签名、模拟器或真机测试。这不是已经签名、点开即装的 IPA 文件。课程仍为之前的基础版，并非教材全部内容。

## 第一次安装

1. 在 Mac 的 App Store 安装 Apple 的 **Xcode**。首次打开完成组件安装，并按提示安装 iOS/iPadOS 开发支持。需要由你自行接受 Apple 的协议。
2. 双击 `Hiyori.xcodeproj` 打开工程。初始版本已包含离线资源，无需安装 JavaScript 依赖。
3. 在 **Xcode → Settings → Accounts** 登录你自己的 Apple 账号。账号操作由你本人完成，不需要把密码提供给助手。
4. 点工程中的 **Hiyori target → Signing & Capabilities**，保持 **Automatically manage signing**，在 **Team** 选择自己的 **Personal Team**。如果默认 Bundle Identifier 被占用，换成自己唯一的名称，例如 `com.yourname.hiyori`。
5. 用数据线连接 iPad 和 Mac，按设备提示信任电脑。在 iPad 上按 Xcode 提示启用开发者模式并重启。不同系统版本的设置位置以设备提示为准。
6. Xcode 顶部运行目标选择你的 iPad，点击 **▶ Run**。首次签名可能需要联网。安装后主屏幕会出现“新标准日本语”。
7. 第一次跟读录音时，允许“新标准日本语”使用麦克风。先联网试听一次日语；如果设备没有可用的日语声音，在系统设置中下载日语语音。之后关闭网络测试课程、朗读、录音与回放。

## 免费账号的限制

免费 Personal Team 可以在自己的设备上测试 App，但描述文件有 **7 天期限**。到期后通常需要连接 Mac，在 Xcode 中重新运行安装。保持相同 Bundle Identifier 和签名 Team，优先直接覆盖安装；**不要先删除 App**，删除 App 会丢失本地进度。

如果你不能接受每 7 天维护一次，免费原生自签并不适合作为长期省心方案，需要另选安装/运行方式。无需为了本工程提交 App Store 审核。

## 数据与离线

- 课程、样式和界面均随 App 内置，不从网络加载字体或程序。
- 进度存在 iPad 的 App 数据中，同时保存到原生 UserDefaults；不自动从 Mac 浏览器迁移，也不跨设备同步。
- 录音临时写入 App 的缓存目录，停止后读入内存并删除临时文件；退出练习或进入后台停止录音和朗读，不上传录音。强制终止 App 时操作系统会保留尚未清理的临时目录，重启时清理该 App 的残留录音。
- 系统日语声音是否完全离线可用取决于设备已安装的语音，请在飞行模式下实际试听确认。

## 修改课程后更新

在 Mac 项目根目录运行 `npm run build:ipad`，然后回到 Xcode 重新 Run。该命令同步 `src` 中的界面和课次，移除外部字体加载，将 JavaScript 合并为本地脚本。

## 验收清单

- iPad 横屏、竖屏和分屏布局能使用。
- 飞行模式下打开全部四册，完成一课。
- 正常与慢速日语朗读都能播放。
- 麦克风允许与拒绝后均有正确反馈；录音能停止、回放和重录。
- 录音中退出、切到后台或发生音频中断，录音会停止。
- 关闭 App 再打开，课次进度和错题仍在。
- 覆盖安装更新后进度仍在。

Apple 官方资料：[账号类型与免费签名限制](https://developer.apple.com/support/compare-memberships/)、[在设备上运行 App](https://developer.apple.com/documentation/Xcode/running-your-app-on-simulated-or-physical-devices)。
