import Foundation

private let imageExtensions = ["png", "jpeg", "gif", "jpg"]

extension URL {
    var isImage: Bool {
      imageExtensions.contains(self.pathExtension.lowercased())
    }

    /// Checks if a url is a "local" file
    var isLocalFile: Bool {
        self.scheme == "file"
    }
}
