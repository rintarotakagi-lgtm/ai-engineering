import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { pythonCurriculum } from "@/content/python-curriculum";
import pythonIntro from "@/content/python-lessons/python-intro";
import pythonVariables from "@/content/python-lessons/python-variables";
import pythonStrings from "@/content/python-lessons/python-strings";
import pythonCollections from "@/content/python-lessons/python-collections";
import pythonControlFlow from "@/content/python-lessons/python-control-flow";
import pythonLoops from "@/content/python-lessons/python-loops";
import pythonFunctions from "@/content/python-lessons/python-functions";
import pythonAdvancedFunctions from "@/content/python-lessons/python-advanced-functions";
import pythonClasses from "@/content/python-lessons/python-classes";
import pythonInheritance from "@/content/python-lessons/python-inheritance";
import pythonDunder from "@/content/python-lessons/python-dunder";
import pythonExceptions from "@/content/python-lessons/python-exceptions";
import pythonFileIo from "@/content/python-lessons/python-file-io";
import pythonModules from "@/content/python-lessons/python-modules";
import pythonTypeHints from "@/content/python-lessons/python-type-hints";
import pythonDecorators from "@/content/python-lessons/python-decorators";
import pythonStdlib from "@/content/python-lessons/python-stdlib";
import pythonTesting from "@/content/python-lessons/python-testing";
import LessonLayout from "@/components/LessonLayout";

const BASE_URL = "https://ai-engineering-three.vercel.app";

const lessons = {
  "python-intro": pythonIntro,
  "python-variables": pythonVariables,
  "python-strings": pythonStrings,
  "python-collections": pythonCollections,
  "python-control-flow": pythonControlFlow,
  "python-loops": pythonLoops,
  "python-functions": pythonFunctions,
  "python-advanced-functions": pythonAdvancedFunctions,
  "python-classes": pythonClasses,
  "python-inheritance": pythonInheritance,
  "python-dunder": pythonDunder,
  "python-exceptions": pythonExceptions,
  "python-file-io": pythonFileIo,
  "python-modules": pythonModules,
  "python-type-hints": pythonTypeHints,
  "python-decorators": pythonDecorators,
  "python-stdlib": pythonStdlib,
  "python-testing": pythonTesting,
} as const;

type Params = { slug: string };

export function generateStaticParams() {
  return pythonCurriculum.filter((c) => c.available).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = pythonCurriculum.find((c) => c.slug === slug);
  if (!item) return {};

  const lessonNumber = pythonCurriculum.findIndex((c) => c.slug === slug) + 1;
  const title = `Lesson ${lessonNumber}: ${item.title}`;
  const description = `${item.subtitle}。入門から中級まで学べるPython完全ガイド。`;

  return {
    title,
    description,
    openGraph: {
      title: `${title} — Pythonの教科書`,
      description,
      url: `${BASE_URL}/python/${slug}`,
      type: "article",
    },
    alternates: {
      canonical: `${BASE_URL}/python/${slug}`,
    },
  };
}

export default async function PythonLessonPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const lesson = lessons[slug as keyof typeof lessons];

  if (!lesson) {
    notFound();
  }

  return <LessonLayout lesson={lesson} courseBase="/python" curriculum={pythonCurriculum} />;
}
