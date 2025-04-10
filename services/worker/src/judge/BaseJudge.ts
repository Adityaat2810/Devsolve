import { Submission, TestCase, JudgeResult, STATUS } from '../types';

export abstract class Basejudge {

  protected submission: Submission;
  protected testCases: TestCase[];
  protected timeLimit: number = 2000;
  protected memoryLimit: number = 512 * 1024 * 1024; // 512 MB in bytes

  constructor(submission: Submission, testCases: TestCase[]) {
    this.submission = submission;
    this.testCases = testCases;
  }

  abstract compile():Promise<{succes: boolean; error?: string}>;

  abstract runTestCase(testCase: TestCase): Promise<{
    output: string;
    executionTime: number;
    memoryUsed: number;
    error?: string
  }>

  async judge(): Promise<JudgeResult> {
    const results: JudgeResult = {
      status: STATUS.RUNNING,
      results: [],
      totalRunTime: 0,
      maxMemoryUsage: 0
    };

    try {
      // Compile the code
      const compileResult = await this.compile();
      if (!compileResult.succes) {
        return {
          status: STATUS.COMPILATION_ERROR,
          results: [],
          totalRunTime: 0,
          maxMemoryUsage: 0
        };
      }

      for (const testCase of this.testCases) {
        const runResult = await this.runTestCase(testCase);
        results.maxMemoryUsage = Math.max(results.maxMemoryUsage, runResult.memoryUsed);

        results.totalRunTime += runResult.executionTime;

        // Check for errors
        if (runResult.error) {
          if (runResult.executionTime >= this.timeLimit) {
            results.status = STATUS.TIME_LIMIT_EXCEEDED;
          } else if (runResult.memoryUsed >= this.memoryLimit) {
            results.status = STATUS.MEMORY_LIMIT_EXCEEDED;
          } else {
            results.status = STATUS.RUNTIME_ERROR;
          }

          results.results.push({
            passed: false,
            actualOutput: runResult.error,
            expectedOutput: testCase.expected,
            executionTime: runResult.executionTime,
            memoryUsed: runResult.memoryUsed,
            error: runResult.error
          });

          continue;
        }

        const passed = this.compareOutput(runResult.output.trim(), testCase.expected.trim());

        results.results.push({
          passed,
          actualOutput: runResult.output,
          expectedOutput: testCase.expected,
          executionTime: runResult.executionTime,
          memoryUsed: runResult.memoryUsed
        });

        if (!passed && results.status === STATUS.RUNNING) {
          results.status = STATUS.WRONG_ANSWER;
        }
      }

      // If we've run all tests and status is still RUNNING, then all tests passed
      if (results.status === STATUS.RUNNING) {
        results.status = STATUS.ACCEPTED;
      }

      return results;
    } catch (error) {
      return {
        status: STATUS.INTERNAL_ERROR,
        results: [],
        totalRunTime: 0,
        maxMemoryUsage: 0
      };
    }
  }

  protected compareOutput(actual: string, expected: string): boolean {
    return actual === expected;
  }

}
