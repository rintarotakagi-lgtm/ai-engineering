import type { Lesson } from "@/lib/types";

const lesson: Lesson = {
  slug: "python-errors",
  title: "エラーハンドリング・デバッグ",
  subtitle: "try/except と print/logging で原因を切り分ける",
  sections: [
    {
      id: "intro",
      title: "このレッスンのゴール",
      blocks: [
        {
          type: "text",
          content: `**ゴール：** try/exceptでエラーを捕捉できる。エラーメッセージを読んで原因を特定できる。printとloggingを使い分けられる。

**所要時間：** 約20分

---

プログラムは必ず壊れます。APIがタイムアウトする、ファイルが存在しない、データの形式が想定外——これは異常ではなく日常です。

「エラーが出たとき、どう対処するか」を知っているだけで、Claude Codeへの指示品質が大幅に上がります。`,
        },
      ],
    },
    {
      id: "error-types",
      title: "よく見るエラーの種類",
      blocks: [
        {
          type: "text",
          content: `Pythonのエラーメッセージを読めるようになりましょう。

**SyntaxError** — 文法ミス
\`\`\`
SyntaxError: invalid syntax
→ コロン(:)忘れ、括弧の閉じ忘れなど
\`\`\`

**NameError** — 変数・関数が存在しない
\`\`\`
NameError: name 'usre' is not defined
→ タイポ（user → usre）が原因
\`\`\`

**KeyError** — dictに存在しないキー
\`\`\`
KeyError: 'email'
→ data["email"] でキーが存在しない
\`\`\`

**TypeError** — 型が間違っている
\`\`\`
TypeError: can only concatenate str (not "int") to str
→ "価格: " + 1980 のように str と int を足そうとした
\`\`\`

**AttributeError** — メソッドが存在しない
\`\`\`
AttributeError: 'NoneType' object has no attribute 'get'
→ None に対して .get() を呼んだ（Noneチェック漏れ）
\`\`\`

**requests.exceptions.ConnectionError** — ネットワーク接続失敗
\`\`\`
ConnectionError: HTTPSConnectionPool(...) Max retries exceeded
→ URLが間違い、サーバーがダウン、ネット接続なし
\`\`\``,
        },
        {
          type: "interactive",
          id: "eng-error-flow",
        },
      ],
    },
    {
      id: "try-except",
      title: "try/exceptでエラーを捕捉する",
      blocks: [
        {
          type: "text",
          content: `**try/except** は「エラーが起きても止まらず、対処する」仕組みです。

\`\`\`python
try:
    # エラーが起きそうな処理
    result = 10 / 0
except ZeroDivisionError:
    # エラーが起きたときの対処
    print("0で割ることはできません")
\`\`\`

---

**複数のエラーを捕捉：**

\`\`\`python
import requests

try:
    response = requests.get("https://api.example.com/data", timeout=5)
    response.raise_for_status()  # 4xx, 5xx をエラーとして扱う
    data = response.json()
except requests.exceptions.Timeout:
    print("タイムアウト。後で再試行してください")
except requests.exceptions.HTTPError as e:
    print(f"HTTPエラー: {e.response.status_code}")
except requests.exceptions.ConnectionError:
    print("接続できません。URLを確認してください")
except Exception as e:
    print(f"予期しないエラー: {e}")
finally:
    print("処理完了（成功・失敗にかかわらず実行）")
\`\`\`

---

**辞書のキーを安全に取得：**

\`\`\`python
data = {"name": "田中"}

# NG: KeyErrorが起きる可能性
email = data["email"]

# OK: デフォルト値を使う
email = data.get("email", "未登録")

# OK: try/except
try:
    email = data["email"]
except KeyError:
    email = "未登録"
\`\`\``,
        },
      ],
    },
    {
      id: "debugging",
      title: "デバッグの方法",
      blocks: [
        {
          type: "text",
          content: `**print デバッグ（手軽）：**

\`\`\`python
def process_data(items):
    print(f"[DEBUG] items数: {len(items)}")  # 入力確認

    result = []
    for i, item in enumerate(items):
        print(f"[DEBUG] 処理中 {i}: {item}")  # 途中経過
        processed = transform(item)
        print(f"[DEBUG] 変換後: {processed}")  # 出力確認
        result.append(processed)

    return result
\`\`\`

---

**logging（本格的なログ）：**

\`\`\`python
import logging

# ログの設定（一度だけ）
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s"
)
logger = logging.getLogger(__name__)

def fetch_user(user_id: int):
    logger.info(f"ユーザー取得開始: id={user_id}")

    try:
        response = requests.get(f"/api/users/{user_id}")
        user = response.json()
        logger.info(f"取得成功: {user['name']}")
        return user
    except Exception as e:
        logger.error(f"取得失敗: {e}", exc_info=True)
        return None
\`\`\`

**ログレベル（重要度順）：**
- \`DEBUG\` : 詳細な処理経過
- \`INFO\` : 通常の操作ログ
- \`WARNING\` : 問題ではないが注意
- \`ERROR\` : エラー（処理継続可能）
- \`CRITICAL\` : 致命的エラー（停止）`,
        },
      ],
    },
    {
      id: "quiz-section",
      title: "理解度チェック",
      blocks: [
        {
          type: "quiz",
          data: {
            question: "「AttributeError: 'NoneType' object has no attribute 'get'」の原因として最も可能性が高いのは？",
            options: [
              "getメソッドのスペルが間違っている",
              "変数にNoneが入っているのにメソッドを呼んだ",
              "ネットワーク接続が切れた",
              "Pythonのバージョンが古い",
            ],
            answer: 1,
            explanation: "NoneTypeはNoneの型です。変数がNoneのとき（APIがNoneを返した、初期化し忘れた等）にメソッドを呼ぶとこのエラーが出ます。None チェック（if result is not None:）を入れると解決します。",
          },
        },
        {
          type: "quiz",
          data: {
            question: "try/exceptのfinallyブロックはいつ実行される？",
            options: [
              "エラーが発生したときだけ",
              "エラーがなかったときだけ",
              "エラーの有無にかかわらず必ず実行",
              "プログラム終了時に実行",
            ],
            answer: 2,
            explanation: "finallyは成功・失敗どちらでも実行されます。ファイルを閉じる・DB接続を切断するなどの後始末処理に使います。",
          },
        },
        {
          type: "quiz",
          data: {
            question: "本番環境のログに最も適したのはどれ？",
            options: [
              "print()でターミナルに出力",
              "logging.info/error/warning でログファイルに記録",
              "エラーは無視して続ける",
              "try/exceptなしで動かす",
            ],
            answer: 1,
            explanation: "本番環境ではloggingを使います。ログレベルで重要度を分け、タイムスタンプ付きでファイルに記録できます。printは開発中のデバッグ用で、本番には不適切です。",
          },
        },
      ],
    },
    {
      id: "handson",
      title: "ハンズオン：堅牢なAPIクライアントを作る",
      blocks: [
        {
          type: "text",
          content: `エラーハンドリング付きの実用的なAPIクライアントを作りましょう。

\`\`\`python
# robust_client.py
import requests
import logging
from typing import Optional

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s"
)
logger = logging.getLogger(__name__)

def safe_get(url: str, params: dict = None) -> Optional[dict]:
    """エラーハンドリング付きGETリクエスト"""
    try:
        logger.info(f"リクエスト: {url}")
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()
        logger.info(f"成功: {len(data) if isinstance(data, list) else 'dict'}件")
        return data
    except requests.exceptions.Timeout:
        logger.error("タイムアウト（10秒）")
    except requests.exceptions.HTTPError as e:
        logger.error(f"HTTPエラー: {e.response.status_code}")
    except requests.exceptions.ConnectionError:
        logger.error("接続エラー")
    except Exception as e:
        logger.error(f"予期しないエラー: {e}", exc_info=True)
    return None

# 使用例
posts = safe_get("https://jsonplaceholder.typicode.com/posts", {"userId": 1})
if posts:
    print(f"{len(posts)}件取得")
else:
    print("取得失敗")
\`\`\`

**課題：** 存在しないURL（\`https://this-does-not-exist.example.com\`）でsafe_getを呼んで、ConnectionErrorのログが表示されることを確認してください。`,
        },
      ],
    },
  ],
};

export default lesson;
