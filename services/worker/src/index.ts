import { JudgeFactory } from "./judge/judgeFactory";
import { SubmissionWorker } from "./queue/getData";
import { Language, STATUS, Submission, TestCase } from "./types";

// Initialize the submission worker
const submissionWorker = new SubmissionWorker();

// Define test cases for our sample problem
const testCases: TestCase[] = [
  {
    id: "1",
    problemId: "add-two-numbers",
    input: "1 2",
    expected : "3",
    isHidden:false
  },
  {
    id: "2",
    problemId: "add-two-numbers",
    input: "-5 10",
    expected: "5",
    isHidden: false
  },
  {
    id: "3",
    problemId: "add-two-numbers",
    input: "100 200",
    expected: "300",
    isHidden: false
  }
];

// Define a sample submission
const submission: Submission = {
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
        cout << (a+b) << endl;
        return 0;
    }
  `,
  status: STATUS.RUNNING,
  createdAt: new Date(),
};

const shutdown = async () => {
  console.log('Shutting down worker...');
  await submissionWorker.close();
  process.exit(0);
};

// Create appropriate judge and run tests
const judge = JudgeFactory.createJudge(submission, testCases);
judge.judge()
  .then((res) => {
    console.log('res is ', res);
  })
  .catch((err) => {
    console.log('error', err);
  });

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
console.log('Submission worker started and listening for jobs...');