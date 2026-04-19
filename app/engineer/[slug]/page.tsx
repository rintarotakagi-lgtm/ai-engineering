import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { engineerCurriculum } from "@/content/engineer-curriculum";
import webBasics from "@/content/engineer-lessons/web-basics";
import httpRest from "@/content/engineer-lessons/http-rest";
import databases from "@/content/engineer-lessons/databases";
import frontendBackend from "@/content/engineer-lessons/frontend-backend";
import cloudBasics from "@/content/engineer-lessons/cloud-basics";
import pythonSetup from "@/content/engineer-lessons/python-setup";
import pythonTypes from "@/content/engineer-lessons/python-types";
import pythonControl from "@/content/engineer-lessons/python-control";
import pythonFunctions from "@/content/engineer-lessons/python-functions";
import pythonLibraries from "@/content/engineer-lessons/python-libraries";
import pythonErrors from "@/content/engineer-lessons/python-errors";
import gitConceptsEng from "@/content/engineer-lessons/git-concepts-eng";
import githubPr from "@/content/engineer-lessons/github-pr";
import llmApiBasics from "@/content/engineer-lessons/llm-api-basics";
import tokensContext from "@/content/engineer-lessons/tokens-context";
import promptEngineering from "@/content/engineer-lessons/prompt-engineering";
import toolUse from "@/content/engineer-lessons/tool-use";
import agentsBasics from "@/content/engineer-lessons/agents-basics";
import mcpBasics from "@/content/engineer-lessons/mcp-basics";
import LessonLayout from "@/components/LessonLayout";

const BASE_URL = "https://ai-engineering-three.vercel.app";

const lessons = {
  "web-basics": webBasics,
  "http-rest": httpRest,
  "databases": databases,
  "frontend-backend": frontendBackend,
  "cloud-basics": cloudBasics,
  "python-setup": pythonSetup,
  "python-types": pythonTypes,
  "python-control": pythonControl,
  "python-functions": pythonFunctions,
  "python-libraries": pythonLibraries,
  "python-errors": pythonErrors,
  "git-concepts-eng": gitConceptsEng,
  "github-pr": githubPr,
  "llm-api-basics": llmApiBasics,
  "tokens-context": tokensContext,
  "prompt-engineering": promptEngineering,
  "tool-use": toolUse,
  "agents-basics": agentsBasics,
  "mcp-basics": mcpBasics,
} as const;

type Params = { slug: string };

export function generateStaticParams() {
  return engineerCurriculum.filter((c) => c.available).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = engineerCurriculum.find((c) => c.slug === slug);
  if (!item) return {};

  const lessonNumber = engineerCurriculum.findIndex((c) => c.slug === slug) + 1;
  const title = `Lesson ${lessonNumber}: ${item.title}`;
  const description = `${item.subtitle}。ディレクター・経営者のためのエンジニアリング基礎。`;

  return {
    title,
    description,
    openGraph: {
      title: `${title} — エンジニア入門`,
      description,
      url: `${BASE_URL}/engineer/${slug}`,
      type: "article",
    },
    alternates: {
      canonical: `${BASE_URL}/engineer/${slug}`,
    },
  };
}

export default async function EngineerLessonPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const lesson = lessons[slug as keyof typeof lessons];

  if (!lesson) {
    notFound();
  }

  return <LessonLayout lesson={lesson} courseBase="/engineer" curriculum={engineerCurriculum} />;
}
