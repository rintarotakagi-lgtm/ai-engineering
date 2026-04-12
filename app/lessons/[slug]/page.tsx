import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { curriculum } from "@/content/curriculum";
import lesson1 from "@/content/lessons/lesson1";
import lesson2 from "@/content/lessons/lesson2";
import lesson3 from "@/content/lessons/lesson3";
import lesson4 from "@/content/lessons/lesson4";
import lesson5 from "@/content/lessons/lesson5";
import lesson6 from "@/content/lessons/lesson6";
import lesson7 from "@/content/lessons/lesson7";
import lesson8 from "@/content/lessons/lesson8";
import lesson9 from "@/content/lessons/lesson9";
import lesson10 from "@/content/lessons/lesson10";
import lesson11 from "@/content/lessons/lesson11";
import LessonLayout from "@/components/LessonLayout";

const BASE_URL = "https://ai-engineering-three.vercel.app";

const lessons = {
  "linear-regression": lesson1,
  "logistic-regression": lesson2,
  "regularization": lesson3,
  "kernel-svm": lesson4,
  "perceptron-mlp": lesson5,
  "backpropagation": lesson6,
  "cnn": lesson7,
  "rnn-lstm": lesson8,
  "attention": lesson9,
  "transformer": lesson10,
  "bert-vs-gpt": lesson11,
} as const;

type Params = { slug: string };

export function generateStaticParams() {
  return curriculum.filter((c) => c.available).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = curriculum.find((c) => c.slug === slug);
  if (!item) return {};

  const lessonNumber = curriculum.findIndex((c) => c.slug === slug) + 1;
  const title = `Lesson ${lessonNumber}: ${item.title}`;
  const description = `${item.subtitle}。インタラクティブなデモ付きで${item.title}の理論を学ぶ。`;

  return {
    title,
    description,
    openGraph: {
      title: `${title} — 機械学習の教科書`,
      description,
      url: `${BASE_URL}/lessons/${slug}`,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} — 機械学習の教科書`,
      description,
    },
    alternates: {
      canonical: `${BASE_URL}/lessons/${slug}`,
    },
  };
}

export default async function LessonPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const lesson = lessons[slug as keyof typeof lessons];

  if (!lesson) {
    notFound();
  }

  return <LessonLayout lesson={lesson} />;
}
