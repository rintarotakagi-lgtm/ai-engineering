import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { gitCurriculum } from "@/content/git-curriculum";
import gitIntro from "@/content/git-lessons/git-intro";
import gitConcepts from "@/content/git-lessons/git-concepts";
import githubStart from "@/content/git-lessons/github-start";
import basicWorkflow from "@/content/git-lessons/basic-workflow";
import branchingMerging from "@/content/git-lessons/lesson5";
import pullRequests from "@/content/git-lessons/lesson6";
import teamWorkflow from "@/content/git-lessons/lesson7";
import troubleshooting from "@/content/git-lessons/lesson8";
import LessonLayout from "@/components/LessonLayout";

const BASE_URL = "https://ai-engineering-three.vercel.app";

const lessons = {
  "git-intro": gitIntro,
  "git-concepts": gitConcepts,
  "github-start": githubStart,
  "basic-workflow": basicWorkflow,
  "branching-merging": branchingMerging,
  "pull-requests": pullRequests,
  "team-workflow": teamWorkflow,
  "troubleshooting": troubleshooting,
} as const;

type Params = { slug: string };

export function generateStaticParams() {
  return gitCurriculum.filter((c) => c.available).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = gitCurriculum.find((c) => c.slug === slug);
  if (!item) return {};

  const lessonNumber = gitCurriculum.findIndex((c) => c.slug === slug) + 1;
  const title = `Lesson ${lessonNumber}: ${item.title}`;
  const description = `${item.subtitle}。Git/GitHubを非エンジニア向けにわかりやすく解説。`;

  return {
    title,
    description,
    openGraph: {
      title: `${title} — Git/GitHub入門`,
      description,
      url: `${BASE_URL}/git/${slug}`,
      type: "article",
    },
    alternates: {
      canonical: `${BASE_URL}/git/${slug}`,
    },
  };
}

export default async function GitLessonPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const lesson = lessons[slug as keyof typeof lessons];

  if (!lesson) {
    notFound();
  }

  return <LessonLayout lesson={lesson} courseBase="/git" curriculum={gitCurriculum} />;
}
