# モンテイア｜予約管理システム

架空のレストラン「モンテイア」の店内用予約管理システムを題材にした、謎解きイベント用のWebサイトです。
HTML・CSS・JavaScriptで動作します。実際の予約受付や個人情報の取得・送信は行いません。

## 手元で起動する

Python 3 が使える環境で、リポジトリのディレクトリから次のコマンドを実行します。

```bash
python3 -m http.server 8000 --directory dist
```

ブラウザで `http://localhost:8000` を開いてください。
JavaScriptのESモジュールを使うため、HTMLファイルを直接開かず、HTTPサーバー経由で実行します。
依存ライブラリのインストールやビルドは不要です。

## GitHub Pages

`main` ブランチへの更新を契機に、GitHub Actionsが `dist/` の内容を公開します。
公開設定は **Settings → Pages → Source: GitHub Actions** です。
