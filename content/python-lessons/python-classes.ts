import type { Lesson } from "@/lib/types";

const lesson: Lesson = {
  slug: "python-classes",
  title: "クラスとインスタンス",
  subtitle: "クラス定義・__init__・属性・メソッド",
  sections: [
    {
      id: "class-basics",
      title: "クラスの基本",
      blocks: [
        {
          type: "text",
          content: `**クラス**はデータ（属性）と処理（メソッド）をひとまとめにした設計図です。

\`\`\`python
class Dog:
    """犬を表すクラス"""

    def __init__(self, name: str, breed: str):
        self.name = name    # インスタンス属性
        self.breed = breed

    def bark(self):
        return f"{self.name}：ワン！"

    def info(self):
        return f"{self.name}（{self.breed}）"
\`\`\`

**\`__init__\`** はインスタンス生成時に自動的に呼ばれる**初期化メソッド**（コンストラクタ）です。

**\`self\`** はインスタンス自身を指す参照で、メソッドの第1引数に必ず書きます（自動的に渡されます）。

**インスタンスの生成と使い方：**

\`\`\`python
# クラス名() でインスタンス生成
pochi = Dog("ポチ", "柴犬")
koro = Dog("コロ", "プードル")

print(pochi.name)      # → ポチ（属性にアクセス）
print(pochi.bark())    # → ポチ：ワン！
print(koro.info())     # → コロ（プードル）

# 属性の変更
pochi.name = "ポチくん"
print(pochi.name)  # → ポチくん
\`\`\``,
        },
        {
          type: "code-runner",
          initialCode: `class BankAccount:
    def __init__(self, owner: str, balance: float = 0):
        self.owner = owner
        self.balance = balance
        self.history = []

    def deposit(self, amount: float):
        self.balance += amount
        self.history.append(f"+{amount}")

    def withdraw(self, amount: float) -> bool:
        if amount > self.balance:
            print("残高不足")
            return False
        self.balance -= amount
        self.history.append(f"-{amount}")
        return True

    def show(self):
        print(f"{self.owner}の口座: {self.balance:,.0f}円")
        print(f"履歴: {self.history}")

acc = BankAccount("Alice", 10000)
acc.deposit(5000)
acc.withdraw(3000)
acc.withdraw(20000)
acc.show()`,
        },
      ],
    },
    {
      id: "class-attributes",
      title: "クラス属性・クラスメソッド・静的メソッド",
      blocks: [
        {
          type: "text",
          content: `**インスタンス属性 vs クラス属性：**

\`\`\`python
class Counter:
    count = 0   # クラス属性（全インスタンスで共有）

    def __init__(self):
        Counter.count += 1     # クラス属性にアクセス
        self.id = Counter.count  # インスタンス属性

c1 = Counter()
c2 = Counter()
c3 = Counter()
print(Counter.count)  # → 3
print(c1.id, c2.id, c3.id)  # → 1 2 3
\`\`\`

**@classmethod — クラス自体を受け取るメソッド：**

\`\`\`python
class User:
    def __init__(self, name: str, role: str):
        self.name = name
        self.role = role

    @classmethod
    def create_admin(cls, name: str) -> "User":
        return cls(name, role="admin")

    @classmethod
    def create_guest(cls) -> "User":
        return cls("ゲスト", role="guest")

admin = User.create_admin("Alice")
guest = User.create_guest()
\`\`\`

**@staticmethod — クラスに属するが self も cls も不要：**

\`\`\`python
class MathUtils:
    @staticmethod
    def is_even(n: int) -> bool:
        return n % 2 == 0

    @staticmethod
    def clamp(value: float, min_val: float, max_val: float) -> float:
        return max(min_val, min(value, max_val))

print(MathUtils.is_even(4))      # → True
print(MathUtils.clamp(150, 0, 100))  # → 100
\`\`\``,
        },
        {
          type: "code-runner",
          initialCode: `class Temperature:
    ABSOLUTE_ZERO = -273.15

    def __init__(self, celsius: float):
        self.celsius = celsius

    @property
    def fahrenheit(self):
        return self.celsius * 9/5 + 32

    @classmethod
    def from_fahrenheit(cls, f: float) -> "Temperature":
        return cls((f - 32) * 5/9)

    @staticmethod
    def is_valid(celsius: float) -> bool:
        return celsius >= Temperature.ABSOLUTE_ZERO

    def __str__(self):
        return f"{self.celsius}°C ({self.fahrenheit:.1f}°F)"

t = Temperature(100)
print(t)

t2 = Temperature.from_fahrenheit(98.6)
print(t2)

print(Temperature.is_valid(-300))
print(Temperature.is_valid(20))`,
        },
        {
          type: "quiz",
          data: {
            question: "@classmethod の第1引数の名前は慣習的に何？",
            options: ["self", "cls", "klass", "this"],
            answer: 1,
            explanation: "@classmethod の第1引数は慣習的に cls と名付けます。これはクラス自体を指します（@classmethod なしの通常メソッドの self がインスタンスを指すのと対比）。",
          },
        },
      ],
    },
    {
      id: "property",
      title: "@property — getter/setter",
      blocks: [
        {
          type: "text",
          content: `**@property** を使うと、メソッドを属性のように呼び出せます。

\`\`\`python
class Circle:
    def __init__(self, radius: float):
        self._radius = radius  # _prefix は「内部用」の慣習

    @property
    def radius(self) -> float:
        return self._radius

    @radius.setter
    def radius(self, value: float):
        if value < 0:
            raise ValueError("半径は0以上である必要があります")
        self._radius = value

    @property
    def area(self) -> float:
        return 3.14159 * self._radius ** 2

c = Circle(5)
print(c.area)     # → 78.53...（()なしで呼べる）
c.radius = 10     # setter が呼ばれる
c.radius = -1     # → ValueError
\`\`\`

**プロパティの使い所：**
- 計算値をキャッシュせず、常に最新値を返す
- 値の設定時にバリデーションをかける
- 内部表現と外部インターフェースを分離する`,
        },
        {
          type: "code-runner",
          initialCode: `class Person:
    def __init__(self, first: str, last: str, age: int):
        self.first = first
        self.last = last
        self._age = age

    @property
    def full_name(self) -> str:
        return f"{self.last} {self.first}"

    @property
    def age(self) -> int:
        return self._age

    @age.setter
    def age(self, value: int):
        if value < 0 or value > 150:
            raise ValueError(f"不正な年齢: {value}")
        self._age = value

p = Person("太郎", "山田", 30)
print(p.full_name)

p.age = 31
print(f"年齢: {p.age}")

try:
    p.age = -5
except ValueError as e:
    print(f"エラー: {e}")`,
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
            question: "__init__ はいつ呼ばれる？",
            options: [
              "クラスが定義されたとき",
              "インスタンスが生成されたとき（クラス名()）",
              "メソッドが呼ばれたとき",
              "プログラムの終了時",
            ],
            answer: 1,
            explanation: "__init__ はコンストラクタとも呼ばれ、Dog(\"ポチ\", \"柴犬\") のようにインスタンスを生成した瞬間に自動的に呼ばれます。初期化処理（属性の設定など）を行います。",
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
            title: "銀行口座クラスを作ろう",
            description: "BankAccount クラスを定義してください。__init__(self, owner, balance=0)、deposit(amount)（残高を増やす）、withdraw(amount)（残高を減らす。残高不足なら \"残高不足\" を出力）、show()（\"owner: balance円\" を出力）メソッドを実装すること。",
            starterCode: `class BankAccount:
    def __init__(self, owner, balance=0):
        self.owner = owner
        self.balance = ???

    def deposit(self, amount):
        self.balance ???= amount

    def withdraw(self, amount):
        if amount > self.balance:
            print("残高不足")
        else:
            self.balance -= amount

    def show(self):
        print(f"{self.owner}: {self.balance}円")

acc = BankAccount("Alice", 1000)
acc.deposit(500)
acc.show()
acc.withdraw(200)
acc.show()
acc.withdraw(2000)`,
            hint: "self.balance = balance で初期化。deposit は += で加算",
            expectedOutput: "Alice: 1500円\nAlice: 1300円\n残高不足\n",
          },
        },
        {
          type: "challenge" as const,
          data: {
            title: "円クラスを作ろう",
            description: "半径を受け取る Circle クラスを定義してください。area()（面積）と circumference()（円周）を返すメソッドを実装してください。π は 3.14159 を使用。",
            starterCode: `class Circle:
    PI = 3.14159

    def __init__(self, radius):
        self.radius = radius

    def area(self):
        return ???

    def circumference(self):
        return ???

c = Circle(5)
print(f"面積: {c.area():.2f}")
print(f"円周: {c.circumference():.2f}")`,
            hint: "面積は PI * r², 円周は 2 * PI * r",
            expectedOutput: "面積: 78.54\n円周: 31.42\n",
          },
        },
        {
          type: "challenge" as const,
          data: {
            title: "スタックを実装しよう",
            description: "リストを使ったスタック（LIFO）クラス Stack を実装してください。push(item)、pop()（最後の要素を取り出す）、peek()（最後の要素を見るだけ）、is_empty()（空かどうか）メソッドを実装すること。",
            starterCode: `class Stack:
    def __init__(self):
        self._data = []

    def push(self, item):
        self._data.???( item)

    def pop(self):
        return self._data.???()

    def peek(self):
        return self._data[???]

    def is_empty(self):
        return len(self._data) == ???

s = Stack()
s.push(1)
s.push(2)
s.push(3)
print(s.peek())
print(s.pop())
print(s.pop())
print(s.is_empty())`,
            hint: "append() で追加、pop() で最後を取り出す。peek は [-1] で最後の要素にアクセス",
            expectedOutput: "3\n3\n2\nFalse\n",
          },
        },
      ],
    },
  ],
};

export default lesson;
