## 必要な機能

- 閾値を超えた場合に通知を行う
- エラー発生時の状況を再現（確認）する
- クラッシュ時に再起動する

---

## フロントエンド

### 一定期間で一定数以上クラッシュしていたら通知

- LogLocket ｜ Timeseries Alerting

  [Timeseries Alerting](https://docs.logrocket.com/docs/metrics-alerting)

- Datadog ｜監査証跡モニター

  [監査証跡モニター](https://docs.datadoghq.com/ja/monitors/create/types/audit_trail/)

### エラー発生時にユーザーの作業手順や実行環境を通知

- LogLocket ｜ Session Replay【※ 動画で再現できるとか最強かよ・・・】

  [Comparisons](https://docs.logrocket.com/docs/comparisons#session-replay)

- Datadog ｜リアルユーザーモニタリング（RUM）

  [RUM & セッションリプレイ](https://docs.datadoghq.com/ja/real_user_monitoring/)

## バックエンド

### クラッシュ時に再起動と通知

- AWS CloudWatch ｜ EC2 アクション

  [EC2 インスタンスを停止、終了、再起動、または復旧するアラームを作成する](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/UsingAlarmActions.html#AddingRebootActions#AddingRebootActions)

### レスポンスが遅い API を可視化

- Datadog ｜ HTTP テスト

  [HTTP テスト](https://docs.datadoghq.com/ja/synthetics/api_tests/http_tests/?tab=%E3%83%AA%E3%82%AF%E3%82%A8%E3%82%B9%E3%83%88%E3%82%AA%E3%83%97%E3%82%B7%E3%83%A7%E3%83%B3)

## データベース

### スロークエリを可視化【※ AWS RDS を使用している前提】

- Datadog ｜データベースモニタリング

  [Postgres の設定](https://docs.datadoghq.com/ja/database_monitoring/setup_postgres/)

- AWS CloudWatch + AWS SNS + AWS Chatbot

  [Cloudwatch のアラートを Slack へ通知する｜株式会社しずおかオンライン](https://www.esz.co.jp/blog/2874.html)

## それ以外に監視した方がいいもの

**上記に挙げられていないものはこれ：**

- DB のエラー
- フロントエンドのパフォーマンス

|                | エラー | パフォーマンス |
| -------------- | ------ | -------------- |
| バックエンド   | ◯      | ◯              |
| データベース   | 🌟     | ◯              |
| フロントエンド | ◯      | 🌟             |

## まとめ

- Datadog はいろいろできて全部盛りという感じ
- AWS に閉じることもできるにはできる
- ただしフロントエンドとバックエンドのモニタリングはいろいろと訳が違いそう

  > Investigating front-end and backend errors are very different processes. Server-side code runs on a single platform. Often, the only state in the system that can cause hard-to-reproduce errors comes from easily logged events like database or cache queries. When an unhandled exception in server code takes place, it usually means there is a clear-cut problem that needs to be fixed. (フロントエンドとバックエンドのエラーの調査は、非常に異なるプロセスです。サーバーサイドのコードは、単一のプラットフォーム上で実行されます。多くの場合、再現が困難なエラーを引き起こす可能性のあるシステムの状態は、データベースやキャッシュのクエリのような簡単にログに記録されるイベントから来るものだけです。サーバーコードで処理されない例外が発生した場合、それは通常、修正すべき明確な問題があることを意味します。）

  > On the front-end, things aren’t so simple. The average web application runs in over 15 different browsers, across hundreds of device types. State can be highly complex, coming from memory, local storage, local databases, service workers, and APIs. A web app must be robust to connectivity issues and cross-browser differences, and unlike the backend where exceptions are usually clear-cut, it can be tricky to gauge the impact on the frontend. (フロントエンドでは、物事はそれほど単純ではありません。平均的なウェブアプリケーションは、15 種類以上のブラウザで、何百ものデバイスタイプで実行されます。状態は、メモリ、ローカルストレージ、ローカルデータベース、サービスワーカー、API から来る非常に複雑なものになる可能性があります。ウェブアプリケーションは、接続の問題やブラウザ間の差異に対して堅牢でなければなりませんが、例外が通常明確であるバックエンドとは異なり、フロントエンドへの影響を判断するのは難しい場合があります。)

  [Comparisons](https://docs.logrocket.com/docs/comparisons#exception-trackers)

  - 加えてフロントエンドのモニタリングで焦点をあてているのは「機能障害」だけではなく CV 率などビジネスに直結する要素を分析しようという側面が強い
  - 今回は LogLocket しか詳しく見なかったが、だからこそたくさんのモニタリング SaaS があった（以下は海外でシェアが大きいもの）
    - [FullStory](https://www.fullstory.com/)
    - [Smartlook](https://www.smartlook.com/)
    - [Hatjar](https://www.hotjar.com/)
    - 他にもいっぱい・・・

## 補足

今回挙げたのは全てクラウドだったが・・・

> 重要な監視ツールですが、歴史は長く、今まで様々なものが開発され使用されてきました。そんな中で生き残っているツールは大きく２つのタイプに分けることができます。

> 一つは監視サーバーも、その上で動作する監視システムもどちらも自分で用意する必要があるタイプのものです。現在ユーザー数が多いのは Zabbix、Nagios、Prometheus(Grafana 併用)などで、OSS が多く、利用料金はかかりませんが、監視サーバーの構築や運用の費用はかかります。

> ２つ目のタイプとしては、監視サーバーはサービス提供元で管理し、監視システムだけを使うタイプのものです。AWS が提供する[CloudWatch](https://www.skyarch.net/column/cloudwatch/)や Mackerel、Datadog、Site24x7、System Answer G3 等があります。クラウド上で提供されているサービスなので、簡単に開始することができ、監視サーバーの運用費用がかからないのが大きな利点です。

監視サーバーを自前で用意するという選択肢もある模様

[サーバー監視ツール 3 選と AWS 監視ツールを比較しました | SKYARCH の IT あんちょこ](https://www.skyarch.net/column/monitoring-tool-comparison/)
