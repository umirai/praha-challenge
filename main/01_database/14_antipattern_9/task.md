## 1. 次の場面で、DB の機能（Check, Enum, Domain, Trigger）を使って、データ仕様を制限すべきかどうか。User エンティティが用意されていると仮定。

1. 「mailAddress」カラムには、特定のドメインを持ったメールアドレスしか登録できない。Check 制約を使うべきか。

- no
- ゆくゆく変化する可能性ある
- 入力時点でドメインを固定にした方が UI 上いいのでは
  - フォームで入力完了したのに弾かれたら、最初から教えてくれ！となる
  - 複数のドメインを受け付けるならセレクター使って、テーブルではドメインエンティティを作ってしまう

2. ユーザー退会時、User からレコードを削除し、同じ情報を WithdrawnUser に挿入しなければいけない。Trigger を使うべきか。

- yes
- ただし連鎖的にトリガーを引く場合はスパゲッティにならないように注意
- trigger 使うとビジネスロジックが見えにくくなるのでそれも注意

3. 「gender」カラムには「male」「female」「no response」いずれかの値しか入れてはいけない。Enum を使うべきか。

- yes だけど基本は no
- 機能上使い方は合っているが・・・
  - enum 使うとアンチパターン（31 フレーバー）に陥りかねない
  - gender エンティティ作ったほうがいい

4. 「postCode」カラムには特定形式の文字列しか入れてはいけない。Domain を使うべきか。

- yes であり no（場合による）
- DB の機能上は domain で対応できるが・・・
  - 仮に海外からの登録があった場合、zip-code の桁数が１パターンとは限らない？
  - varchar でいいのでは・・・

5. これらの制約をアプリケーション側で課すアプローチと、データベース側で制約を課すアプローチがある。どちらをどのような時に採用するべきか。

- アプリケーション側のルールはマナー、DB 側のルールは規約
  - データ上整合性を確実に担保しなければならない場合は DB 上で
  - ユーザーへの親切心（UX）向上のためであればアプリケーション上で
  - とはいえ Check 制約、Enum 制約はデメリットの方が多い印象

## 2. 同様のアンチパターンに陥りそうな例を考える

- どのアンチパターンのこと言ってるかわかんないけど（笑）
  - 3 なら・・・ユーザーのステータスを Enum 管理したり
  - 4 なら・・・電話番号とか
