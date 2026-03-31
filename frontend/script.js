// 🔥 BASE URL (IMPORTANT)
// PC ke liye:
const BASE_URL = "http://127.0.0.1:8000"; 
// Jab aap deploy karenge, toh yaha deploy ki gayi URL daalein:
// const BASE_URL = "https://your-backend-url.render.com";

// Mobile ke liye (agar phone pe chalana ho):
// const BASE_URL = "http://192.168.29.164:8000";


document.addEventListener('DOMContentLoaded', () => {
    console.log("Modern UI Script loaded successfully");

    const textarea = document.getElementById("newsInput");
    const charCount = document.getElementById("charCount");

    if (textarea && charCount) {
        textarea.addEventListener("input", () => {
            charCount.textContent = `${textarea.value.length} characters`;
        });
    }

    loadHistory();
});


function switchTab(tabId) {
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(`btn-${tabId}`).classList.add('active');

    document.querySelectorAll('.tab-content').forEach(content => {
        if (content.id !== tabId) {
            content.classList.remove('active');
            setTimeout(() => content.classList.add('hidden'), 50);
        }
    });

    const activeTab = document.getElementById(tabId);
    if (activeTab) {
        activeTab.classList.remove('hidden');
        void activeTab.offsetWidth;
        activeTab.classList.add('active');
    }

    if (tabId === "history") {
        loadHistory();
    }
}


async function analyzeNews() {
    const textarea = document.getElementById("newsInput");
    const analyzeBtn = document.getElementById("analyzeBtn");
    const loader = document.getElementById("loader");
    const resultBox = document.getElementById("resultBox");

    const text = textarea.value;

    if (!text.trim()) {
        alert("Please enter some text to analyze.");
        textarea.focus();
        return;
    }

    analyzeBtn.disabled = true;
    analyzeBtn.innerHTML = 'Analyzing...';
    resultBox.classList.add("hidden");
    loader.classList.remove("hidden");

    try {
        const response = await fetch(`${BASE_URL}/predict`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ text })
        });

        if (!response.ok) {
            throw new Error("Backend response error");
        }

        const data = await response.json();

        loader.classList.add("hidden");

        const isFake = data.result === 'FAKE';
        const typeClass = isFake ? 'fake' : 'real';
        const displayResult = isFake ? 'Fake News Detected' : 'Reliable Source';

        resultBox.innerHTML = `
            <div class="result-card ${typeClass}">
                <div class="result-info">
                   <div class="result-icon">${isFake ? '🚫' : '✅'}</div>
                   <div class="result-text">
                        <h2>${displayResult}</h2>
                        ${data.source_url ? `
                            <p class="source-info">
                                Verified via: <a href="${data.source_url}" target="_blank" class="source-link">${data.source_name || 'Online Source'} 🔗</a>
                            </p>
                        ` : '<p>Analyzed via AI Model</p>'}
                   </div>
                </div>
                <div class="confidence-bar-wrapper">
                    <span class="confidence-label">Confidence: ${data.confidence}%</span>
                    <div class="confidence-track">
                        <div class="confidence-fill" style="width: ${data.confidence}%"></div>
                    </div>
                </div>
            </div>
        `;

        resultBox.classList.remove("hidden");

        loadHistory();

    } catch (error) {
        console.error("Error:", error);
        loader.classList.add("hidden");

        alert("Backend connection error. Check if server is running.");
    } finally {
        analyzeBtn.disabled = false;
        analyzeBtn.innerHTML = 'Verify Now';
    }
}


async function loadHistory() {
    const historyList = document.getElementById("historyList");
    if (!historyList) return;

    try {
        const response = await fetch(`${BASE_URL}/history`);

        if (!response.ok) {
            throw new Error("History fetch failed");
        }

        const data = await response.json();

        historyList.innerHTML = "";

        if (!data || data.length === 0) {
            historyList.innerHTML = `<p>No history available</p>`;
            return;
        }

        data.reverse().forEach(item => {
            const isFake = item.result === 'FAKE';

            historyList.innerHTML += `
                <div class="history-item">
                    <p class="history-text">"${item.text || item.newsText}"</p>
                    <div class="history-meta">
                        <span class="${isFake ? 'fake' : 'real'}">${item.result} (${item.confidence}%)</span>
                        ${item.source_url ? `<a href="${item.source_url}" target="_blank" class="source-link">Source 🔗</a>` : ''}
                    </div>
                </div>
            `;
        });

    } catch (error) {
        console.error("History error:", error);
        historyList.innerHTML = `<p>Cannot connect to backend</p>`;
    }
}