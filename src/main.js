const { app, BrowserWindow, Tray, Menu, nativeImage } = require('electron');
const path = require('path');
const fs = require('fs');

// 設定ファイル読み込み
const config = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json'), 'utf8'));

let mainWindow;
let tray;
let isWindowVisible = true;

function createWindow() {
    // 設定ファイルからウィンドウ設定を読み込み
    mainWindow = new BrowserWindow({
        width: config.window.width,
        height: config.window.height,
        x: config.window.x,
        y: config.window.y,
        resizable: config.window.resizable,
        alwaysOnTop: config.window.alwaysOnTop,
        frame: config.window.frame,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
        }
    });

    // 設定ファイルからWebアプリURLを読み込み
    mainWindow.loadFile(path.join(__dirname, config.webapp_url));
    
    // 開発者ツール（設定による）
    if (config.development.devTools) {
        mainWindow.webContents.openDevTools();
    }

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
    tray.setToolTip(config.tray.tooltip);
    
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