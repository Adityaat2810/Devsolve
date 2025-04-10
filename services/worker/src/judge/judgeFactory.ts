import { CppJudge } from './CppJudge';
import { Submission, TestCase, Language } from '../types';
import { Basejudge } from './BaseJudge';

export class JudgeFactory {
  static createJudge(submission: Submission, testCases: TestCase[]): Basejudge {
    switch (submission.language) {
      case Language.CPP:
        return new CppJudge(submission, testCases);
      default:
        throw new Error(`Unsupported language: ${submission.language}`);
    }
  }
}