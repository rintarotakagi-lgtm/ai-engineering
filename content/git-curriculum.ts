import type { CurriculumItem } from "@/lib/types";

export const gitCurriculum: CurriculumItem[] = [
  // Phase 1: Git入門
  {
    slug: "git-intro",
    title: "バージョン管理とは",
    subtitle: "なぜGitが必要か",
    phase: "Phase 1: Git入門",
    available: true,
  },
  {
    slug: "git-concepts",
    title: "Gitの基本概念",
    subtitle: "リポジトリ、コミット、ブランチ",
    phase: "Phase 1: Git入門",
    available: true,
  },
  {
    slug: "github-start",
    title: "GitHubを使ってみよう",
    subtitle: "アカウント作成からリポジトリ作成まで",
    phase: "Phase 1: Git入門",
    available: true,
  },
  {
    slug: "basic-workflow",
    title: "基本ワークフロー",
    subtitle: "clone, add, commit, push の流れ",
    phase: "Phase 1: Git入門",
    available: true,
  },
  // Phase 2: チーム開発
  {
    slug: "branching-merging",
    title: "ブランチとマージ",
    subtitle: "並行作業の管理",
    phase: "Phase 2: チーム開発",
    available: true,
  },
  {
    slug: "pull-requests",
    title: "プルリクエスト",
    subtitle: "コードレビューの流れ",
    phase: "Phase 2: チーム開発",
    available: true,
  },
  {
    slug: "team-workflow",
    title: "チーム開発のワークフロー",
    subtitle: "Git Flow, GitHub Flow",
    phase: "Phase 2: チーム開発",
    available: true,
  },
  {
    slug: "troubleshooting",
    title: "トラブルシューティング",
    subtitle: "コンフリクト解消、やり直し方",
    phase: "Phase 2: チーム開発",
    available: true,
  },
];
