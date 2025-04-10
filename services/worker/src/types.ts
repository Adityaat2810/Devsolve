export enum STATUS {
  QUEUED = 'QUEUED',
  RUNNING = 'RUNNING',
  ACCEPTED = 'ACCEPTED',
  WRONG_ANSWER = 'WRONG_ANSWER',
  TIME_LIMIT_EXCEEDED = 'TIME_LIMIT_EXCEEDED',
  MEMORY_LIMIT_EXCEEDED = 'MEMORY_LIMIT_EXCEEDED',
  RUNTIME_ERROR = 'RUNTIME_ERROR',
  COMPILATION_ERROR = 'COMPILATION_ERROR',
  INTERNAL_ERROR = 'INTERNAL_ERROR'
}

export enum Language {
  JAVASCRIPT = 'JAVASCRIPT',
  PYTHON = 'PYTHON',
  CPP = 'CPP'
}

export interface Submission {
  id: string;
  code: string;
  language: Language;
  status: STATUS;
  results?: string;
  runTime?: number;
  memoryUsage?: number;
  createdAt: Date;
  problemId: string;
  userId: string;
}

export interface TestCase {
  id: string;
  input: string;
  expected: string;
  problemId: string;
  isHidden: boolean;
}

export interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  authorId: string;
}

export interface TestResult {
  passed: boolean;
  actualOutput: string;
  expectedOutput: string;
  executionTime: number;
  memoryUsed: number;
  error?: string;
}

export interface JudgeResult {
  status: STATUS;
  results: TestResult[];
  totalRunTime: number;
  maxMemoryUsage: number;
}