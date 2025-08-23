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
        const { clipboard } = window.require('electron');
        clipboard.writeText(text);
        showNotification('✅ クリップボードにコピーしました: ' + promptType);
        console.log('✅ Copied to clipboard:', promptType, 'Text:', text.substring(0, 50) + '...');
    } catch (error) {
        console.error('❌ Clipboard error:', error);
        showNotification('❌ コピーに失敗しました');
        
        // フォールバック: navigator.clipboard
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
                showNotification('✅ クリップボードにコピーしました (fallback): ' + promptType);
            }).catch(() => {
                showNotification('❌ コピーに完全に失敗しました');
            });
        }
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
    
    try {
        const { clipboard } = window.require('electron');
        clipboard.writeText(actions[action]);
        showNotification('✅ ' + action + ' コマンドをコピーしました');
        console.log('✅ Quick action copied:', action, 'Command:', actions[action]);
    } catch (error) {
        console.error('❌ Quick action error:', error);
        showNotification('❌ コピーに失敗しました');
        
        // フォールバック: navigator.clipboard
        if (navigator.clipboard) {
            navigator.clipboard.writeText(actions[action]).then(() => {
                showNotification('✅ ' + action + ' コマンドをコピーしました (fallback)');
            }).catch(() => {
                showNotification('❌ コピーに完全に失敗しました');
            });
        }
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

// 初期化
document.addEventListener('DOMContentLoaded', function() {
    console.log('Claude Code Tray App loaded');
});