import { DockerService } from '../docker/DockerService';
import { Submission, TestCase } from '../types';
import { Basejudge } from './BaseJudge';

export class CppJudge extends Basejudge {
  private dockerService: DockerService;
  private compiledSuccessfully: boolean = false;

  constructor(submission: Submission, testCases: TestCase[]) {
    super(submission, testCases);
    this.dockerService = new DockerService();
  }

  async compile(): Promise<{ succes: boolean; error?: string }> {
    try {
      const result = await this.dockerService.runCppCode(
        this.submission.code,
        '',
        10000
      );

      console.log('result compiled is ',result)

      this.compiledSuccessfully = !result.error;
      return {
        succes: this.compiledSuccessfully,
        error: result.error
      };
    } catch (error) {
      return {
        succes: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  async runTestCase(testCase: TestCase): Promise<{
    output: string;
    executionTime: number;
    memoryUsed: number;
    error?: string;
  }> {
    if (!this.compiledSuccessfully) {
      throw new Error('Cannot run test case: code has not been compiled successfully');
    }

    try {
      const run= await this.dockerService.runCppCode(
        this.submission.code,
        testCase.input,
        this.timeLimit,
        this.memoryLimit / (1024 * 1024) // Convert bytes to MB
      );
      console.log('run is ',run)
      console.log("Submitted code output:", run.output);
      return run
    } catch (error) {
      return {
        output: '',
        executionTime: 0,
        memoryUsed: 0,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }
}
