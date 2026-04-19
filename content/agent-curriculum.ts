import type { CurriculumItem } from "@/lib/types";

export const agentCurriculum: CurriculumItem[] = [
  // Phase 1: 基礎概念
  {
    slug: "what-is-agent",
    title: "エージェントとは",
    subtitle: "ワークフロー vs エージェント",
    phase: "Phase 1: 基礎概念",
    available: true,
  },
  {
    slug: "augmented-llm",
    title: "拡張LLM",
    subtitle: "ツール・検索・メモリで強化する",
    phase: "Phase 1: 基礎概念",
    available: true,
  },
  // Phase 2: ワークフロー
  {
    slug: "workflow-patterns-1",
    title: "ワークフローパターン①",
    subtitle: "プロンプトチェーン、ルーティング",
    phase: "Phase 2: ワークフロー",
    available: true,
  },
  {
    slug: "workflow-patterns-2",
    title: "ワークフローパターン②",
    subtitle: "並列化、オーケストレーター",
    phase: "Phase 2: ワークフロー",
    available: true,
  },
  {
    slug: "evaluator-optimizer",
    title: "エバリュエーター-オプティマイザー",
    subtitle: "評価→改善ループ",
    phase: "Phase 2: ワークフロー",
    available: true,
  },
  // Phase 3: エージェント
  {
    slug: "agent-loop",
    title: "エージェントループ",
    subtitle: "ReAct/TAOパターン",
    phase: "Phase 3: エージェント",
    available: false,
  },
  {
    slug: "tool-design",
    title: "ツール設計",
    subtitle: "Agent-Computer Interface",
    phase: "Phase 3: エージェント",
    available: false,
  },
  // Phase 4: 実装と運用
  {
    slug: "claude-agent-sdk",
    title: "Claude Agent SDK",
    subtitle: "実装と組み込みツール",
    phase: "Phase 4: 実装と運用",
    available: false,
  },
  {
    slug: "multi-agent",
    title: "マルチエージェント",
    subtitle: "サブエージェント、MCP連携",
    phase: "Phase 4: 実装と運用",
    available: false,
  },
  {
    slug: "harness-design",
    title: "ハーネス設計",
    subtitle: "セッション管理、本番運用",
    phase: "Phase 4: 実装と運用",
    available: false,
  },
];
