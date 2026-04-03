import Foundation
import WatchConnectivity
import Capacitor

/// iPhone 측 WatchConnectivity 매니저
/// Watch가 오늘 운동 데이터를 요청하면 웹뷰에서 가져와서 전송
/// Watch에서 완료 데이터가 오면 웹뷰에 전달
class WatchConnectivityManager: NSObject, WCSessionDelegate {

    static let shared = WatchConnectivityManager()
    weak var bridge: CAPBridge?

    private override init() {
        super.init()
    }

    func setup(bridge: CAPBridge) {
        self.bridge = bridge
        guard WCSession.isSupported() else { return }
        WCSession.default.delegate = self
        WCSession.default.activate()
    }

    // MARK: - WCSessionDelegate

    func session(_ session: WCSession, activationDidCompleteWith state: WCSessionActivationState, error: Error?) {
        print("[WatchConnectivity] activated: \(state.rawValue)")
    }

    func sessionDidBecomeInactive(_ session: WCSession) {}
    func sessionDidDeactivate(_ session: WCSession) {
        WCSession.default.activate()
    }

    /// Watch에서 메시지 수신
    func session(_ session: WCSession, didReceiveMessage message: [String: Any], replyHandler: @escaping ([String: Any]) -> Void) {
        guard let action = message["action"] as? String else {
            replyHandler([:])
            return
        }

        switch action {
        case "requestTodayWorkout":
            // 웹뷰에서 오늘 추천 운동 데이터 가져오기
            fetchTodayWorkoutFromWebView { reply in
                replyHandler(reply)
            }

        default:
            replyHandler([:])
        }
    }

    /// Watch에서 완료 데이터 수신 (비동기)
    func session(_ session: WCSession, didReceiveMessage message: [String: Any]) {
        guard let action = message["action"] as? String, action == "workoutCompleted" else { return }
        // 웹뷰에 완료 데이터 전달
        sendToWebView(message)
    }

    func session(_ session: WCSession, didReceiveUserInfo userInfo: [String: Any] = [:]) {
        guard let action = userInfo["action"] as? String, action == "workoutCompleted" else { return }
        sendToWebView(userInfo)
    }

    // MARK: - Web View Communication

    /// 웹뷰에서 localStorage의 오늘 추천 운동 읽기
    private func fetchTodayWorkoutFromWebView(completion: @escaping ([String: Any]) -> Void) {
        guard let bridge else {
            completion([:])
            return
        }

        DispatchQueue.main.async {
            bridge.webView?.evaluateJavaScript("""
                (function() {
                    try {
                        var routine = JSON.parse(localStorage.getItem('fitlife_routine') || '{}');
                        var workouts = JSON.parse(localStorage.getItem('fitlife_workouts') || '[]');
                        var exercises = JSON.parse(localStorage.getItem('fitlife_exercises_cache') || '[]');
                        return JSON.stringify({
                            routineLabel: routine.splitType || '3split',
                            exercises: exercises
                        });
                    } catch(e) {
                        return '{}';
                    }
                })()
            """) { result, _ in
                guard let jsonStr = result as? String,
                      let data = jsonStr.data(using: .utf8),
                      let dict = try? JSONSerialization.jsonObject(with: data) as? [String: Any] else {
                    completion([:])
                    return
                }
                completion(dict)
            }
        }
    }

    /// 웹뷰에 Watch 완료 데이터 전달
    private func sendToWebView(_ data: [String: Any]) {
        guard let bridge else { return }

        if let jsonData = try? JSONSerialization.data(withJSONObject: data),
           let jsonStr = String(data: jsonData, encoding: .utf8) {
            DispatchQueue.main.async {
                bridge.webView?.evaluateJavaScript("""
                    window.dispatchEvent(new CustomEvent('watchWorkoutCompleted', { detail: \(jsonStr) }));
                """)
            }
        }
    }

    // MARK: - Send to Watch

    /// iPhone에서 Watch로 오늘 추천 운동 푸시
    func pushTodayWorkoutToWatch(exercises: [[String: Any]], routineLabel: String) {
        guard WCSession.default.activationState == .activated,
              WCSession.default.isPaired,
              WCSession.default.isWatchAppInstalled else { return }

        let message: [String: Any] = [
            "routineLabel": routineLabel,
            "exercises": exercises,
        ]

        if WCSession.default.isReachable {
            WCSession.default.sendMessage(message, replyHandler: nil)
        } else {
            WCSession.default.transferUserInfo(message)
        }
    }
}
