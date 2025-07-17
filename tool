#include <iostream>
#include <string>

using namespace std;

int main() {
    string subject, body;
    int spamScore = 0;

    string spamWords[] = {
        "Urgent", "free", "money", "offer", "click", "buy", "subscribe", "lottery", "prize", "limited"
    };
    int totalWords = 10;

    cout << "===== Email Spam Detection System =====\n\n";

    cout << "Enter email subject: ";
    getline(cin, subject);

    cout << "Enter email body: ";
    getline(cin, body);

    string content = subject + " " + body;

    for (int i = 0; i < content.length(); i++) {
        content[i] = tolower(content[i]);
    }

    for (int i = 0; i < totalWords; i++) {
        if (content.find(spamWords[i]) != string::npos) {
            spamScore++;
        }
    }

    cout << "\nAnalyzing the email...\n";
    cout << "Spam Score: " << spamScore << endl;

    if (spamScore >= 3) {
        cout << "❌ This email is SPAM.\n";
    } else {
        cout << "✅ This email is NOT spam.\n";
    }

    return 0;
}
