import SwiftUI

@main
struct HiyoriApp: App {
    var body: some Scene {
        WindowGroup {
            StudyWebView()
                .background(Color.white)
                .preferredColorScheme(.light)
        }
    }
}
