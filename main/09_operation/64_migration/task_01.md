# 課題 1：質問

## Expand and contract pattern とは

> The expand and contract pattern is a process that database administrators and software developers can use to transition data from an old data structure to a new data structure without affecting uptime. It works by applying changes through a series of discrete steps designed to introduce the new structure in the background, prepare the data for live usage, and then switch over to the new structure seamlessly.

> This process can be used to make changes to many in-use interfaces, but it is especially helpful for database schema changes. Beyond just migrating data and clients to a new data structure, the expand and contract pattern is also helpful in that it allows you to rollback changes easily at most points in the process if something doesn't go as planned or if your requirements change.

- 稼働時間に影響を与えずに古いデータ構造から新しいデータ構造へデータを移行するために使用できるプロセス
- バックグラウンドで新しい構造を導入し、データをライブで使用できるように準備し、その後シームレスに新しい構造に切り替えるように設計された一連の個別のステップを通じて変更を適用すること
- 特にデータベーススキーマの変更に便利
- プロセスのほとんどの段階で簡単に変更をロールバックできる点でも有用

### やり方

**Step1: 新しいスキーマの実装とデプロイ**

既存の構造を残置して、新しいスキーマを追加すること。

**Step2: インターフェイスを拡張する**

読み取りは既存のスキーマからのみ行う。書き込みは既存のスキーマ・新しいスキーマへ同時に行う。クライアントの外部動作は全く同じままにしておく。

**Step3: データを移行する【重要】**

既存のスキーマから新しいスキーマへデータを移していく（データ型の変更、値の分割、デフォルト値の埋め戻しなどを含む）。

単純な操作の場合もあれあば、 `name` カラムを `first_name` , `last_name` に分割するときに、スクリプトがその境目を明確に発見するのが難しいかもしれない。時間をかけるべし。

**Step4: テスト**

クエリとクライアントが並走するようになったので、ここで期待通りの結果が出せることをテストする。

動作確認は当然のことながら、パフォーマンスを確認する機能テストまで行えれば良い。本番トラフィックに影響がないよう、レプリケーションサーバーでテストする方法もある。ここでインデックスの構築やクエリの変更など、必要に応じて行う。

**Step5: 新しいスキーマから読み込みを行うように切り替える**

旧スキーマへの書き込みは残しつつ、旧スキーマへの読み込みは停止して、責務を新しいスキーマに完全に移行する。

**Step6: 旧スキーマへの書き込みを停止する**

**Step7: 旧スキーマの削除**

[Using the expand and contract pattern | Prisma's Data Guide](https://www.prisma.io/dataguide/types/relational/expand-and-contract-pattern)

## マイグレーションが開発環境で成功し、本番環境で失敗するパターンの対策

**パターン 1：既存カラムに NOT NULL 制約を追加したいときなど**

⇨ 既存データが NULL になっていることが考えられるので、デフォルトの初期値を設定する

> often, you may need to modify the data in some way to account for the differences between the two schemas. This might involve modifying data types, splitting up values, backfilling default values, and more.

[Using the expand and contract pattern | Prisma's Data Guide](https://www.prisma.io/dataguide/types/relational/expand-and-contract-pattern#step-3-migrate-existing-data-to-the-new-schema)
