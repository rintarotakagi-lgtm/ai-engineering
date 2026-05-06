import type { Lesson } from "@/lib/types";

const lesson: Lesson = {
  slug: "python-exceptions",
  title: "例外処理",
  subtitle: "try / except / finally・カスタム例外・raise",
  sections: [
    {
      id: "try-except",
      title: "try / except の基本",
      blocks: [
        {
          type: "text",
          content: `**例外**とはプログラム実行中に発生するエラーのことです。例外を処理しないとプログラムが停止します。

**try / except で例外を捕捉：**

\`\`\`python
try:
    x = int(input("数値を入力: "))
    result = 10 / x
    print(f"10 / {x} = {result}")
except ValueError:
    print("数値を入力してください")
except ZeroDivisionError:
    print("0では割れません")
except Exception as e:
    print(f"予期しないエラー: {e}")
else:
    print("正常に終了しました")  # 例外が発生しなかった場合
finally:
    print("終了処理（常に実行）")  # 必ず実行される
\`\`\`

**よく遭遇する組み込み例外：**

| 例外 | 発生する状況 |
|------|------------|
| \`ValueError\` | 型は正しいが値が不正（int("abc")） |
| \`TypeError\` | 型が不正な操作（1 + "a"） |
| \`KeyError\` | 辞書に存在しないキー |
| \`IndexError\` | リストの範囲外インデックス |
| \`AttributeError\` | 存在しない属性へのアクセス |
| \`FileNotFoundError\` | ファイルが見つからない |
| \`ZeroDivisionError\` | 0での除算 |`,
        },
        {
          type: "code-runner",
          initialCode: `def safe_divide(a, b):
    try:
        return a / b
    except ZeroDivisionError:
        return None
    except TypeError as e:
        print(f"型エラー: {e}")
        return None

print(safe_divide(10, 2))
print(safe_divide(10, 0))
print(safe_divide(10, "2"))

# 複数のテストケース
test_cases = [(10, 2), (7, 0), (9, 3), ("x", 2)]
for a, b in test_cases:
    result = safe_divide(a, b)
    if result is not None:
        print(f"{a} / {b} = {result}")`,
        },
      ],
    },
    {
      id: "raise-custom",
      title: "raise とカスタム例外",
      blocks: [
        {
          type: "text",
          content: `**raise — 意図的に例外を発生させる：**

\`\`\`python
def set_age(age: int) -> None:
    if age < 0:
        raise ValueError(f"年齢は0以上である必要があります: {age}")
    if age > 150:
        raise ValueError(f"不正な年齢: {age}")

try:
    set_age(-5)
except ValueError as e:
    print(e)  # → 年齢は0以上である必要があります: -5
\`\`\`

**カスタム例外 — 独自の例外クラスを作る：**

\`\`\`python
class AppError(Exception):
    """アプリケーション基底例外"""
    pass

class ValidationError(AppError):
    """バリデーションエラー"""
    def __init__(self, field: str, message: str):
        self.field = field
        self.message = message
        super().__init__(f"[{field}] {message}")

class NotFoundError(AppError):
    """リソースが見つからない"""
    def __init__(self, resource: str, id: int):
        super().__init__(f"{resource} (id={id}) が見つかりません")

try:
    raise ValidationError("email", "メールアドレスの形式が不正です")
except ValidationError as e:
    print(f"フィールド: {e.field}")
    print(f"メッセージ: {e.message}")
\`\`\``,
        },
        {
          type: "code-runner",
          initialCode: `class InsufficientFundsError(Exception):
    def __init__(self, amount: float, balance: float):
        self.amount = amount
        self.balance = balance
        super().__init__(
            f"残高不足: {amount:,.0f}円の引き出しに対して残高{balance:,.0f}円"
        )

class BankAccount:
    def __init__(self, owner: str, balance: float = 0):
        self.owner = owner
        self._balance = balance

    def withdraw(self, amount: float) -> float:
        if amount <= 0:
            raise ValueError("引き出し金額は正の数である必要があります")
        if amount > self._balance:
            raise InsufficientFundsError(amount, self._balance)
        self._balance -= amount
        return self._balance

acc = BankAccount("Alice", 10000)

for amount in [3000, 20000, -500, 5000]:
    try:
        remaining = acc.withdraw(amount)
        print(f"{amount:,.0f}円引き出し → 残高: {remaining:,.0f}円")
    except InsufficientFundsError as e:
        print(f"❌ {e}")
    except ValueError as e:
        print(f"⚠️ {e}")`,
        },
      ],
    },
    {
      id: "exception-chaining",
      title: "例外チェーンとコンテキスト",
      blocks: [
        {
          type: "text",
          content: `**例外チェーン — 元の例外を保持したまま別の例外を投げる：**

\`\`\`python
def load_config(path: str) -> dict:
    try:
        with open(path) as f:
            import json
            return json.load(f)
    except FileNotFoundError as e:
        raise RuntimeError(f"設定ファイルが見つかりません: {path}") from e
    except json.JSONDecodeError as e:
        raise RuntimeError(f"設定ファイルの形式が不正です: {path}") from e
\`\`\`

\`from e\` を付けることで、元の例外（\`__cause__\`）が保持され、デバッグしやすくなります。

**例外を握りつぶさない：**

\`\`\`python
# 悪い例（すべての例外を無視する）
try:
    risky_operation()
except Exception:
    pass  # ← 絶対NG。バグを隠す

# 良い例（ログを残してから再投げ or 適切に処理）
try:
    risky_operation()
except Exception as e:
    logger.error(f"エラーが発生: {e}")
    raise  # 元の例外を再投げ
\`\`\`

**EAFP vs LBYL：**

\`\`\`python
# LBYL（事前チェック — 他言語でよく見るスタイル）
if "key" in d:
    value = d["key"]

# EAFP（Pythonic — とりあえず試みて例外を捕捉）
try:
    value = d["key"]
except KeyError:
    value = default
\`\`\`
Pythonは EAFP スタイルを好む傾向があります。`,
        },
        {
          type: "code-runner",
          initialCode: `# よくある変換処理での例外処理
def parse_int(s: str, default: int = 0) -> int:
    try:
        return int(s)
    except (ValueError, TypeError):
        return default

# テスト
inputs = ["42", "3.14", "abc", None, "100"]
for inp in inputs:
    result = parse_int(inp, default=-1)
    print(f"parse_int({inp!r}) = {result}")

# 複数の変換をまとめて処理
def parse_record(data: dict) -> dict:
    errors = []
    result = {}

    try:
        result["age"] = int(data.get("age", ""))
    except (ValueError, TypeError):
        errors.append("age: 整数が必要です")

    try:
        result["score"] = float(data.get("score", ""))
    except (ValueError, TypeError):
        errors.append("score: 数値が必要です")

    if errors:
        raise ValueError("\\n".join(errors))
    return result

try:
    print(parse_record({"age": "25", "score": "98.5"}))
    print(parse_record({"age": "abc", "score": "xyz"}))
except ValueError as e:
    print(f"バリデーションエラー:\\n{e}")`,
        },
        {
          type: "quiz",
          data: {
            question: "finally ブロックが実行されるのはいつ？",
            options: [
              "例外が発生したときのみ",
              "例外が発生しなかったときのみ",
              "try ブロックが正常終了したときも例外発生時も常に",
              "return 文が実行されたときのみ",
            ],
            answer: 2,
            explanation: "finally は「常に実行される」ブロックです。例外の有無に関わらず、return や break があっても必ず実行されます。ファイルのクローズやDB接続の解放など、必ず行いたいクリーンアップ処理に使います。",
          },
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
            question: "int(\"abc\") で発生する例外は？",
            options: ["TypeError", "ValueError", "AttributeError", "KeyError"],
            answer: 1,
            explanation: "int() に変換できない文字列を渡すと ValueError が発生します。TypeError は型自体が不正な場合（int(None) など）です。",
          },
        },
      ],
    },
    {
      id: "challenges",
      title: "チャレンジ",
      blocks: [
        {
          type: "challenge" as const,
          data: {
            title: "例外処理で安全な割り算を作ろう",
            description: "safe_divide(a, b) を定義してください。b が 0 の場合は ZeroDivisionError をキャッチして None を返し、それ以外は a / b を返すこと。",
            starterCode: `def safe_divide(a, b):
    try:
        return a / b
    except ???:
        return None

print(safe_divide(10, 2))
print(safe_divide(7, 0))
print(safe_divide(9, 3))`,
            hint: "except ZeroDivisionError: でゼロ除算エラーをキャッチする",
            expectedOutput: "5.0\nNone\n3.0\n",
          },
        },
        {
          type: "challenge" as const,
          data: {
            title: "カスタム例外を作ろう",
            description: "年齢が 0 未満または 150 超の場合に raise する InvalidAgeError 例外クラスを作り、validate_age(age) 関数で使用してください。",
            starterCode: `class InvalidAgeError(???):
    pass

def validate_age(age):
    if age < 0 or age > 150:
        raise InvalidAgeError(f"無効な年齢: {age}")
    return age

try:
    print(validate_age(25))
    print(validate_age(-1))
except InvalidAgeError as e:
    print(f"エラー: {e}")`,
            hint: "カスタム例外は Exception を継承する。raise で例外を発生させる",
            expectedOutput: "25\nエラー: 無効な年齢: -1\n",
          },
        },
        {
          type: "challenge" as const,
          data: {
            title: "finally を使おう",
            description: "try ブロックで 10/x を計算し、ZeroDivisionError は \"割り算エラー\" と出力し、finally で必ず \"処理終了\" と出力する関数 process(x) を定義してください。",
            starterCode: `def process(x):
    try:
        result = 10 / x
        print(f"結果: {result}")
    except ???:
        print("割り算エラー")
    finally:
        print("処理終了")

process(2)
print("---")
process(0)`,
            hint: "finally は例外が発生しても必ず実行される",
            expectedOutput: "結果: 5.0\n処理終了\n---\n割り算エラー\n処理終了\n",
          },
        },
      ],
    },
  ],
};

export default lesson;
