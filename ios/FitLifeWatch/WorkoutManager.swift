import Foundation
import WatchConnectivity
import WatchKit

/// watchOS 운동 세션 관리 + iPhone 동기화
class WorkoutManager: NSObject, ObservableObject {

    // MARK: - Published State

    @Published var isWorkoutActive = false
    @Published var isResting = false
    @Published var restTimeRemaining = 90

    @Published var currentExerciseName = ""
    @Published var currentSetIndex = 0
    @Published var currentWeight: Double = 0
    @Published var currentReps = 0
    @Published var totalSetsInExercise = 3

    @Published var todayRoutineLabel: String?
    @Published var todaySets = 0
    @Published var todayVolume = 0

    // 추천 운동 목록 (iPhone에서 수신)
    @Published var recommendedExercises: [ExerciseItem] = []
    @Published var currentExerciseIndex = 0
    @Published var hasReceivedData = false

    // MARK: - Types

    struct ExerciseItem: Identifiable {
        let id: String
        let name: String
        let weight: Double
        let reps: Int
        let sets: Int
        let equipment: String
    }

    // MARK: - Internal

    private var restTimer: Timer?
    private var completedSets: [[String: Any]] = []

    override init() {
        super.init()
        setupWatchConnectivity()
    }

    // MARK: - Workout Flow

    func startWorkout() {
        isWorkoutActive = true
        currentExerciseIndex = 0
        currentSetIndex = 0
        completedSets = []
        todaySets = 0
        todayVolume = 0

        if recommendedExercises.isEmpty {
            // 추천 데이터 없으면 기본값
            currentExerciseName = "프리 운동"
            currentWeight = 20
            currentReps = 10
            totalSetsInExercise = 3
        } else {
            loadCurrentExercise()
        }

        // 시작 햅틱
        WKInterfaceDevice.current().play(.start)
    }

    func completeSet() {
        if isResting {
            stopRestTimer()
            advanceToNextSet()
            return
        }

        // 완료 기록
        let setData: [String: Any] = [
            "exercise": currentExerciseName,
            "exerciseId": recommendedExercises.indices.contains(currentExerciseIndex)
                ? recommendedExercises[currentExerciseIndex].id : "unknown",
            "weight": currentWeight,
            "reps": currentReps,
            "setIndex": currentSetIndex,
            "timestamp": Date().timeIntervalSince1970,
        ]
        completedSets.append(setData)
        todaySets += 1
        todayVolume += Int(currentWeight) * currentReps

        // 세트 완료 햅틱
        WKInterfaceDevice.current().play(.success)

        // 휴식 타이머 시작
        startRestTimer()
    }

    func skipRest() {
        stopRestTimer()
        advanceToNextSet()
    }

    func endWorkout() {
        stopRestTimer()
        isWorkoutActive = false
        isResting = false

        // 종료 햅틱
        WKInterfaceDevice.current().play(.stop)

        // iPhone에 완료 데이터 전송
        sendWorkoutToiPhone()
    }

    // MARK: - Weight/Reps Adjustment

    func adjustWeight(delta: Double) {
        currentWeight = max(0, currentWeight + delta)
    }

    func adjustReps(delta: Int) {
        currentReps = max(1, currentReps + delta)
    }

    // MARK: - Rest Timer

    private func startRestTimer() {
        isResting = true
        restTimeRemaining = 90

        restTimer = Timer.scheduledTimer(withTimeInterval: 1, repeats: true) { [weak self] _ in
            guard let self else { return }
            if self.restTimeRemaining > 1 {
                self.restTimeRemaining -= 1
                // 10초 남았을 때 알림
                if self.restTimeRemaining == 10 {
                    WKInterfaceDevice.current().play(.notification)
                }
            } else {
                self.restTimeRemaining = 0
                self.stopRestTimer()
                // 휴식 끝 강한 진동
                WKInterfaceDevice.current().play(.directionUp)
                WKInterfaceDevice.current().play(.directionUp)
                self.advanceToNextSet()
            }
        }
    }

    private func stopRestTimer() {
        restTimer?.invalidate()
        restTimer = nil
        isResting = false
    }

    private func advanceToNextSet() {
        currentSetIndex += 1

        if currentSetIndex >= totalSetsInExercise {
            // 다음 운동으로
            currentSetIndex = 0
            currentExerciseIndex += 1

            if currentExerciseIndex < recommendedExercises.count {
                loadCurrentExercise()
                // 운동 전환 햅틱
                WKInterfaceDevice.current().play(.click)
            } else {
                // 모든 운동 완료
                endWorkout()
            }
        }
    }

    private func loadCurrentExercise() {
        guard currentExerciseIndex < recommendedExercises.count else { return }
        let ex = recommendedExercises[currentExerciseIndex]
        currentExerciseName = ex.name
        currentWeight = ex.weight
        currentReps = ex.reps
        totalSetsInExercise = ex.sets
    }

    // MARK: - WatchConnectivity

    private func setupWatchConnectivity() {
        guard WCSession.isSupported() else { return }
        let session = WCSession.default
        session.delegate = self
        session.activate()
    }

    /// iPhone에 운동 데이터 보내기
    private func sendWorkoutToiPhone() {
        guard WCSession.default.activationState == .activated else { return }

        let message: [String: Any] = [
            "action": "workoutCompleted",
            "sets": completedSets,
            "totalSets": todaySets,
            "totalVolume": todayVolume,
            "date": ISO8601DateFormatter().string(from: Date()),
        ]

        // reachable이면 즉시 전송, 아니면 userInfo로 큐잉
        if WCSession.default.isReachable {
            WCSession.default.sendMessage(message, replyHandler: nil)
        } else {
            WCSession.default.transferUserInfo(message)
        }
    }

    /// iPhone에 오늘 운동 데이터 요청
    func requestTodayWorkout() {
        guard WCSession.default.activationState == .activated,
              WCSession.default.isReachable else { return }

        WCSession.default.sendMessage(
            ["action": "requestTodayWorkout"],
            replyHandler: { [weak self] reply in
                DispatchQueue.main.async {
                    self?.handleTodayWorkoutReply(reply)
                }
            }
        )
    }

    private func handleTodayWorkoutReply(_ reply: [String: Any]) {
        if let routineLabel = reply["routineLabel"] as? String {
            todayRoutineLabel = routineLabel
        }

        if let exercises = reply["exercises"] as? [[String: Any]] {
            recommendedExercises = exercises.compactMap { dict in
                guard let id = dict["id"] as? String,
                      let name = dict["name"] as? String else { return nil }
                return ExerciseItem(
                    id: id,
                    name: name,
                    weight: dict["weight"] as? Double ?? 20,
                    reps: dict["reps"] as? Int ?? 10,
                    sets: dict["sets"] as? Int ?? 3,
                    equipment: dict["equipment"] as? String ?? ""
                )
            }
            hasReceivedData = true
        }
    }
}

// MARK: - WCSessionDelegate

extension WorkoutManager: WCSessionDelegate {
    func session(_ session: WCSession, activationDidCompleteWith state: WCSessionActivationState, error: Error?) {
        if state == .activated {
            DispatchQueue.main.async { [weak self] in
                self?.requestTodayWorkout()
            }
        }
    }

    func session(_ session: WCSession, didReceiveMessage message: [String: Any]) {
        DispatchQueue.main.async { [weak self] in
            self?.handleTodayWorkoutReply(message)
        }
    }

    func session(_ session: WCSession, didReceiveUserInfo userInfo: [String: Any] = [:]) {
        DispatchQueue.main.async { [weak self] in
            self?.handleTodayWorkoutReply(userInfo)
        }
    }
}
