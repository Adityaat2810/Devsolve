import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { spawn, exec } from 'child_process';
import { v4 as uuid } from 'uuid';

// Define types
enum Language {
  CPP = "CPP",
  PYTHON = "PYTHON",
  JAVASCRIPT = "JAVASCRIPT"
}

enum Status {
  PENDING = "PENDING",
  RUNNING = "RUNNING",
  COMPILATION_ERROR = "COMPILATION_ERROR",
  RUNTIME_ERROR = "RUNTIME_ERROR",
  TIME_LIMIT_EXCEEDED = "TIME_LIMIT_EXCEEDED",
  MEMORY_LIMIT_EXCEEDED = "MEMORY_LIMIT_EXCEEDED",
  WRONG_ANSWER = "WRONG_ANSWER",
  ACCEPTED = "ACCEPTED",
  INTERNAL_ERROR = "INTERNAL_ERROR"
}

interface TestResult {
  passed: boolean;
  actualOutput: string;
  expectedOutput: string;
  executionTime: number;
  memoryUsed: number;
  error?: string;
}

interface JudgeResult {
  status: Status;
  results: TestResult[];
  totalRunTime: number;
  maxMemoryUsage: number;
}

interface Submission {
  id: string;
  userId: string;
  problemId: string;
  language: Language;
  code: string;
  status: Status;
  result?: JudgeResult;
  createdAt: Date;
  updatedAt: Date;
}

interface TestCase {
  id: string;
  problemId: string;
  input: string;
  expectedOutput: string;
  isExample: boolean;
}

// Create a simple CppJudge class for testing
class CppJudge {
  private submission: Submission;
  private testCases: TestCase[];
  private timeLimit = 2000; // 2 seconds
  private memoryLimit = 512; // 512 MB

  constructor(submission: Submission, testCases: TestCase[]) {
    this.submission = submission;
    this.testCases = testCases;
  }

  async judge(): Promise<JudgeResult> {
    const results: JudgeResult = {
      status: Status.RUNNING,
      results: [],
      totalRunTime: 0,
      maxMemoryUsage: 0
    };

    try {
      // First check if code compiles
      const compileCheckResult = await this.runCode('', true);
      if (compileCheckResult.error && compileCheckResult.error.includes('Compilation error')) {
        return {
          status: Status.COMPILATION_ERROR,
          results: [],
          totalRunTime: 0,
          maxMemoryUsage: 0
        };
      }

      // Run each test case
      for (const testCase of this.testCases) {
        console.log(`Running test case with input: ${testCase.input}`);
        const runResult = await this.runCode(testCase.input);

        // Update max memory usage and total runtime
        results.maxMemoryUsage = Math.max(results.maxMemoryUsage, runResult.memoryUsed);
        results.totalRunTime += runResult.executionTime;

        // Handle errors
        if (runResult.error) {
          if (runResult.error.includes('Time limit exceeded')) {
            results.status = Status.TIME_LIMIT_EXCEEDED;
          } else {
            results.status = Status.RUNTIME_ERROR;
          }

          results.results.push({
            passed: false,
            actualOutput: '',
            expectedOutput: testCase.expectedOutput,
            executionTime: runResult.executionTime,
            memoryUsed: runResult.memoryUsed,
            error: runResult.error
          });

          continue;
        }

        // Compare outputs
        const expectedOutput = testCase.expectedOutput.trim();
        const actualOutput = runResult.output.trim();
        const passed = actualOutput === expectedOutput;

        console.log(`Expected: "${expectedOutput}", Actual: "${actualOutput}", Passed: ${passed}`);

        results.results.push({
          passed,
          actualOutput,
          expectedOutput,
          executionTime: runResult.executionTime,
          memoryUsed: runResult.memoryUsed
        });

        // Set status if failed
        if (!passed && results.status === Status.RUNNING) {
          results.status = Status.WRONG_ANSWER;
        }
      }

      // If all tests passed
      if (results.status === Status.RUNNING) {
        results.status = Status.ACCEPTED;
      }

      return results;
    } catch (error) {
      console.error('Judge error:', error);
      return {
        status: Status.INTERNAL_ERROR,
        results: [],
        totalRunTime: 0,
        maxMemoryUsage: 0
      };
    }
  }

  private async runCode(input: string, compilationCheckOnly = false): Promise<{
    output: string;
    executionTime: number;
    memoryUsed: number;
    error?: string;
  }> {
    const tempId = uuid();
    const tempDir = path.join(os.tmpdir(), 'judge-test', tempId);
    fs.mkdirSync(tempDir, { recursive: true });

    const codePath = path.join(tempDir, 'solution.cpp');
    const inputPath = path.join(tempDir, 'input.txt');
    const executablePath = path.join(tempDir, 'solution');

    try {
      // Write code to file
      fs.writeFileSync(codePath, this.submission.code);

      // Write input to file
      fs.writeFileSync(inputPath, input);

      // Compile code
      console.log('Compiling code...');
      const compileCmd = `g++ -std=c++17 -o ${executablePath} ${codePath}`;

      const compileResult = await new Promise<{ stdout: string; stderr: string; exitCode: number; }>((resolve) => {
        exec(compileCmd, (error, stdout, stderr) => {
          console.log('compile result is ', { stdout, stderr, exitCode: error ? error.code : 0 });
          resolve({ stdout, stderr, exitCode: error ? error.code || 1 : 0 });
        });
      });

      if (compileResult.exitCode !== 0) {
        return {
          output: '',
          executionTime: 0,
          memoryUsed: 0,
          error: `Compilation error: ${compileResult.stderr}`
        };
      }

      if (compilationCheckOnly) {
        return {
          output: '',
          executionTime: 0,
          memoryUsed: 0
        };
      }

      // Run the compiled code
      console.log('Running code...');
      const result = await this.executeProgram(executablePath, inputPath);
      console.log('run is ', result);

      return result;
    } finally {
      // Clean up
      try {
        fs.rmSync(tempDir, { recursive: true, force: true });
      } catch (err) {
        console.error('Failed to clean up temp directory:', err);
      }
    }
  }

  private async executeProgram(executablePath: string, inputPath: string): Promise<{
    output: string;
    executionTime: number;
    memoryUsed: number;
    error?: string;
  }> {
    return new Promise((resolve) => {
      const startTime = Date.now();
      const inputStream = fs.createReadStream(inputPath);
      const process = spawn(executablePath);

      let output = '';
      let errorOutput = '';
      let timedOut = false;

      // Pipe input to process
      inputStream.pipe(process.stdin);

      // Collect output
      process.stdout.on('data', (data) => {
        output += data.toString();
      });

      process.stderr.on('data', (data) => {
        errorOutput += data.toString();
      });

      // Handle process completion
      process.on('close', (exitCode) => {
        const executionTime = Date.now() - startTime;

        if (timedOut) {
          resolve({
            output,
            executionTime: this.timeLimit,
            memoryUsed: 0,
            error: 'Time limit exceeded'
          });
          return;
        }

        if (exitCode !== 0) {
          resolve({
            output,
            executionTime,
            memoryUsed: 0,
            error: `Runtime error: ${errorOutput || 'Unknown error'}`
          });
          return;
        }

        resolve({
          output,
          executionTime,
          memoryUsed: 0 // In a real scenario, you'd measure actual memory usage
        });
      });

      // Set timeout
      const timeoutId = setTimeout(() => {
        timedOut = true;
        process.kill();
      }, this.timeLimit);

      // Clear timeout if process ends
      process.on('close', () => {
        clearTimeout(timeoutId);
      });
    });
  }
}

// Define test cases for our sample problem
const testCases: TestCase[] = [
  {
    id: "1",
    problemId: "add-two-numbers",
    input: "1 2",
    expectedOutput: "3",
    isExample: true
  },
  {
    id: "2",
    problemId: "add-two-numbers",
    input: "-5 10",
    expectedOutput: "5",
    isExample: false
  },
  {
    id: "3",
    problemId: "add-two-numbers",
    input: "100 200",
    expectedOutput: "300",
    isExample: false
  }
];

// Define correct and incorrect sample submissions for testing
const correctSubmission: Submission = {
  id: "test-submission-1",
  userId: "user123",
  problemId: "add-two-numbers",
  language: Language.CPP,
  code: `
#include <iostream>
using namespace std;

int main() {
    int a, b;
    cin >> a >> b;
    cout << a + b << endl;
    return 0;
}
  `,
  status: Status.PENDING,
  createdAt: new Date(),
  updatedAt: new Date()
};

const incorrectSubmission: Submission = {
  id: "test-submission-2",
  userId: "user123",
  problemId: "add-two-numbers",
  language: Language.CPP,
  code: `
#include <iostream>
using namespace std;

int main() {
    int a, b;
    cin >> a >> b;
    return a-b;
}
  `,
  status: Status.PENDING,
  createdAt: new Date(),
  updatedAt: new Date()
};

const compilationErrorSubmission: Submission = {
  id: "test-submission-3",
  userId: "user123",
  problemId: "add-two-numbers",
  language: Language.CPP,
  code: `
#include <iostream>
using namespace std;

int main() {
    int a, b;
    cin >> a >> b
    cout << a + b << endl;  // Missing semicolon
    return 0;
}
  `,
  status: Status.PENDING,
  createdAt: new Date(),
  updatedAt: new Date()
};

// Run all test cases
async function testJudgeSystem() {
  console.log("================ Testing Correct Submission ================");
  const correctJudge = new CppJudge(correctSubmission, testCases);
  const correctResult = await correctJudge.judge();
  console.log("\nFinal result:", JSON.stringify(correctResult, null, 2));

  console.log("\n================ Testing Incorrect Submission ================");
  const incorrectJudge = new CppJudge(incorrectSubmission, testCases);
  const incorrectResult = await incorrectJudge.judge();
  console.log("\nFinal result:", JSON.stringify(incorrectResult, null, 2));

  console.log("\n================ Testing Compilation Error Submission ================");
  const compileErrorJudge = new CppJudge(compilationErrorSubmission, testCases);
  const compileErrorResult = await compileErrorJudge.judge();
  console.log("\nFinal result:", JSON.stringify(compileErrorResult, null, 2));
}

// Run tests
testJudgeSystem().catch(console.error);