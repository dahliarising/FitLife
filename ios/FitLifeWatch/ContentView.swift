import SwiftUI

struct ContentView: View {
    @EnvironmentObject var workoutManager: WorkoutManager

    var body: some View {
        NavigationStack {
            if workoutManager.isWorkoutActive {
                ActiveWorkoutView()
            } else {
                StartView()
            }
        }
    }
}

// MARK: - Start View
struct StartView: View {
    @EnvironmentObject var workoutManager: WorkoutManager

    var body: some View {
        ScrollView {
            VStack(spacing: 16) {
                // Today's routine
                VStack(spacing: 8) {
                    Image(systemName: "figure.strengthtraining.traditional")
                        .font(.system(size: 40))
                        .foregroundColor(.indigo)

                    Text("FitLife")
                        .font(.headline)

                    if let routine = workoutManager.todayRoutine {
                        Text(routine)
                            .font(.caption)
                            .foregroundColor(.secondary)
                    } else {
                        Text("오늘의 운동")
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }
                }
                .padding(.top, 8)

                // Start workout button
                Button(action: { workoutManager.startWorkout() }) {
                    Label("운동 시작", systemImage: "play.fill")
                        .frame(maxWidth: .infinity)
                }
                .buttonStyle(.borderedProminent)
                .tint(.indigo)

                // Quick stats
                if workoutManager.todaySets > 0 {
                    HStack(spacing: 16) {
                        StatBadge(value: "\(workoutManager.todaySets)", label: "세트")
                        StatBadge(value: "\(workoutManager.todayVolume)kg", label: "볼륨")
                    }
                }
            }
            .padding()
        }
        .navigationTitle("FitLife")
    }
}

// MARK: - Active Workout View
struct ActiveWorkoutView: View {
    @EnvironmentObject var workoutManager: WorkoutManager

    var body: some View {
        ScrollView {
            VStack(spacing: 12) {
                // Current exercise
                Text(workoutManager.currentExerciseName)
                    .font(.headline)

                // Set info
                Text("세트 \(workoutManager.currentSetIndex + 1)")
                    .font(.caption)
                    .foregroundColor(.secondary)

                // Weight & Reps
                HStack(spacing: 20) {
                    VStack {
                        Text("\(workoutManager.currentWeight, specifier: "%.1f")")
                            .font(.system(size: 32, weight: .bold, design: .rounded))
                            .foregroundColor(.indigo)
                        Text("kg")
                            .font(.caption2)
                            .foregroundColor(.secondary)
                    }

                    Text("×")
                        .font(.title2)
                        .foregroundColor(.secondary)

                    VStack {
                        Text("\(workoutManager.currentReps)")
                            .font(.system(size: 32, weight: .bold, design: .rounded))
                            .foregroundColor(.green)
                        Text("렙")
                            .font(.caption2)
                            .foregroundColor(.secondary)
                    }
                }
                .padding(.vertical, 8)

                // Rest timer
                if workoutManager.isResting {
                    VStack(spacing: 4) {
                        Text("휴식")
                            .font(.caption)
                            .foregroundColor(.secondary)
                        Text("\(workoutManager.restTimeRemaining)")
                            .font(.system(size: 36, weight: .bold, design: .rounded))
                            .foregroundColor(.orange)
                        Text("초")
                            .font(.caption2)
                            .foregroundColor(.secondary)
                    }
                    .padding(.vertical, 4)
                }

                // Complete set button
                Button(action: { workoutManager.completeSet() }) {
                    Label(
                        workoutManager.isResting ? "건너뛰기" : "세트 완료",
                        systemImage: "checkmark.circle.fill"
                    )
                    .frame(maxWidth: .infinity)
                }
                .buttonStyle(.borderedProminent)
                .tint(.green)

                // End workout
                Button(action: { workoutManager.endWorkout() }) {
                    Label("운동 종료", systemImage: "stop.fill")
                        .frame(maxWidth: .infinity)
                }
                .buttonStyle(.bordered)
                .tint(.red)
            }
            .padding()
        }
        .navigationTitle("운동 중")
        .navigationBarBackButtonHidden(true)
    }
}

// MARK: - Components
struct StatBadge: View {
    let value: String
    let label: String

    var body: some View {
        VStack(spacing: 2) {
            Text(value)
                .font(.system(size: 18, weight: .bold, design: .rounded))
            Text(label)
                .font(.caption2)
                .foregroundColor(.secondary)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 8)
        .background(Color(.systemGray5))
        .cornerRadius(12)
    }
}

#Preview {
    ContentView()
        .environmentObject(WorkoutManager())
}
