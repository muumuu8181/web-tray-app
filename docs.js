# Claude Code Tray App v1.02

## 概要
Claude Code Helper をシステムトレイに常駐させるElectronアプリケーションです。  
右上に緑の円アイコンが表示され、左クリックでGUIの表示/非表示を切り替えできます。

## 主要機能

### 📝 プロンプトタブ
- **デバッグ分析**: `このエラーを分析して解決方法を提案してください：\n\n`
- **リファクタ**: `このコードをリファクタリングして、可読性と保守性を向上させてください：\n\n`
- **コード説明**: `このコードの動作を詳しく説明してください：\n\n`
- **テスト作成**: `この関数のユニットテストを作成してください：\n\n`

### ⚡ クイックアクション
- **TODO追加**: `TODO: ` をクリップボードにコピー
- **コミット**: `git commit -m ""` をクリップボードにコピー
- **ステータス**: `git status` をクリップボードにコピー
- **差分確認**: `git diff` をクリップボードにコピー

### ⚠️ やらかしリスト
- 過去のミスや学習内容を記録
- 日付付きで管理
- 対策メモ機能

## ファイル構成

```
web-tray-app/
├── main.js          # Electronメインプロセス
├── index.html       # レンダラープロセス（GUI）
├── package.json     # 依存関係とスクリプト
└── README.md        # このファイル
```

## セットアップ手順

### 1. 依存関係インストール
```bash
cd web-tray-app
npm install
```

### 2. 起動
```bash
npm start
```

### 3. システムトレイ操作
- **左クリック**: ウィンドウの表示/非表示切り替え
- **右クリック**: メニュー表示（Toggle Window / Show Window / Exit）

## 開発モード設定

### ウィンドウサイズ調整（main.js:11）
```javascript
width: 900, // 開発用: 900px / 本番用: 150px
```

### デベロッパーツール（main.js:29）
```javascript
mainWindow.webContents.openDevTools(); // 開発時のみ
```

## 技術仕様

### 依存関係
- **electron**: ^37.3.1
- **canvas**: ^3.2.0 （システムトレイアイコン生成用）

### セキュリティ設定
```javascript
webPreferences: {
    nodeIntegration: true,
    contextIsolation: false,
    enableRemoteModule: true
}
```

### クリップボード実装
```javascript
// メイン機能
const { clipboard } = window.require('electron');
clipboard.writeText(text);

// フォールバック
navigator.clipboard.writeText(text);
```

## トラブルシューティング

### よくある問題

#### 1. ボタンが反応しない
**原因**: JavaScriptの構文エラー  
**解決**: コンソール（F12）でエラーを確認

#### 2. クリップボードにコピーされない
**原因**: Electron APIアクセス権限  
**解決**: `window.require('electron')` の使用を確認

#### 3. システムトレイアイコンが表示されない
**原因**: canvas依存関係の不足  
**解決**: `npm install canvas` を実行

### デバッグ方法
```bash
# 1. コンソール確認
F12 → Console タブ

# 2. エラーログ確認
npm start 実行時の出力を確認

# 3. プロセス強制終了
taskkill /F /IM electron.exe /T
```

## バージョン履歴

### v1.02（最新）
- ✅ クリップボード機能修正
- ✅ 視覚的フィードバック追加（緑色ボタン効果）
- ✅ JavaScript構文エラー修正
- ✅ 開発用ウィンドウサイズ拡大（900px）

### v1.01
- ✅ 基本機能実装
- ✅ システムトレイ機能
- ✅ タブ切り替え機能

### v1.00
- ✅ 初期バージョン

## カスタマイズ

### プロンプト追加方法
`index.html` の `prompts` オブジェクトに追加：
```javascript
const prompts = {
    'new-prompt': 'カスタムプロンプトテキスト：\n\n',
    // ...既存プロンプト
};
```

### やらかしアイテム編集
現在は `alert()` による簡易実装。今後詳細編集機能を追加予定。

## 本番環境への移行

### 1. 開発設定を本番用に変更
```javascript
// main.js
width: 150,        // 900 → 150
resizable: false,  // true → false
// mainWindow.webContents.openDevTools(); // コメントアウト
```

### 2. パッケージ化（オプション）
```bash
npm install electron-builder --save-dev
# package.json にビルド設定追加後
npm run build
```

---

## 連絡先
開発者: Claude Code Assistant  
バージョン: v1.02  
最終更新: 2025-08-23