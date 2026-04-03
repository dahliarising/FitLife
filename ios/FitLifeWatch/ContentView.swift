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
    @EnvironmentObject var wm: WorkoutManager

    var body: some View {
        ScrollView {
            VStack(spacing: 12) {
                // Header
                VStack(spacing: 4) {
                    Image(systemName: "figure.strengthtraining.traditional")
                        .font(.system(size: 32))
                        .foregroundColor(.indigo)

                    Text("FitLife")
                        .font(.headline)

                    if let routine = wm.todayRoutineLabel {
                        Text(routine)
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }
                }
                .padding(.top, 4)

                // 추천 운동 목록
                if wm.hasReceivedData && !wm.recommendedExercises.isEmpty {
                    VStack(alignment: .leading, spacing: 6) {
                        Text("오늘의 운동")
                            .font(.caption2)
                            .foregroundColor(.secondary)

                        ForEach(wm.recommendedExercises) { ex in
                            HStack {
                                VStack(alignment: .leading, spacing: 1) {
                                    Text(ex.name)
                                        .font(.caption)
                                        .fontWeight(.semibold)
                                    Text("\(ex.equipment)")
                                        .font(.caption2)
                                        .foregroundColor(.secondary)
                                }
                                Spacer()
                                Text("\(Int(ex.weight))kg x\(ex.reps)")
                                    .font(.caption2)
                                    .foregroundColor(.indigo)
                            }
                            .padding(.vertical, 4)
                        }
                    }
                    .padding(.horizontal, 4)
                }

                // Start button
                Button(action: { wm.startWorkout() }) {
                    Label("운동 시작", systemImage: "play.fill")
                        .frame(maxWidth: .infinity)
                }
                .buttonStyle(.borderedProminent)
                .tint(.indigo)

                // Refresh
                if !wm.hasReceivedData {
                    Button(action: { wm.requestTodayWorkout() }) {
                        Label("데이터 새로고침", systemImage: "arrow.clockwise")
                            .font(.caption2)
                    }
                    .buttonStyle(.bordered)
                }
            }
            .padding(.horizontal, 4)
        }
        .navigationTitle("FitLife")
        .onAppear { wm.requestTodayWorkout() }
    }
}

// MARK: - Active Workout View

struct ActiveWorkoutView: View {
    @EnvironmentObject var wm: WorkoutManager

    var body: some View {
        ScrollView {
            VStack(spacing: 8) {
                // Exercise name + progress
                VStack(spacing: 2) {
                    Text(wm.currentExerciseName)
                        .font(.headline)
                        .lineLimit(1)

                    if !wm.recommendedExercises.isEmpty {
                        Text("운동 \(wm.currentExerciseIndex + 1)/\(wm.recommendedExercises.count)")
                            .font(.caption2)
                            .foregroundColor(.secondary)
                    }

                    Text("세트 \(wm.currentSetIndex + 1)/\(wm.totalSetsInExercise)")
                        .font(.caption)
                        .foregroundColor(.secondary)
                }

                if wm.isResting {
                    // Rest timer
                    RestTimerView()
                } else {
                    // Weight & Reps with adjustment
                    WeightRepsView()
                }

                // Buttons
                VStack(spacing: 6) {
                    if wm.isResting {
                        Button(action: { wm.skipRest() }) {
                            Label("건너뛰기", systemImage: "forward.fill")
                                .frame(maxWidth: .infinity)
                        }
                        .buttonStyle(.borderedProminent)
                        .tint(.orange)
                    } else {
                        Button(action: { wm.completeSet() }) {
                            Label("세트 완료", systemImage: "checkmark.circle.fill")
                                .frame(maxWidth: .infinity)
                        }
                        .buttonStyle(.borderedProminent)
                        .tint(.green)
                    }

                    Button(action: { wm.endWorkout() }) {
                        Label("운동 종료", systemImage: "stop.fill")
                            .font(.caption)
                            .frame(maxWidth: .infinity)
                    }
                    .buttonStyle(.bordered)
                    .tint(.red)
                }

                // Session stats
                HStack(spacing: 16) {
                    StatBadge(value: "\(wm.todaySets)", label: "세트")
                    StatBadge(value: "\(wm.todayVolume)kg", label: "볼륨")
                }
                .padding(.top, 4)
            }
            .padding(.horizontal, 4)
        }
        .navigationTitle("운동 중")
        .navigationBarBackButtonHidden(true)
    }
}

// MARK: - Rest Timer

struct RestTimerView: View {
    @EnvironmentObject var wm: WorkoutManager

    var body: some View {
        VStack(spacing: 4) {
            Text("휴식")
                .font(.caption)
                .foregroundColor(.secondary)

            Text("\(wm.restTimeRemaining)")
                .font(.system(size: 48, weight: .bold, design: .rounded))
                .foregroundColor(wm.restTimeRemaining <= 10 ? .red : .orange)
                .monospacedDigit()

            Text("초")
                .font(.caption2)
                .foregroundColor(.secondary)

            // Progress ring
            ZStack {
                Circle()
                    .stroke(.gray.opacity(0.2), lineWidth: 4)
                Circle()
                    .trim(from: 0, to: CGFloat(wm.restTimeRemaining) / 90.0)
                    .stroke(.orange, style: StrokeStyle(lineWidth: 4, lineCap: .round))
                    .rotationEffect(.degrees(-90))
                    .animation(.linear(duration: 1), value: wm.restTimeRemaining)
            }
            .frame(width: 60, height: 60)
        }
        .padding(.vertical, 4)
    }
}

// MARK: - Weight & Reps Adjustment

struct WeightRepsView: View {
    @EnvironmentObject var wm: WorkoutManager

    var body: some View {
        HStack(spacing: 16) {
            // Weight
            VStack(spacing: 4) {
                Text("\(wm.currentWeight, specifier: "%.1f")")
                    .font(.system(size: 28, weight: .bold, design: .rounded))
                    .foregroundColor(.indigo)
                    .monospacedDigit()
                Text("kg")
                    .font(.caption2)
                    .foregroundColor(.secondary)
                HStack(spacing: 8) {
                    Button(action: { wm.adjustWeight(-2.5) }) {
                        Image(systemName: "minus")
                            .font(.caption)
                    }
                    .buttonStyle(.bordered)

                    Button(action: { wm.adjustWeight(2.5) }) {
                        Image(systemName: "plus")
                            .font(.caption)
                    }
                    .buttonStyle(.bordered)
                }
            }

            Text("x")
                .font(.title3)
                .foregroundColor(.secondary)

            // Reps
            VStack(spacing: 4) {
                Text("\(wm.currentReps)")
                    .font(.system(size: 28, weight: .bold, design: .rounded))
                    .foregroundColor(.green)
                    .monospacedDigit()
                Text("렙")
                    .font(.caption2)
                    .foregroundColor(.secondary)
                HStack(spacing: 8) {
                    Button(action: { wm.adjustReps(-1) }) {
                        Image(systemName: "minus")
                            .font(.caption)
                    }
                    .buttonStyle(.bordered)

                    Button(action: { wm.adjustReps(1) }) {
                        Image(systemName: "plus")
                            .font(.caption)
                    }
                    .buttonStyle(.bordered)
                }
            }
        }
        .padding(.vertical, 8)
    }
}

// MARK: - Stat Badge

struct StatBadge: View {
    let value: String
    let label: String

    var body: some View {
        VStack(spacing: 2) {
            Text(value)
                .font(.system(size: 16, weight: .bold, design: .rounded))
                .monospacedDigit()
            Text(label)
                .font(.caption2)
                .foregroundColor(.secondary)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 6)
        .background(Color(.systemGray5))
        .cornerRadius(12)
    }
}

#Preview {
    ContentView()
        .environmentObject(WorkoutManager())
}
