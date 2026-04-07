import type { MetadataRoute } from "next";
import { curriculum } from "@/content/curriculum";

const BASE_URL = "https://ai-engineering-three.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const lessonUrls = curriculum
    .filter((c) => c.available)
    .map((c) => ({
      url: `${BASE_URL}/lessons/${c.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    ...lessonUrls,
  ];
}
