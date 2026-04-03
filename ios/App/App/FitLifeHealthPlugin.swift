import Capacitor
import HealthKit

/// Capacitor 플러그인: HealthKit 읽기/쓰기
@objc(FitLifeHealthPlugin)
public class FitLifeHealthPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "FitLifeHealthPlugin"
    public let jsName = "FitLifeHealth"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "requestPermission", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "fetchRunningWorkouts", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "fetchTodayStats", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "writeWorkout", returnType: CAPPluginReturnPromise),
    ]

    private let healthStore = HKHealthStore()

    // MARK: - Permission

    @objc func requestPermission(_ call: CAPPluginCall) {
        guard HKHealthStore.isHealthDataAvailable() else {
            call.resolve(["granted": false])
            return
        }

        let readTypes: Set<HKObjectType> = [
            HKObjectType.workoutType(),
            HKQuantityType(.stepCount),
            HKQuantityType(.activeEnergyBurned),
            HKQuantityType(.restingHeartRate),
            HKQuantityType(.distanceWalkingRunning),
        ]

        let writeTypes: Set<HKSampleType> = [
            HKObjectType.workoutType(),
            HKQuantityType(.activeEnergyBurned),
        ]

        healthStore.requestAuthorization(toShare: writeTypes, read: readTypes) { success, _ in
            call.resolve(["granted": success])
        }
    }

    // MARK: - Fetch Running Workouts (NRC 포함)

    @objc func fetchRunningWorkouts(_ call: CAPPluginCall) {
        let startDateStr = call.getString("startDate") ?? ""
        let formatter = ISO8601DateFormatter()
        let startDate = formatter.date(from: startDateStr) ?? Calendar.current.date(byAdding: .day, value: -30, to: Date())!

        let predicate = HKQuery.predicateForWorkouts(with: .running)
        let datePredicate = HKQuery.predicateForSamples(withStart: startDate, end: Date())
        let compound = NSCompoundPredicate(andPredicateWithSubpredicates: [predicate, datePredicate])

        let sortDescriptor = NSSortDescriptor(key: HKSampleSortIdentifierStartDate, ascending: false)

        let query = HKSampleQuery(
            sampleType: HKObjectType.workoutType(),
            predicate: compound,
            limit: 100,
            sortDescriptors: [sortDescriptor]
        ) { _, samples, _ in
            guard let workouts = samples as? [HKWorkout] else {
                call.resolve(["workouts": []])
                return
            }

            let results = workouts.map { workout -> [String: Any] in
                let distance = workout.totalDistance?.doubleValue(for: .meterUnit(with: .kilo)) ?? 0
                let duration = workout.duration
                let calories = workout.totalEnergyBurned?.doubleValue(for: .kilocalorie()) ?? 0
                let source = workout.sourceRevision.source.name

                return [
                    "startDate": formatter.string(from: workout.startDate),
                    "endDate": formatter.string(from: workout.endDate),
                    "distanceKm": round(distance * 100) / 100,
                    "durationSeconds": Int(duration),
                    "calories": Int(calories),
                    "sourceName": source,
                ]
            }

            call.resolve(["workouts": results])
        }

        healthStore.execute(query)
    }

    // MARK: - Today Stats

    @objc func fetchTodayStats(_ call: CAPPluginCall) {
        let calendar = Calendar.current
        let startOfDay = calendar.startOfDay(for: Date())

        let group = DispatchGroup()
        var steps: Double = 0
        var calories: Double = 0
        var heartRate: Double = 0

        // Steps
        group.enter()
        querySum(type: HKQuantityType(.stepCount), start: startOfDay, unit: .count()) { value in
            steps = value
            group.leave()
        }

        // Active Calories
        group.enter()
        querySum(type: HKQuantityType(.activeEnergyBurned), start: startOfDay, unit: .kilocalorie()) { value in
            calories = value
            group.leave()
        }

        // Resting Heart Rate (latest)
        group.enter()
        queryLatest(type: HKQuantityType(.restingHeartRate), unit: HKUnit.count().unitDivided(by: .minute())) { value in
            heartRate = value
            group.leave()
        }

        group.notify(queue: .main) {
            call.resolve([
                "steps": Int(steps),
                "activeCalories": Int(calories),
                "restingHeartRate": Int(heartRate),
            ])
        }
    }

    // MARK: - Write Workout

    @objc func writeWorkout(_ call: CAPPluginCall) {
        let startDateStr = call.getString("startDate") ?? ""
        let endDateStr = call.getString("endDate") ?? ""
        let calories = call.getDouble("calories") ?? 0
        let activityType = call.getString("activityType") ?? "strength"

        let formatter = ISO8601DateFormatter()
        guard let startDate = formatter.date(from: startDateStr),
              let endDate = formatter.date(from: endDateStr) else {
            call.resolve(["success": false])
            return
        }

        let workoutType: HKWorkoutActivityType = activityType == "running" ? .running : .traditionalStrengthTraining
        let energyBurned = HKQuantity(unit: .kilocalorie(), doubleValue: calories)

        let workout = HKWorkout(
            activityType: workoutType,
            start: startDate,
            end: endDate,
            duration: endDate.timeIntervalSince(startDate),
            totalEnergyBurned: energyBurned,
            totalDistance: nil,
            metadata: nil
        )

        healthStore.save(workout) { success, _ in
            call.resolve(["success": success])
        }
    }

    // MARK: - Helpers

    private func querySum(type: HKQuantityType, start: Date, unit: HKUnit, completion: @escaping (Double) -> Void) {
        let predicate = HKQuery.predicateForSamples(withStart: start, end: Date())
        let query = HKStatisticsQuery(quantityType: type, quantitySamplePredicate: predicate, options: .cumulativeSum) { _, result, _ in
            completion(result?.sumQuantity()?.doubleValue(for: unit) ?? 0)
        }
        healthStore.execute(query)
    }

    private func queryLatest(type: HKQuantityType, unit: HKUnit, completion: @escaping (Double) -> Void) {
        let sort = NSSortDescriptor(key: HKSampleSortIdentifierStartDate, ascending: false)
        let query = HKSampleQuery(sampleType: type, predicate: nil, limit: 1, sortDescriptors: [sort]) { _, samples, _ in
            if let sample = samples?.first as? HKQuantitySample {
                completion(sample.quantity.doubleValue(for: unit))
            } else {
                completion(0)
            }
        }
        healthStore.execute(query)
    }
}
