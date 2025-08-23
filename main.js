const { app, BrowserWindow, Tray, Menu, nativeImage } = require('electron');
const path = require('path');

let mainWindow;
let tray;
let isWindowVisible = true;

function createWindow() {
    // メインウィンドウを作成（開発モード用に幅を拡大）
    mainWindow = new BrowserWindow({
        width: 900, // 開発用に600pxに拡大
        height: 800,
        x: 1020, // 中央寄りに配置
        y: 50,
        resizable: true, // 開発時はリサイズ可能
        alwaysOnTop: true,
        frame: true, // タイトルバー表示
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
        }
    });

    // HTMLファイルを読み込み
    mainWindow.loadFile('index.html');
    
    // 開発者ツールを開く（デバッグ用）
    mainWindow.webContents.openDevTools();

    // ウィンドウが閉じられる時は隠すだけ
    mainWindow.on('close', (event) => {
        event.preventDefault();
        hideWindow();
    });

    // ウィンドウが隠された時
    mainWindow.on('hide', () => {
        isWindowVisible = false;
    });

    // ウィンドウが表示された時
    mainWindow.on('show', () => {
        isWindowVisible = true;
    });
}

function createTray() {
    // システムトレイアイコンを作成（16x16の緑の円）
    const icon = nativeImage.createEmpty();
    const canvas = require('canvas').createCanvas(16, 16);
    const ctx = canvas.getContext('2d');
    
    // 緑の円を描画
    ctx.fillStyle = 'green';
    ctx.beginPath();
    ctx.arc(8, 8, 7, 0, 2 * Math.PI);
    ctx.fill();
    
    // Bufferに変換してアイコンとして使用
    const buffer = canvas.toBuffer('image/png');
    const trayIcon = nativeImage.createFromBuffer(buffer);
    
    tray = new Tray(trayIcon);
    
    // システムトレイのメニューを作成
    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Toggle Window',
            click: toggleWindow,
            type: 'normal'
        },
        {
            label: 'Show Window',
            click: showWindow
        },
        { type: 'separator' },
        {
            label: 'Exit',
            click: () => {
                app.isQuiting = true;
                app.quit();
            }
        }
    ]);
    
    tray.setContextMenu(contextMenu);
    tray.setToolTip('Claude Code Helper v1.02');
    
    // 左クリックでウィンドウ切り替え
    tray.on('click', toggleWindow);
}

function showWindow() {
    if (mainWindow) {
        mainWindow.show();
        mainWindow.focus();
    }
}

function hideWindow() {
    if (mainWindow) {
        mainWindow.hide();
    }
}

function toggleWindow() {
    if (isWindowVisible) {
        hideWindow();
    } else {
        showWindow();
    }
}

// アプリケーションの初期化
app.whenReady().then(() => {
    createWindow();
    createTray();
    
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

// 全ウィンドウが閉じられた時（macOS以外）
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        // トレイアプリなので終了しない
    }
});

// アプリ終了前の処理
app.on('before-quit', () => {
    app.isQuiting = true;
});