import { spawn } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { v4 as uuid } from 'uuid';

export class DockerService {
  private readonly tmpDir: string;

  constructor() {
    this.tmpDir = path.join(os.tmpdir(), 'judge-service');
    if (!fs.existsSync(this.tmpDir)) {
      fs.mkdirSync(this.tmpDir, { recursive: true });
    }
  }

  async runCppCode(
    code: string,
    input: string,
    timeLimit: number=2000,
    memoryLimit:number=512
  ): Promise<{
    output: string;
    executionTime: number;
     memoryUsed: number;
     error?: string
     }>
  {
    const submissionId = uuid()
    const workDir = path.join(this.tmpDir, submissionId);

    fs.mkdirSync(workDir, { recursive: true });

    // write code to file
    const codePath = path.join(workDir, 'solution.cpp');
    fs.writeFileSync(codePath, code);

    // Write input to file
    const inputPath = path.join(workDir, 'input.txt');
    fs.writeFileSync(inputPath, input);

    try{
      const complileResult = await this.runDocker({
        image: 'gcc:latest',
        cmd: ['g++', '-std=c++17', '-o', '/app/solution', '/app/solution.cpp'],
        mounts: [{
          source: workDir,
          target: '/app',
          type: 'bind'
        }],
        timeoutMs: 10000 // 10 seconds for compilation
      })

      console.log('compile result is ',complileResult)

      if (complileResult.exitCode !== 0) {
        return {
          output: '',
          executionTime: 0,
          memoryUsed: 0,
          error: `Compilation error: ${complileResult.stderr}`
        };
      }

       // Run the compiled code
       const startTime = Date.now();
      //  const runResult = await this.runDocker({
      //   image: 'gcc:latest',
      //   cmd: ['/app/solution'],
      //   mounts: [{
      //     source: workDir,
      //     target: '/app',
      //     type: 'bind'
      //   }],
      //   stdin: inputPath, // Pass input during execution
      //   timeoutMs: timeLimit,
      // });
      const runResult = await this.runDocker({
        image: 'gcc:latest',
        cmd: ['sh', '-c', 'cat /app/input.txt | /app/solution'],
        mounts: [{
          source: workDir,
          target: '/app',
          type: 'bind'
        }],
        timeoutMs: timeLimit
      })


      console.log('run result is ', runResult.stdout)

       const executionTime = Date.now() - startTime;

       if (runResult.exitCode !== 0) {
        let errorType = 'Runtime error';
        if (executionTime >= timeLimit) {
          errorType = 'Time limit exceeded';
        }

        return {
          output: '',
          executionTime,
          memoryUsed: runResult.memoryUsed || 0,
          error: `${errorType}: ${runResult.stderr}`
        };
      }
      return {
        output: runResult.stdout,
        executionTime,
        memoryUsed: runResult.memoryUsed || 0
      };
    }finally{
      try {
        fs.rmSync(workDir, { recursive: true, force: true });
      } catch (err) {
        console.error('Failed to clean up temporary files:', err);
      }
    }

  }

  private async runDocker({
    image,cmd,mounts,stdin,timeoutMs,
    memory,cpuPeriod,cpuQuota
  }: {
    image: string;
    cmd: string[];
    mounts: Array<{ source: string; target: string; type: string }>;
    stdin?: string;
    timeoutMs?: number;
    memory?: string;
    cpuPeriod?: number;
    cpuQuota?: number;
  }): Promise<{
    stdout: string;
    stderr: string;
    exitCode: number;
    memoryUsed?: number }>
  {
    return  new Promise((resolve) => {
      const dockerArgs = ['run', '--rm', '--network=none'];

      // Add resource limits
      if (memory) dockerArgs.push('--memory', memory);
      if (cpuPeriod) dockerArgs.push('--cpu-period', cpuPeriod.toString());
      if (cpuQuota) dockerArgs.push('--cpu-quota', cpuQuota.toString());

      // Add mounts
      for (const mount of mounts) {
        dockerArgs.push('--mount', `type=${mount.type},source=${mount.source},target=${mount.target}`);
      }

      // Add image and command
      dockerArgs.push(image, ...cmd);

      // Start the Docker process
      const dockerProcess = spawn('docker', dockerArgs);

      let stdout = '';
      let stderr = '';

      // Handle stdout
      dockerProcess.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      // Handle stderr
      dockerProcess.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      // Handle process completion
      dockerProcess.on('close', (exitCode) => {
        resolve({ stdout, stderr, exitCode: exitCode || 0 });
      });

      // Pipe input if provided
      if (stdin) {
        const inputStream = fs.createReadStream(stdin);
        console.log('input stream is ',stdin)

        inputStream.pipe(dockerProcess.stdin);
      }

      // Set timeout
      if (timeoutMs) {
        setTimeout(() => {
          dockerProcess.kill();
        }, timeoutMs);
      }
    })

  }

}