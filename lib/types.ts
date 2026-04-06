export type Quiz = {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
};

export type Block =
  | { type: "text"; content: string }
  | { type: "interactive"; id: string }
  | { type: "quiz"; data: Quiz };

export type Section = {
  id: string;
  title: string;
  blocks: Block[];
};

export type Lesson = {
  slug: string;
  title: string;
  subtitle: string;
  sections: Section[];
};

export type CurriculumItem = {
  slug: string;
  title: string;
  subtitle: string;
  phase: string;
  available: boolean;
};
