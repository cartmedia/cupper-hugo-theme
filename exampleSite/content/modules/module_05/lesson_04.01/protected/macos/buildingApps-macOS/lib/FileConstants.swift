import Foundation

struct FileConstants {
    static let documentUrl: URL = {
        let destinationURL = URL(fileURLWithPath: NSHomeDirectory()).appendingPathComponent("Kipu Files")
        try? FileManager.default.createDirectory(at: destinationURL, withIntermediateDirectories: true, attributes: nil)
        return destinationURL
    }()

    /// Queue used for reading and writing file promises.
    static let workQueue: OperationQueue = {
        let providerQueue = OperationQueue()
        providerQueue.qualityOfService = .userInitiated
        return providerQueue
    }()
}
