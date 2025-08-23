// タブ切り替え
function switchTab(tabId) {
    // 全てのタブとコンテンツを非アクティブ化
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    // 選択されたタブとコンテンツをアクティブ化
    event.target.classList.add('active');
    document.getElementById(tabId).classList.add('active');
}

// プロンプトテンプレート
const prompts = {
    'debug-prompt': 'このエラーを分析して解決方法を提案してください：\n\n',
    'refactor-prompt': 'このコードをリファクタリングして、可読性と保守性を向上させてください：\n\n',
    'explain-prompt': 'このコードの動作を詳しく説明してください：\n\n',
    'test-prompt': 'この関数のユニットテストを作成してください：\n\n'
};

// クリップボードにコピー
function copyToClipboard(promptType) {
    const text = prompts[promptType];
    
    // ボタンにクリック効果を追加
    const button = event.target;
    button.classList.add('clicked');
    setTimeout(() => button.classList.remove('clicked'), 600);
    
    try {
        // Electron環境でのクリップボード操作
        if (typeof window.require !== 'undefined') {
            const { clipboard } = window.require('electron');
            clipboard.writeText(text);
            showNotification('✅ クリップボードにコピーしました: ' + promptType);
            console.log('✅ Copied to clipboard:', promptType, 'Text:', text.substring(0, 50) + '...');
            return;
        }
    } catch (error) {
        console.error('❌ Electron clipboard error:', error);
    }
    
    // Web版クリップボード操作
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(() => {
            showNotification('✅ クリップボードにコピーしました: ' + promptType);
            console.log('✅ Web clipboard copied:', promptType);
        }).catch(() => {
            fallbackCopyToClipboard(text, promptType);
        });
    } else {
        fallbackCopyToClipboard(text, promptType);
    }
}

// フォールバックコピー（Web版用）
function fallbackCopyToClipboard(text, promptType) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.cssText = 'position:fixed;left:-999px;top:-999px;';
    document.body.appendChild(textArea);
    textArea.select();
    
    try {
        document.execCommand('copy');
        showNotification('✅ クリップボードにコピーしました (Web): ' + promptType);
        console.log('✅ Fallback copy successful:', promptType);
    } catch (err) {
        showNotification('❌ コピーできません。手動でコピーしてください');
        console.error('❌ All clipboard methods failed');
    } finally {
        document.body.removeChild(textArea);
    }
}

// クイックアクション
function quickAction(action) {
    const actions = {
        'todo': 'TODO: ',
        'commit': 'git commit -m ""',
        'status': 'git status',
        'diff': 'git diff'
    };
    
    // ボタンにクリック効果を追加
    const button = event.target;
    button.classList.add('clicked');
    setTimeout(() => button.classList.remove('clicked'), 600);
    
    const text = actions[action];
    
    try {
        // Electron環境
        if (typeof window.require !== 'undefined') {
            const { clipboard } = window.require('electron');
            clipboard.writeText(text);
            showNotification('✅ ' + action + ' コマンドをコピーしました');
            console.log('✅ Quick action copied:', action, 'Command:', text);
            return;
        }
    } catch (error) {
        console.error('❌ Electron quick action error:', error);
    }
    
    // Web版
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(() => {
            showNotification('✅ ' + action + ' コマンドをコピーしました');
        }).catch(() => {
            fallbackCopyToClipboard(text, action);
        });
    } else {
        fallbackCopyToClipboard(text, action);
    }
}

// やらかし追加
function addYarakashi() {
    const title = prompt('やらかし内容を入力してください:');
    if (title) {
        const today = new Date().toISOString().split('T')[0];
        const listElement = document.getElementById('yarakashi-list');
        const newItem = document.createElement('div');
        newItem.className = 'yarakashi-item';
        newItem.innerHTML = '<div class="yarakashi-date">' + today + '</div><div>' + title + '</div>';
        listElement.insertBefore(newItem, listElement.firstChild);
    }
}

// やらかし編集
function editYarakashi(index) {
    alert('やらかし詳細編集機能（今後実装予定）');
}

// 通知表示
function showNotification(message) {
    console.log('🔔 Notification:', message);
    
    // 簡易通知（より見やすく改良）
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 15px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 11px;
        font-weight: bold;
        z-index: 1000;
        box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        animation: slideDown 0.3s ease;
    `;
    document.body.appendChild(notification);
    
    // 通知にスライドダウンアニメーションを追加
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideDown {
            from { opacity: 0; transform: translateX(-50%) translateY(-20px); }
            to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
    `;
    document.head.appendChild(style);
    
    setTimeout(() => {
        if (document.body.contains(notification)) {
            document.body.removeChild(notification);
        }
        if (document.head.contains(style)) {
            document.head.removeChild(style);
        }
    }, 3000);
}

// デバッグモード切り替え（Web版対応）
function toggleDevTools() {
    // Electronアプリの場合
    if (typeof window.require !== 'undefined') {
        try {
            const { webContents } = window.require('electron').remote.getCurrentWindow();
            if (webContents.isDevToolsOpened()) {
                webContents.closeDevTools();
            } else {
                webContents.openDevTools();
            }
            return;
        } catch (error) {
            try {
                const { ipcRenderer } = window.require('electron');
                ipcRenderer.send('toggle-devtools');
                return;
            } catch (e) {
                // Electron API失敗時はWeb版として扱う
            }
        }
    }
    
    // Web版の場合：デバッグコンソール表示切り替え
    toggleWebDebugMode();
}

// Web版デバッグモード
function toggleWebDebugMode() {
    const isDebugMode = localStorage.getItem('webDebugMode') === 'true';
    
    if (isDebugMode) {
        localStorage.setItem('webDebugMode', 'false');
        hideDebugConsole();
        showNotification('🔧 デバッグモード: OFF');
    } else {
        localStorage.setItem('webDebugMode', 'true');
        showDebugConsole();
        showNotification('🔧 デバッグモード: ON (F12でブラウザDevTools)');
    }
}

// デバッグコンソール表示
function showDebugConsole() {
    let debugConsole = document.getElementById('web-debug-console');
    if (!debugConsole) {
        debugConsole = document.createElement('div');
        debugConsole.id = 'web-debug-console';
        debugConsole.style.cssText = `
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            height: 150px;
            background: rgba(0, 0, 0, 0.9);
            color: #00ff00;
            font-family: monospace;
            font-size: 11px;
            padding: 10px;
            overflow-y: auto;
            z-index: 9999;
            border-top: 2px solid #00ff00;
        `;
        debugConsole.innerHTML = `
            <div style="color: #00ff00; margin-bottom: 5px;">🔧 Web Debug Console - F12でブラウザDevToolsも開けます</div>
            <div id="debug-log"></div>
        `;
        document.body.appendChild(debugConsole);
    }
    debugConsole.style.display = 'block';
    
    // コンソールログを捕獲
    interceptConsoleLog();
}

// デバッグコンソール非表示
function hideDebugConsole() {
    const debugConsole = document.getElementById('web-debug-console');
    if (debugConsole) {
        debugConsole.style.display = 'none';
    }
}

// コンソールログ捕獲
function interceptConsoleLog() {
    const originalLog = console.log;
    const debugLog = document.getElementById('debug-log');
    
    if (debugLog && !window.logIntercepted) {
        window.logIntercepted = true;
        console.log = function(...args) {
            originalLog.apply(console, args);
            if (localStorage.getItem('webDebugMode') === 'true') {
                const timestamp = new Date().toLocaleTimeString();
                const message = args.map(arg => 
                    typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
                ).join(' ');
                debugLog.innerHTML += `<div style="margin: 2px 0;">[${timestamp}] ${message}</div>`;
                debugLog.scrollTop = debugLog.scrollHeight;
            }
        };
    }
}

// 初期化
document.addEventListener('DOMContentLoaded', function() {
    console.log('Claude Code Tray App loaded');
});