import { notFound } from "next/navigation";
import { curriculum } from "@/content/curriculum";
import lesson1 from "@/content/lessons/lesson1";
import lesson2 from "@/content/lessons/lesson2";
import LessonLayout from "@/components/LessonLayout";

const lessons = {
  "linear-regression": lesson1,
  "logistic-regression": lesson2,
} as const;

type Params = { slug: string };

export function generateStaticParams() {
  return curriculum.filter((c) => c.available).map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: { params: Promise<Params> }) {
  return params.then(({ slug }) => {
    const item = curriculum.find((c) => c.slug === slug);
    if (!item) return {};
    return {
      title: `${item.title} — 機械学習の教科書`,
      description: item.subtitle,
    };
  });
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
