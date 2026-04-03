import Foundation
import WatchConnectivity
import Combine

/// watchOS 운동 세션 관리 + iPhone 동기화
class WorkoutManager: NSObject, ObservableObject {
    // MARK: - Published state
    @Published var isWorkoutActive = false
    @Published var isResting = false
    @Published var restTimeRemaining = 90

    @Published var currentExerciseName = ""
    @Published var currentSetIndex = 0
    @Published var currentWeight: Double = 0
    @Published var currentReps = 0

    @Published var todayRoutine: String?
    @Published var todaySets = 0
    @Published var todayVolume = 0

    // MARK: - Internal
    private var restTimer: Timer?
    private var exercises: [[String: Any]] = []
    private var currentExerciseIndex = 0
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

        // Default exercise if no data from iPhone
        if exercises.isEmpty {
            currentExerciseName = "운동"
            currentWeight = 20
            currentReps = 10
        } else {
            loadCurrentExercise()
        }
    }

    func completeSet() {
        if isResting {
            stopRestTimer()
            advanceToNextSet()
            return
        }

        // Record completed set
        let setData: [String: Any] = [
            "exercise": currentExerciseName,
            "weight": currentWeight,
            "reps": currentReps,
            "setIndex": currentSetIndex,
            "timestamp": Date().timeIntervalSince1970,
        ]
        completedSets.append(setData)
        todaySets += 1
        todayVolume += Int(currentWeight) * currentReps

        // Start rest timer
        startRestTimer()
    }

    func endWorkout() {
        stopRestTimer()
        isWorkoutActive = false
        isResting = false

        // Send completed workout data to iPhone
        sendWorkoutToiPhone()
    }

    // MARK: - Rest Timer

    private func startRestTimer() {
        isResting = true
        restTimeRemaining = 90

        restTimer = Timer.scheduledTimer(withTimeInterval: 1, repeats: true) { [weak self] _ in
            guard let self else { return }
            if self.restTimeRemaining > 0 {
                self.restTimeRemaining -= 1
            } else {
                self.stopRestTimer()
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
        // 3 sets per exercise, then move to next exercise
        if currentSetIndex >= 3 {
            currentSetIndex = 0
            currentExerciseIndex += 1
            if currentExerciseIndex < exercises.count {
                loadCurrentExercise()
            } else {
                endWorkout()
            }
        }
    }

    private func loadCurrentExercise() {
        guard currentExerciseIndex < exercises.count else { return }
        let ex = exercises[currentExerciseIndex]
        currentExerciseName = ex["name"] as? String ?? "운동"
        currentWeight = ex["weight"] as? Double ?? 20
        currentReps = ex["reps"] as? Int ?? 10
    }

    // MARK: - WatchConnectivity

    private func setupWatchConnectivity() {
        guard WCSession.isSupported() else { return }
        let session = WCSession.default
        session.delegate = self
        session.activate()
    }

    private func sendWorkoutToiPhone() {
        guard WCSession.default.isReachable else { return }

        let message: [String: Any] = [
            "action": "workoutCompleted",
            "sets": completedSets,
            "totalSets": todaySets,
            "totalVolume": todayVolume,
            "timestamp": Date().timeIntervalSince1970,
        ]

        WCSession.default.sendMessage(message, replyHandler: nil)
    }
}

// MARK: - WCSessionDelegate
extension WorkoutManager: WCSessionDelegate {
    func session(
        _ session: WCSession,
        activationDidCompleteWith activationState: WCSessionActivationState,
        error: Error?
    ) {
        // Activation complete
    }

    func session(_ session: WCSession, didReceiveMessage message: [String: Any]) {
        DispatchQueue.main.async { [weak self] in
            guard let self else { return }

            if let routine = message["todayRoutine"] as? String {
                self.todayRoutine = routine
            }

            if let exerciseList = message["exercises"] as? [[String: Any]] {
                self.exercises = exerciseList
            }
        }
    }
}
