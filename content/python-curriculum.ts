import type { CurriculumItem } from "@/lib/types";

export const pythonCurriculum: CurriculumItem[] = [
  // Module 1: Python入門
  {
    slug: "python-intro",
    title: "Pythonとは・最初のスクリプト",
    subtitle: "インタープリタ型言語の特徴・Hello World・REPLの使い方",
    phase: "Module 1: Python入門",
    available: true,
  },
  {
    slug: "python-variables",
    title: "変数・数値・文字列・ブール・None",
    subtitle: "Pythonの基本データ型と動的型付けを理解する",
    phase: "Module 1: Python入門",
    available: true,
  },
  {
    slug: "python-strings",
    title: "文字列操作",
    subtitle: "スライス・メソッド・f-string・正規表現入門",
    phase: "Module 1: Python入門",
    available: true,
  },
  {
    slug: "python-collections",
    title: "リスト・タプル・辞書・セット",
    subtitle: "4つのコレクション型を使い分ける",
    phase: "Module 1: Python入門",
    available: true,
  },
  // Module 2: 制御フローと関数
  {
    slug: "python-control-flow",
    title: "条件分岐",
    subtitle: "if / elif / else・比較演算子・論理演算子",
    phase: "Module 2: 制御フローと関数",
    available: true,
  },
  {
    slug: "python-loops",
    title: "ループ",
    subtitle: "for / while・enumerate・zip・リスト内包表記",
    phase: "Module 2: 制御フローと関数",
    available: true,
  },
  {
    slug: "python-functions",
    title: "関数定義・引数・返り値",
    subtitle: "def・デフォルト引数・キーワード引数・型ヒント",
    phase: "Module 2: 制御フローと関数",
    available: true,
  },
  {
    slug: "python-advanced-functions",
    title: "高階関数・lambda・クロージャ",
    subtitle: "*args / **kwargs・map / filter・クロージャの仕組み",
    phase: "Module 2: 制御フローと関数",
    available: true,
  },
  // Module 3: オブジェクト指向
  {
    slug: "python-classes",
    title: "クラスとインスタンス",
    subtitle: "クラス定義・__init__・属性・メソッド",
    phase: "Module 3: オブジェクト指向",
    available: true,
  },
  {
    slug: "python-inheritance",
    title: "継承・super()・ポリモーフィズム",
    subtitle: "コードの再利用と拡張性を高める",
    phase: "Module 3: オブジェクト指向",
    available: true,
  },
  {
    slug: "python-dunder",
    title: "特殊メソッド（ダンダーメソッド）",
    subtitle: "__str__ / __repr__ / __len__ / 演算子オーバーロード",
    phase: "Module 3: オブジェクト指向",
    available: true,
  },
  // Module 4: 実践スキル
  {
    slug: "python-exceptions",
    title: "例外処理",
    subtitle: "try / except / finally・カスタム例外・raise",
    phase: "Module 4: 実践スキル",
    available: true,
  },
  {
    slug: "python-file-io",
    title: "ファイル入出力",
    subtitle: "pathlib・テキスト / JSON / CSV の読み書き",
    phase: "Module 4: 実践スキル",
    available: true,
  },
  {
    slug: "python-modules",
    title: "モジュール・パッケージ・import体系",
    subtitle: "自作モジュール・__init__.py・相対import",
    phase: "Module 4: 実践スキル",
    available: true,
  },
  {
    slug: "python-type-hints",
    title: "型ヒント",
    subtitle: "基本型・Optional・Union・TypeVar・ジェネリクス",
    phase: "Module 4: 実践スキル",
    available: true,
  },
  {
    slug: "python-decorators",
    title: "デコレータ",
    subtitle: "@staticmethod / @classmethod・functools.wraps・カスタムデコレータ",
    phase: "Module 4: 実践スキル",
    available: true,
  },
  // Module 5: 標準ライブラリ&テスト
  {
    slug: "python-stdlib",
    title: "標準ライブラリ活用",
    subtitle: "collections・itertools・datetime・os / pathlib",
    phase: "Module 5: 標準ライブラリ&テスト",
    available: true,
  },
  {
    slug: "python-testing",
    title: "テスト（pytest）",
    subtitle: "ユニットテスト・フィクスチャ・parametrize・モック",
    phase: "Module 5: 標準ライブラリ&テスト",
    available: true,
  },
];
