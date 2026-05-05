import type { Lesson } from "@/lib/types";

const lesson: Lesson = {
  slug: "python-testing",
  title: "テスト（pytest）",
  subtitle: "ユニットテスト・フィクスチャ・parametrize・モック",
  sections: [
    {
      id: "why-test",
      title: "なぜテストを書くのか",
      blocks: [
        {
          type: "text",
          content: `**テストを書く理由：**

1. **バグを早期に発見** — 変更のたびに手動確認するより、自動テストの方が速くて確実
2. **安心してリファクタリングできる** — テストがあれば「動作が変わっていないか」を即座に確認できる
3. **ドキュメントになる** — テストコードは「この関数は何をするか」の具体例

**pytest — Python の標準的なテストフレームワーク：**

\`\`\`bash
uv add --dev pytest
uv run pytest
\`\`\`

**最もシンプルなテスト：**

\`\`\`python
# test_math.py
def add(a, b):
    return a + b

def test_add_positive():
    assert add(1, 2) == 3

def test_add_negative():
    assert add(-1, -2) == -3

def test_add_zero():
    assert add(0, 0) == 0
\`\`\`

ルール：
- ファイル名は \`test_*.py\` または \`*_test.py\`
- テスト関数は \`test_\` で始まる
- \`assert\` で期待値を検証する

\`uv run pytest\` を実行すると、これらのテストが全て自動で実行されます。`,
        },
        {
          type: "code-runner",
          initialCode: `# pytest を使わなくてもassertでテストの考え方を学べます

def add(a, b):
    return a + b

def divide(a, b):
    if b == 0:
        raise ZeroDivisionError("0で割れません")
    return a / b

# テストケース
def test_add():
    assert add(1, 2) == 3
    assert add(-1, 1) == 0
    assert add(0, 0) == 0
    print("✅ test_add: PASSED")

def test_divide():
    assert divide(10, 2) == 5.0
    assert divide(7, 2) == 3.5
    print("✅ test_divide: PASSED")

def test_divide_by_zero():
    try:
        divide(10, 0)
        assert False, "例外が発生すべきでした"
    except ZeroDivisionError:
        print("✅ test_divide_by_zero: PASSED")

test_add()
test_divide()
test_divide_by_zero()`,
        },
      ],
    },
    {
      id: "pytest-features",
      title: "pytest の主要機能",
      blocks: [
        {
          type: "text",
          content: `**例外のテスト：**

\`\`\`python
import pytest

def divide(a, b):
    if b == 0:
        raise ZeroDivisionError("0で割れません")
    return a / b

def test_divide_by_zero():
    with pytest.raises(ZeroDivisionError, match="0で割れません"):
        divide(10, 0)
\`\`\`

**@pytest.mark.parametrize — 複数のケースを1つのテストで：**

\`\`\`python
import pytest

@pytest.mark.parametrize("a, b, expected", [
    (1, 2, 3),
    (-1, 1, 0),
    (0, 0, 0),
    (100, -50, 50),
])
def test_add(a, b, expected):
    assert add(a, b) == expected
\`\`\`

**フィクスチャ — テストの前処理・後処理：**

\`\`\`python
import pytest

@pytest.fixture
def sample_users():
    """テスト用のユーザーデータ"""
    return [
        {"id": 1, "name": "Alice", "role": "admin"},
        {"id": 2, "name": "Bob",   "role": "user"},
    ]

def test_find_admin(sample_users):
    admins = [u for u in sample_users if u["role"] == "admin"]
    assert len(admins) == 1
    assert admins[0]["name"] == "Alice"

@pytest.fixture(scope="session")
def db_connection():
    """セッション全体で1回だけ接続を確立"""
    conn = create_connection()
    yield conn          # テスト実行中はここで停止
    conn.close()        # テスト後にクリーンアップ
\`\`\``,
        },
        {
          type: "code-runner",
          initialCode: `# パラメータ化テストの考え方を実装

def is_palindrome(s: str) -> bool:
    """回文かどうかを判定"""
    cleaned = s.lower().replace(" ", "")
    return cleaned == cleaned[::-1]

# テストケース
test_cases = [
    ("racecar", True),
    ("hello", False),
    ("A man a plan a canal Panama", True),
    ("Was it a car or a cat I saw", True),
    ("Python", False),
    ("", True),
    ("a", True),
]

passed = 0
failed = 0

for text, expected in test_cases:
    result = is_palindrome(text)
    status = "✅" if result == expected else "❌"
    if result == expected:
        passed += 1
    else:
        failed += 1
    print(f"{status} is_palindrome({text!r}) → {result} (expected {expected})")

print(f"\\n合計: {passed}件成功, {failed}件失敗")`,
        },
      ],
    },
    {
      id: "mocking",
      title: "モック（unittest.mock）",
      blocks: [
        {
          type: "text",
          content: `**モック**は外部依存（API、DB、ファイルなど）をテスト用の偽物に置き換えます。

\`\`\`python
from unittest.mock import Mock, patch, MagicMock

# Mockオブジェクト
m = Mock()
m.method.return_value = 42
print(m.method())  # → 42
m.method.assert_called_once()  # 呼ばれたか確認

# @patch で特定の関数を置き換え
def get_user(user_id: int) -> dict:
    response = requests.get(f"/api/users/{user_id}")  # 実際のAPIコール
    return response.json()

from unittest.mock import patch

def test_get_user():
    with patch("requests.get") as mock_get:
        # モックの返り値を設定
        mock_get.return_value.json.return_value = {"name": "Alice", "age": 25}

        result = get_user(1)

        assert result["name"] == "Alice"
        mock_get.assert_called_once_with("/api/users/1")
\`\`\`

**テストの設計原則（FIRST）：**

- **F**ast — テストは素早く実行できる
- **I**solated — テスト同士が独立している
- **R**epeatable — 何度実行しても同じ結果
- **S**elf-validating — テスト自身が成功/失敗を判定できる
- **T**imely — 実装と同時か直後に書く`,
        },
        {
          type: "code-runner",
          initialCode: `from unittest.mock import Mock, patch

# モックを使ったテストの例

class EmailService:
    def send(self, to: str, subject: str, body: str) -> bool:
        # 実際のメール送信（テストで呼びたくない）
        raise NotImplementedError("実際には送信しない")

class UserRegistration:
    def __init__(self, email_service: EmailService):
        self.email_service = email_service
        self.users = []

    def register(self, name: str, email: str) -> dict:
        user = {"name": name, "email": email, "id": len(self.users) + 1}
        self.users.append(user)
        self.email_service.send(
            to=email,
            subject="登録完了",
            body=f"ようこそ、{name}さん！"
        )
        return user

# モックを使ってテスト
mock_email = Mock(spec=EmailService)
mock_email.send.return_value = True

reg = UserRegistration(mock_email)
user = reg.register("Alice", "alice@example.com")

print(f"登録されたユーザー: {user}")
print(f"メール送信の呼び出し: {mock_email.send.called}")

# 引数の確認
call_args = mock_email.send.call_args
print(f"宛先: {call_args.kwargs.get('to') or call_args[1].get('to', call_args[0][0])}")`,
        },
        {
          type: "quiz",
          data: {
            question: "テストでモックを使う主な理由は？",
            options: [
              "テストの実行速度を上げるため",
              "外部依存（API・DB など）を本物の代わりに使い、テストを独立させるため",
              "コードの品質を上げるため",
              "モックはコードを自動生成するため",
            ],
            answer: 1,
            explanation: "モックは外部サービス（APIコール、DBアクセス、ファイルシステムなど）をテスト用の偽物で置き換えます。これにより、(1) 外部サービスが不要なのでテストが速い、(2) ネットワーク障害などで失敗しない、(3) 特定のレスポンスを意図的に設定できる、という利点があります。",
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
            question: "pytest でテスト関数を認識させるためのルールは？",
            options: [
              "関数名が test で終わる",
              "関数名が test_ で始まる",
              "@pytest.test デコレータを付ける",
              "TestCase クラスを継承する",
            ],
            answer: 1,
            explanation: "pytest は test_ で始まる関数を自動的にテストとして認識します。ファイルも test_*.py または *_test.py でなければなりません。クラスベースのテストを書く場合はクラス名を Test で始める必要があります。",
          },
        },
      ],
    },
  ],
};

export default lesson;
