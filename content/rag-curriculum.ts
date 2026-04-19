import type { CurriculumItem } from "@/lib/types";

export const ragCurriculum: CurriculumItem[] = [
  // Phase 1: RAGの基礎
  {
    slug: "what-is-rag",
    title: "RAGとは",
    subtitle: "LLMの限界を検索で補う — 検索拡張生成の基本",
    phase: "Phase 1: RAGの基礎",
    available: true,
  },
  {
    slug: "embeddings",
    title: "ベクトル埋め込み",
    subtitle: "テキストを数値に変換して意味を捉える",
    phase: "Phase 1: RAGの基礎",
    available: true,
  },
  {
    slug: "chunking",
    title: "チャンク分割",
    subtitle: "文書を適切なサイズに分割する戦略",
    phase: "Phase 1: RAGの基礎",
    available: true,
  },
  // Phase 2: RAGの実践
  {
    slug: "rag-pipeline",
    title: "RAGパイプライン",
    subtitle: "検索から生成まで — 一連の流れを理解する",
    phase: "Phase 2: RAGの実践",
    available: true,
  },
  {
    slug: "rag-evaluation",
    title: "評価と改善",
    subtitle: "RAGの精度を測り、改善する方法",
    phase: "Phase 2: RAGの実践",
    available: true,
  },
  {
    slug: "rag-patterns",
    title: "応用パターン",
    subtitle: "Hybrid Search、Multi-step RAGなどの発展形",
    phase: "Phase 2: RAGの実践",
    available: true,
  },
];
