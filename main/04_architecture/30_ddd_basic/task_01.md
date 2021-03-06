# DDD 用語説明

## エンティティ・値オブジェクト（バリューオブジェクト）

- いずれもドメインモデルを表現する「モノ」だが、同一性の判定方法が異なる
  - エンティティは、識別子で判定する
  - バリューオブジェクトは、属性値で判定する

## 集約

- 必ず守りたい強い整合性を持ったオブジェクトのまとまり
  - 整合性確保が必要なら必ず集約にするというわけではなく、その必要性の強さに基づいて判断する
- 実装上では、トランザクションを必ず１つにすること
  - 集約の中の一部オブジェクトのみの取得/更新は許可しない
- ドメインモデリングにおいて、すべてのオブジェクトはいずれかの集約に所属する

## ユビキタス言語

- 発見したモデルの言葉を、すべての場所で使うという指針指針。
- ユビキタスの意味は「In Everywhere」
  - 開発者だけでなく、ビジネス側の人とも ドキュメントでもコードでも、ということを意味する
  - その実現のために日本語でモデリングした言葉はそのままコードに落とすことはできないため、工夫が必要
    - 代表的なアプローチ
      1. 日本語と英語の対応を決めて変換する
      2. ローマ字表記でコーディングする
      3. 日本語でコーディングする

## 境界づけられたコンテキスト

- あるモデルを、同じ意味で使い続ける範囲を定義するもの
  - モデルを適切な粒度に分解し、精度を上げることが目的

## ドメイン

- ソフトウェアで問題解決しようとする対象領域

## ドメインサービス

- 「ドメインモデルをオブジェクトとして表現するには無理があるもの」を表現するために使う
  - (例)メールアドレスの重複チェック
    - ユーザーオブジェクトは自分のアドレスを知っているが、そのアドレスがすでに使われているかどうかを自己完結で判断できない
  - 可能な限りエンティティ、バリューオブジェクトを使用すべきだが、どうしても避けられない時（集合への操作など）だけ使うようにする

## リポジトリ

- 永続化層へのアクセスを提供する（ドメインオブジェクトの検索、永続化を実装するクラス）
  - インターフェイスはドメイン層で定義する
  - 実装クラスをインフラ層に定義する
  - 基本は集約単位で１つだけ（リポジトリとの接点は集約内のルートだけ）
    - 集約内の子オブジェクトのために別途定義したりはしない
      - 集約内では、子オブジェクトはルートオブジェクト内でインスタンス参照した状態で扱われるため

## アプリケーション（ユースケース層）

- レイヤーのひとつで、ユーザの要求に対するシステムの振る舞いを定義する
  - 「実装上どのように実現するか (How)」ではなく「何をしたいか (What)」だけを示すことが責務
  - 実装レベルでは、下記クラスを実装する
    - ドメインオブジェクト（エンティティ、バリューオブジェクト、ドメイン知識）の生成、使用、永続化依頼
    - ドメインオブジェクトからプレゼンテーション層に渡す値への変換

## CQS/CQRS

- オブジェクトのメソッドを２つに分ける考え方
  1. クエリ（問い合わせ）：結果を返し、システムの状態を変更しない（副作用がない）
  2. コマンド：システムの状態を変更し、値を返さない（副作用がある）

### CQS： コマンドクエリ分離原則(Command-Query Separation:CQS)

- 上記の分類をオブジェクト指向としてメソッドレベルで定義したもの

### CQRS： コマンドクエリ責務分離原則(Command-Query Responsibility Segregation:CQRS)

- 上記の分類をアーキテクチャレベルで定義したもの

## DTO

- DDD の前提として、ドメインオブジェクトはアプリケーション層（ユースケース層）より外のレイヤに流出させたくない
  - (例)コントローラーや UI からドメインオブジェクトのメソッドをコールしちゃうと意図しないバグになる
- でもドメインオブジェクトの値だけ、UI で使いたいこともある
- そこで Data Transfer Object
  - これ自体はプレーンオブジェクトで、値だけしか入っていない
    - 対象のドメインオブジェクトと同じ（もしくは必要な）値を持つオブジェクトを定義し、イニシャライザで対象オブジェクトからデータを注入する
