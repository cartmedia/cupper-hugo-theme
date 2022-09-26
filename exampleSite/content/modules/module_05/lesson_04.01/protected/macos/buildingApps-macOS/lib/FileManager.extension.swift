import Foundation

extension FileManager {

    open func extractWhereFrom(path: String) -> String? {
        guard let attributes = try? FileManager.default.attributesOfItem(atPath: path) else { return nil }
        guard let extendedAttributes = attributes[FileAttributeKey(rawValue: "NSFileExtendedAttributes")] as? [String: Any] else { return nil }
        guard let data = extendedAttributes["com.apple.metadata:kMDItemWhereFroms"] as? Data else { return nil }
        guard let urls = try? PropertyListDecoder().decode([String].self, from: data) else {return nil}

        return urls.count == 0 ? nil : urls[0]
    }

    open func secureCopyItem(at srcURL: URL, to dstURL: URL) -> Bool {
        do {
            if FileManager.default.fileExists(atPath: dstURL.path) {
                try FileManager.default.removeItem(at: dstURL)
            }
            try FileManager.default.copyItem(at: srcURL, to: dstURL)
        } catch let error {
            print("Cannot copy item at \(srcURL) to \(dstURL): \(error)")
            return false
        }
        return true
    }
}
