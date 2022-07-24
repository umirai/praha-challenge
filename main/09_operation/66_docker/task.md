# 課題 1：質問

## Docker とは何か

開発用の仮想環境改廃を簡単にできる便利な技術だよ！

## 用語説明

- **イメージ：**
  - 仮想環境を立ち上げるための材料になる Read-Only なファイルがレイヤーとして重なりひとまとまりになったもの
- **コンテナ：**
  - 開発を行う仮想環境そのもののこと。基本はこの中でアプリケーションや DB が動いていると考えてよい。作ったり壊したりをコマンドひとつでできる。
- **ベースイメージ：**
  - イメージを作成するための土台イメージ。最小限の機能が備わっているが開発用に必要な設定が施されていないデフォルト版みたいなもの。
  - 例）
    - PHP が公式で配布している `php-apache` というベースイメージについて
    - このイメージを使って立ち上げたコンテナでは、デフォルトで Apache のリダイレクトモジュールとか、DB 用の PDO とか、パッケージマネージャーの composer は入っていない
    - それらが必要な場合、コンテナ起動時のコマンド、Dockerfile などを使ってインストールするか、コンテナ起動後にコンテナに入ってインストールする必要がある
- **Docker レジストリ：**
  - Docker イメージようの GitHub リポジトリみたいなもの。Docker ディストリビューションに統合予定とのこと。
- **ビルドコンテキスト：**
  - ローカルに存在するディレクトリと、コンテナ内におけるデフォルトの作業ディレクトリになるコンテキストのこと。コマンド実行時に Docker デーモンに送られる。
- **マルチステージビルド：**
  - Dockerfile をスリムに最適化するビルド方式。別のイメージを用いて中間作業を行なった上で、最終的に必要なデータだけを残したイメージを作成してビルドする。
    - 公式サンプルの説明
      - Go 言語の例がある
      - Go 言語でビルドしたものは Go 言語がなくても動く
      - つまり Go 言語のビルドまでに使用した Go 言語用のライブラリなどは不要
      - それらのファイルを除いて、ビルド結果だけを持ったイメージを使う
      - これで Dockerfile サイズが大幅に軽くなる

## Dockerfile を作成して環境構築をコード化するメリット

Docker ファイルを引っ張ってきてコマンド叩くだけで、開発環境を共通化できる（＝環境差分を吸収できる）こと

## docker-compose が役立つ場面

アプリケーションサーバーと DB サーバーなど同じネットワーク内で複数サーバーを起動したいとき

## .dockerignore に含めた方がいいファイル

> （ソース・リポジトリを再構築することなく）イメージの構築と無関係のファイル

[Dockerfile のベスト・プラクティス - Docker-docs-ja 20.10 ドキュメント](https://docs.docker.jp/develop/develop-images/dockerfile_best-practices.html#dockerignore)

## Dockerfile 内でパッケージのインストールコマンドを分けたときに問題が起こるかもしれない理由

```bash
# こうじゃなくて
RUN apt-get update
RUN apt-get install -y package-bar
RUN apt-get install -y package-baz
RUN apt-get install -y package-foo

# こうした方がいい理由（推奨される方式「キャッシュ・バスティング」）
RUN apt-get update && apt-get install -y \
    package-bar \
    package-baz \
    package-foo \
```

> イメージが構築されると、レイヤーがすべて Docker のキャッシュに入ります。

> Docker は当初の命令と修正後の命令を見て、同一のコマンドであると判断するので、前回の処理において作られたキャッシュを再利用します。キャッシュされたものを利用して処理を行うため、結果として  **`apt-get update`**は実行  **されません**。**`apt-get update`**を実行しないとは、つまり  **`curl`**にしても  **`nginx`**にしても、古いバージョンのまま利用する可能性が出てきます。

⇨ キャッシュの問題が起こって古いバージョンをインストールされる可能性がある。

### 補足：

docker イメージは（最初に用語説明した通り）レイヤーの重なりでできており、それが重なるのは Dockerfile 内で以下 3 つのコマンドが実行されたタイミングになる。

- `RUN`
- `ADD`
- `COPY`

これらのレイヤーを最小限に抑えることもベストプラクティスとして紹介されていた。

[Dockerfile のベスト・プラクティス - Docker-docs-ja 20.10 ドキュメント](https://docs.docker.jp/develop/develop-images/dockerfile_best-practices.html#run)

## ENV 変数

```bash
# これと
ENV NAME='hoge'

# これの違い
RUN export NAME='hoge'
```

⇨ スコープが異なる

**RUN コマンドを使用しない場合：**

それ以降のレイヤーでもその環境変数は取り出しが可能な状態で保持され続けるため、使い方によってはコンテナ内のソフトウェアバージョンを簡単に変えられてしまうようなリスクもある。

**RUN コマンドを使用する場合：**

上記のようなグローバル変数のような挙動を避けるためには・・・

> **`RUN`**命令でシェルのコマンドを使い、環境変数を実際にアンセットします。ただし、レイヤ内の環境変数の指定とアンセットを、１つのレイヤで指定する必要があります。

```bash
# こんな感じ
RUN export ADMIN_USER="mark" \
    && echo $ADMIN_USER > ./mark \
    && unset ADMIN_USER
```

環境変数の設定とアンセットを必ずワンセットで行わなければならないため、環境変数のスコープをそのレイヤーのみに閉じることができる。

[Dockerfile のベスト・プラクティス - Docker-docs-ja 20.10 ドキュメント](https://docs.docker.jp/develop/develop-images/dockerfile_best-practices.html#env)

# 課題 2：実装

`docker-compose.yml` で既に構築済みなので省略させてください・・・

[https://github.com/umirai/ddd-challenge](https://github.com/umirai/ddd-challenge)
