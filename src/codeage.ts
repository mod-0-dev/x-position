export type CodeAgeMode = "file" | "directory";

export type CodeAgeFeature = {
  name: string;
  implemented: boolean;
};

export const codeAgePlan: CodeAgeFeature[] = [
  { name: "init", implemented: true },
  { name: "blame-parser", implemented: false },
  { name: "age-color", implemented: false },
  { name: "render", implemented: false },
  { name: "dir-mode", implemented: false },
];
