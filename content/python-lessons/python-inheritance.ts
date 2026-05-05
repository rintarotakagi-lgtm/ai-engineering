import type { Lesson } from "@/lib/types";

const lesson: Lesson = {
  slug: "python-inheritance",
  title: "継承・super()・ポリモーフィズム",
  subtitle: "コードの再利用と拡張性を高める",
  sections: [
    {
      id: "inheritance-basics",
      title: "継承の基本",
      blocks: [
        {
          type: "text",
          content: `**継承**は既存のクラス（親クラス）の属性・メソッドを引き継いで、新しいクラス（子クラス）を作る仕組みです。

\`\`\`python
class Animal:
    def __init__(self, name: str):
        self.name = name

    def speak(self) -> str:
        return f"{self.name}が鳴いています"

    def info(self) -> str:
        return f"動物: {self.name}"

class Dog(Animal):   # Animal を継承
    def speak(self) -> str:   # オーバーライド（上書き）
        return f"{self.name}：ワン！"

class Cat(Animal):
    def speak(self) -> str:
        return f"{self.name}：ニャー"

pochi = Dog("ポチ")
tama = Cat("タマ")

print(pochi.speak())   # → ポチ：ワン！
print(tama.speak())    # → タマ：ニャー
print(pochi.info())    # → 動物: ポチ（親クラスのメソッドを継承）

# isinstance で型チェック
print(isinstance(pochi, Dog))     # → True
print(isinstance(pochi, Animal))  # → True（継承関係が認識される）
\`\`\``,
        },
        {
          type: "code-runner",
          initialCode: `class Shape:
    def __init__(self, color: str = "black"):
        self.color = color

    def area(self) -> float:
        raise NotImplementedError("サブクラスで実装してください")

    def describe(self) -> str:
        return f"{self.color}の{type(self).__name__}（面積: {self.area():.2f}）"

class Rectangle(Shape):
    def __init__(self, width: float, height: float, color: str = "black"):
        super().__init__(color)
        self.width = width
        self.height = height

    def area(self) -> float:
        return self.width * self.height

class Circle(Shape):
    def __init__(self, radius: float, color: str = "black"):
        super().__init__(color)
        self.radius = radius

    def area(self) -> float:
        return 3.14159 * self.radius ** 2

shapes = [
    Rectangle(5, 3, "red"),
    Circle(4, "blue"),
    Rectangle(2, 8),
]

for s in shapes:
    print(s.describe())`,
        },
      ],
    },
    {
      id: "super",
      title: "super() の使い方",
      blocks: [
        {
          type: "text",
          content: `**super()** は親クラスのメソッドを呼び出します。特に \`__init__\` の拡張でよく使います。

\`\`\`python
class Employee:
    def __init__(self, name: str, salary: float):
        self.name = name
        self.salary = salary

    def info(self) -> str:
        return f"{self.name}（年収: {self.salary:,}円）"

class Manager(Employee):
    def __init__(self, name: str, salary: float, team_size: int):
        super().__init__(name, salary)   # 親の __init__ を呼ぶ
        self.team_size = team_size       # 子クラス固有の属性を追加

    def info(self) -> str:
        base = super().info()            # 親の info() を呼ぶ
        return f"{base}、部下: {self.team_size}人"

emp = Employee("田中", 5_000_000)
mgr = Manager("鈴木", 8_000_000, 12)

print(emp.info())
print(mgr.info())
\`\`\`

**多重継承（Mixin パターン）：**

\`\`\`python
class JsonMixin:
    def to_json(self) -> str:
        import json
        return json.dumps(self.__dict__, ensure_ascii=False)

class User(JsonMixin):
    def __init__(self, name: str, age: int):
        self.name = name
        self.age = age

u = User("Alice", 25)
print(u.to_json())  # → {"name": "Alice", "age": 25}
\`\`\``,
        },
        {
          type: "code-runner",
          initialCode: `import json

class Model:
    """全モデルの基底クラス"""
    def to_dict(self) -> dict:
        return {k: v for k, v in self.__dict__.items()
                if not k.startswith('_')}

    def to_json(self) -> str:
        return json.dumps(self.to_dict(), ensure_ascii=False, indent=2)

class Product(Model):
    def __init__(self, name: str, price: float, stock: int):
        self.name = name
        self.price = price
        self.stock = stock

    def discounted(self, rate: float) -> "Product":
        return Product(self.name, self.price * (1 - rate), self.stock)

p = Product("ノートPC", 150000, 10)
print(p.to_json())

sale = p.discounted(0.2)
print(f"セール価格: {sale.price:,.0f}円")`,
        },
      ],
    },
    {
      id: "polymorphism",
      title: "ポリモーフィズム",
      blocks: [
        {
          type: "text",
          content: `**ポリモーフィズム**（多態性）は、異なるクラスのオブジェクトを同じインターフェースで扱える性質です。

\`\`\`python
class Dog:
    def speak(self): return "ワン！"

class Cat:
    def speak(self): return "ニャー"

class Duck:
    def speak(self): return "クワッ"

animals = [Dog(), Cat(), Duck()]
for animal in animals:
    print(animal.speak())  # 各クラスの speak が呼ばれる
\`\`\`

これを**ダックタイピング**とも言います。「アヒルのように歩き、アヒルのように鳴くなら、それはアヒルだ」— \`speak\` メソッドがあれば型を問わず使えます。

**Protocol — 明示的なインターフェース定義（Python 3.8+）：**

\`\`\`python
from typing import Protocol

class Speakable(Protocol):
    def speak(self) -> str: ...

def make_noise(animal: Speakable) -> None:
    print(animal.speak())

# Dog, Cat, Duck が Speakable を継承していなくても
# speak() メソッドがあれば型チェックをパスする
make_noise(Dog())   # OK
make_noise(Cat())   # OK
\`\`\``,
        },
        {
          type: "code-runner",
          initialCode: `class Formatter:
    """テキストをフォーマットする基底クラス"""
    def format(self, text: str) -> str:
        raise NotImplementedError

class UpperFormatter(Formatter):
    def format(self, text: str) -> str:
        return text.upper()

class TitleFormatter(Formatter):
    def format(self, text: str) -> str:
        return text.title()

class RepeatFormatter(Formatter):
    def __init__(self, n: int):
        self.n = n
    def format(self, text: str) -> str:
        return (text + " ") * self.n

texts = ["hello, world", "python is great"]
formatters = [UpperFormatter(), TitleFormatter(), RepeatFormatter(2)]

for text in texts:
    for fmt in formatters:
        print(fmt.format(text))
    print()`,
        },
        {
          type: "quiz",
          data: {
            question: "Pythonの「ダックタイピング」の意味は？",
            options: [
              "継承関係があれば同じように扱える",
              "型ではなくメソッドやプロパティの存在で型を判断する",
              "Duckクラスを継承する必要がある",
              "型安全を保証する仕組み",
            ],
            answer: 1,
            explanation: "「アヒルのように歩き、アヒルのように鳴くなら、それはアヒルだ」という考え方です。継承関係がなくても、必要なメソッドが存在すれば同じように扱えます。Pythonの柔軟性を支える重要な概念です。",
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
            question: "isinstance(dog_instance, Animal) が True になるのはいつ？",
            options: [
              "Dog クラスと Animal クラスの名前が同じとき",
              "Dog クラスが Animal クラスを継承しているとき",
              "常に True",
              "dog_instance の属性が Animal と同じとき",
            ],
            answer: 1,
            explanation: "isinstance() は継承関係を認識します。Dog が Animal を継承していれば、Dog のインスタンスは Animal のインスタンスでもあります。is-a 関係（犬は動物である）を表します。",
          },
        },
      ],
    },
  ],
};

export default lesson;
