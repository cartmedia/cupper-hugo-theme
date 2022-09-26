import Foundation
import Cocoa

extension NSStatusBarButton {
  // registers this component to be dropable
  open override func prepareForDragOperation(_ sender: NSDraggingInfo) -> Bool {
    return true
  }

  open override func draggingEntered(_ sender: NSDraggingInfo) -> NSDragOperation {
    self.highlight(true)
    return .copy
  }

  open override func draggingExited(_ sender: NSDraggingInfo?) {
    self.highlight(false)
  }

  open override func draggingEnded(_ sender: NSDraggingInfo) {
    self.highlight(false)
  }

  open override func performDragOperation(_ sender: NSDraggingInfo) -> Bool {
    // The dragging source operation mask is applied when a button is pressed when dropping, in this case the CMD button
    let isCmdPressedOnDrop =  sender.draggingSourceOperationMask == NSDragOperation.generic

    // Check if any items have been dropped into our button
    guard let objects = sender.draggingPasteboard.readObjects(
      forClasses: [NSFilePromiseReceiver.self,
                   NSURL.self,
                   NSString.self],
                  options: nil
    ) else {
      // No item has been dropped finish our performDragOperation method with false
      return false
    }

    // We now have a bunch of "pasteboard" files, however they are saved into a temp directory on your mac
    // if you restart your computer they are lost, so we are going to move them into our application documents folder
    // Why? because pastboard files are very limited in their info and we want to display as much info as possible in our
    // application
    //
    // This is why we extended the FileManager class
    // Now there is some explanation needed here... there are two types of objects you can receive when you drag a drop
    // if you drag and drop from your computer... you get a *drum roll* STRING! which is just the location of the file
    // However and this is the cool part... you can also drag and drop stuff from your browser for example, go ahead
    // go and try to drag an image into your desktop... this is different, in this case our code will receive a "file promise"
    // and it is our responsability to save the file the outgoing program is passing to our code
    objects.forEach { object in
      // This are dragable objects which are not on the file system
      if let filePromiseReceiver = object as? NSFilePromiseReceiver {
        filePromiseReceiver.receivePromisedFiles(atDestination: FileConstants.documentUrl,
                                                 options: [:],
                                                 operationQueue: FileConstants.workQueue)
        { fileUrl, error in
          // Guard against not being able to save a single file
          if let error = error {
              print("error saving file", error)
              return
          }

          // in this case original location is the original url of the file! cool right?
          var originalLocation = FileManager.default.extractWhereFrom(path: fileUrl.path)

          // some guard because the location might not always be the browser but another program
          if fileUrl.isLocalFile {
              originalLocation = originalLocation?.replacingOccurrences(of: "file://", with: "")
          }

          //if fileUrl.isImage {
          //BuildingAppsEmitter.sharedInstace.dispatchImageDropped(body: [
          //  "originalUrl": originalLocation,
          //  "url": fileUrl.absoluteString,
          //  "name": fileUrl.lastPathComponent,
          //  "isCmdPressedOnDrop": isCmdPressedOnDrop
          //])
          //}

        }
      }

      // Here we have received a URL, which means the user dragged and dropped from the local file system
      // First attempt to cast the object as URL
      if let url = object as? URL {
        print("URL dropped", url)
        // Double check to make sure we can copy the data
        if(url.isLocalFile) {
          let fileName = url.lastPathComponent
          // Copy it to our apps sandbox
          let newFileUrl = FileConstants.documentUrl.appendingPathComponent(fileName)
          let copied = FileManager.default.secureCopyItem(at: url, to: newFileUrl)

          if !copied {
            print("File was not copied, THROW ERROR HERE")
            return
          }

          let originalLocation = url.absoluteString.replacingOccurrences(of: "file://", with: "")

          BuildingAppsEmitter.sharedInstance.dispatchFileDropped(body: [
            "originalUrl": originalLocation,
            "url": newFileUrl.absoluteString,
            "name": fileName,
            "extension": newFileUrl.pathExtension,
            "isCmdPressedOnDrop": isCmdPressedOnDrop
          ])

        }
      }


      // This is not used, but if you register the type, you can enable drag and drop for a lot of macOS primitives
      //  if let string = object as? String {
      //    BuildingAppsEmitter.sharedInstace.dispatchStringDropped(body: [
      //        "text": string,
      //        "isSelected": string
      //      ])
      //  }

      let appDelegate = NSApp.delegate as? AppDelegate
      appDelegate?.togglePopover(nil)
    }

    return true
  }
}
