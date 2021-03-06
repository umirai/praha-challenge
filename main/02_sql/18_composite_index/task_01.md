# 問題回答

### 1. 複合インデックスの仕組みを易しく説明

複合インデックスというのは、複数カラムを組み合わせて１つのインデックスにしているんだよ。条件Aに合致するレコードを走査するのがインデックス、条件AかつBに合致するレコードを走査するのが複合インデックス。後者の方が母数は少なくなるから効率がいいんだよ。ただし注意点はいくつかある。

### 2. 複合インデックスの作り直し

>「姓名を合わせた検索、あるいは姓だけの検索が多い」サービスで、`CREATE INDEX employees_name ON employees (first_name, last_name);` とした場合、姓だけの検索でフルテーブルスキャンになってしまう・・・

**1. どういうことか？**

複合インデックスは、同じカラムの組み合わせでも順番によって作成されるインデックスの構造が異なる（＝複合インデックスのカラム順には意味がある）。よって姓名を合わせた検索で複合インデックスを利用できても、姓だけの検索、名だけの検索でそれぞれインデックスを利用できるわけではない。現在の複合インデックスを用いてクエリを実行した場合の具体例を示す。


```sql
-- 姓名を合わせた検索（複合インデックスを利用できる）
SELECT * FROM employees WHERE first_name = 'shinya' AND last_name = 'kato';

-- 姓だけの検索（インデックスを利用できない）
SELECT * FROM employees WHERE last_name = 'kato';

-- 名だけの検索（インデックスを利用できる）
SELECT * FROM employees WHERE first_name = 'shinya';
```

インデックスの先頭カラムが `first_name` カラムなので、姓だけの検索にはインデックスを利用できない。

<br>

**2. 複合インデックスを使う場合、どう作り直せば良いのか？**

現時点でも複合インデックスは利用できるので作り直す必要はない。ただ、姓名を合わせた検索と、姓だけの検索に対応するには下記の通り作り直す。

```sql
-- first_name と last_name の順番を入れ替え
CREATE INDEX employee_name ON employees (last_name, first_name);
```


---

**自分用メモ**
- 複合インデックスのカラム順には意味があるため、検索条件の組み合わせによっては複合インデックスが利用されない
- 先頭のカラムで走査対象を絞り込むほど最終的な検索範囲を狭められる
  - 範囲検索（>,>=,<,<=）より等価検索（=）を先に設定する
  - カーディナリティが高いカラムを先に設定する
- インデックスの構造はカラムがソートされた状態であるため、ソートに関するSQLもインデックスを利用して高速化できるが、ソートの向きによっては複合インデックスが利用されない
  - WHEREとORDERを組み合わせたSQLで有効に働く複合インデックスを作成する場合は『WHEREで利用されているカラム』『ORDERで利用されているカラム』の順にするとよい


**参照**
- [わかりやすかった記事１](https://nishinatoshiharu.com/overview-multicolumn-indexes/)
- [わかりやすかった記事２](https://www.gatc.jp/gat/it/it02dbindex.html)