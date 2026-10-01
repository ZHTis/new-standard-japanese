import SwiftUI
import WebKit
import AVFoundation

struct StudyWebView: UIViewRepresentable {
    func makeCoordinator() -> Coordinator { Coordinator() }

    func makeUIView(context: Context) -> WKWebView {
        let configuration = WKWebViewConfiguration()
        configuration.websiteDataStore = .default()
        configuration.allowsInlineMediaPlayback = true
        configuration.mediaTypesRequiringUserActionForPlayback = []
        configuration.userContentController.add(context.coordinator, name: "hiyori")
        // Native storage survives app updates even if the bundle's file URL changes.
        let saved = UserDefaults.standard.string(forKey: "hiyori.progress") ?? "null"
        configuration.userContentController.addUserScript(WKUserScript(
            source: "window.hiyoriSavedState = \(saved);",
            injectionTime: .atDocumentStart, forMainFrameOnly: true
        ))
        let web = WKWebView(frame: .zero, configuration: configuration)
        web.isOpaque = false
        web.backgroundColor = UIColor.white
        web.navigationDelegate = context.coordinator
        web.scrollView.contentInsetAdjustmentBehavior = .never
        context.coordinator.webView = web
        if let index = Bundle.main.url(forResource: "index", withExtension: "html", subdirectory: "Resources") {
            web.loadFileURL(index, allowingReadAccessTo: index.deletingLastPathComponent())
        } else {
            web.loadHTMLString("<h1>课程文件缺失</h1><p>请在 Mac 项目目录运行 npm run build:ipad 后重新安装。</p>", baseURL: nil)
        }
        return web
    }

    func updateUIView(_ uiView: WKWebView, context: Context) {}

    static func dismantleUIView(_ uiView: WKWebView, coordinator: Coordinator) {
        coordinator.cancel()
        uiView.configuration.userContentController.removeScriptMessageHandler(forName: "hiyori")
    }

    final class Coordinator: NSObject, WKScriptMessageHandler, WKNavigationDelegate, AVAudioRecorderDelegate, AVSpeechSynthesizerDelegate {
        weak var webView: WKWebView?
        private let speech = AVSpeechSynthesizer()
        private var recorder: AVAudioRecorder?
        private var recordingURL: URL?
        private var ticket: Int?
        private var timeout: Timer?

        override init() {
            super.init()
            speech.delegate = self
            // Remove only this app's recordings left by a previous forced exit.
            let temporary = FileManager.default.temporaryDirectory
            if let files = try? FileManager.default.contentsOfDirectory(at: temporary, includingPropertiesForKeys: nil) {
                for file in files where file.lastPathComponent.hasPrefix("hiyori-") && file.pathExtension == "m4a" {
                    try? FileManager.default.removeItem(at: file)
                }
            }
            NotificationCenter.default.addObserver(self, selector: #selector(suspend), name: UIApplication.didEnterBackgroundNotification, object: nil)
            NotificationCenter.default.addObserver(self, selector: #selector(interruption), name: AVAudioSession.interruptionNotification, object: nil)
        }

        deinit { NotificationCenter.default.removeObserver(self) }

        func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
            guard message.frameInfo.isMainFrame,
                  let url = message.frameInfo.request.url, isBundled(url),
                  let body = message.body as? [String: Any],
                  let action = body["action"] as? String else { return }
            switch action {
            case "save":
                if let value = body["value"] as? [String: Any],
                   let data = try? JSONSerialization.data(withJSONObject: value), data.count < 2_000_000,
                   let json = String(data: data, encoding: .utf8) {
                    UserDefaults.standard.set(json, forKey: "hiyori.progress")
                }
            case "speak":
                guard recorder == nil, ticket == nil else { return }
                guard let text = body["text"] as? String, text.count < 4000 else { return }
                speak(text, rate: (body["rate"] as? NSNumber)?.floatValue ?? 0.85)
            case "record":
                guard let id = body["ticket"] as? Int else { return }
                requestRecording(id)
            case "stopRecording":
                guard let id = body["ticket"] as? Int, id == ticket else { return }
                finishRecording()
            case "cancel": cancel()
            default: break
            }
        }

        private func isBundled(_ url: URL) -> Bool {
            url.isFileURL && url.standardizedFileURL.path.hasPrefix(Bundle.main.bundleURL.path + "/")
        }

        func webView(_ webView: WKWebView, decidePolicyFor navigationAction: WKNavigationAction, decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
            guard let url = navigationAction.request.url else { decisionHandler(.cancel); return }
            if isBundled(url) { decisionHandler(.allow); return }
            // Reference links open outside the privileged app webview, only on tap.
            if navigationAction.navigationType == .linkActivated && ["https", "http"].contains(url.scheme ?? "") {
                UIApplication.shared.open(url)
            }
            decisionHandler(.cancel)
        }

        private func emit(_ event: [String: Any]) {
            guard let data = try? JSONSerialization.data(withJSONObject: event),
                  let json = String(data: data, encoding: .utf8) else { return }
            webView?.evaluateJavaScript("window.hiyoriNativeEvent && window.hiyoriNativeEvent(\(json));", completionHandler: nil)
        }

        func speechSynthesizer(_ synthesizer: AVSpeechSynthesizer, didStart utterance: AVSpeechUtterance) {
            emit(["type": "speechStarted", "text": utterance.speechString])
        }

        private func speak(_ text: String, rate: Float) {
            speech.stopSpeaking(at: .immediate)
            guard let voice = AVSpeechSynthesisVoice(language: "ja-JP") else {
                emit(["type": "message", "message": "请在 iPad 系统设置中下载日语语音后重试。"])
                return
            }
            do {
                try AVAudioSession.sharedInstance().setCategory(.playback, mode: .spokenAudio)
                try AVAudioSession.sharedInstance().setActive(true)
                let utterance = AVSpeechUtterance(string: text)
                utterance.voice = voice
                utterance.rate = min(0.55, max(0.25, AVSpeechUtteranceDefaultSpeechRate * rate))
                speech.speak(utterance)
            } catch { emit(["type": "message", "message": "无法播放声音，请检查音频输出后重试。"]) }
        }

        private func requestRecording(_ id: Int) {
            cancel()
            ticket = id
            AVAudioSession.sharedInstance().requestRecordPermission { [weak self] granted in
                DispatchQueue.main.async {
                    guard let self = self, self.ticket == id else { return }
                    if granted { self.beginRecording(id) }
                    else { self.fail(id, "麦克风未获授权。可前往 iPad 设置允许新标准日本语使用麦克风，或跳过口语。") }
                }
            }
        }

        private func beginRecording(_ id: Int) {
            do {
                let audio = AVAudioSession.sharedInstance()
                try audio.setCategory(.playAndRecord, mode: .default, options: [.defaultToSpeaker])
                try audio.setActive(true)
                let url = FileManager.default.temporaryDirectory.appendingPathComponent("hiyori-\(UUID().uuidString).m4a")
                recordingURL = url
                let recording = try AVAudioRecorder(url: url, settings: [
                    AVFormatIDKey: kAudioFormatMPEG4AAC,
                    AVSampleRateKey: 44100,
                    AVNumberOfChannelsKey: 1,
                    AVEncoderAudioQualityKey: AVAudioQuality.high.rawValue
                ])
                recorder = recording
                recording.delegate = self
                guard recording.record() else { fail(id, "录音未能开始，请重试。"); return }
                emit(["type": "recording", "ticket": id])
                timeout = Timer.scheduledTimer(withTimeInterval: 30, repeats: false) { [weak self] _ in self?.finishRecording() }
            } catch { fail(id, "无法启动录音，请检查麦克风或音频设备。") }
        }

        private func finishRecording() {
            guard let id = ticket, let url = recordingURL else { return }
            timeout?.invalidate(); timeout = nil
            recorder?.delegate = nil
            recorder?.stop(); recorder = nil
            ticket = nil
            do {
                let data = try Data(contentsOf: url)
                guard !data.isEmpty else { fail(id, "没有录到声音，请重试。"); return }
                try AVAudioSession.sharedInstance().setCategory(.playback, mode: .default)
                emit(["type": "recorded", "ticket": id, "audio": "data:audio/mp4;base64," + data.base64EncodedString()])
            } catch { emit(["type": "error", "ticket": id, "message": "录音无法回放，请重新录制。"]) }
            removeRecording()
        }

        private func fail(_ id: Int, _ message: String) {
            cancel()
            emit(["type": "error", "ticket": id, "message": message])
        }

        private func removeRecording() {
            if let url = recordingURL { try? FileManager.default.removeItem(at: url) }
            recordingURL = nil
        }

        func cancel() {
            ticket = nil
            timeout?.invalidate(); timeout = nil
            recorder?.delegate = nil
            recorder?.stop(); recorder = nil
            speech.stopSpeaking(at: .immediate)
            removeRecording()
            try? AVAudioSession.sharedInstance().setActive(false, options: .notifyOthersOnDeactivation)
        }

        @objc private func suspend() { cancel() }
        @objc private func interruption(_ notification: Notification) {
            guard let type = notification.userInfo?[AVAudioSessionInterruptionTypeKey] as? UInt,
                  type == AVAudioSession.InterruptionType.began.rawValue else { return }
            if let id = ticket { fail(id, "录音被系统中断，请重新录制。") }
            else { cancel() }
        }

        func audioRecorderEncodeErrorDidOccur(_ recorder: AVAudioRecorder, error: Error?) {
            if let id = ticket { fail(id, "录音中断，请重新录制。") }
        }
    }
}
