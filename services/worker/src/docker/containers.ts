import * as path from 'path';

export interface ContainerConfig {
  image: string;
  workDir: string;
  compilationCommand?: string[];
  executionCommand: string[];
  compilationTimeout?: number;
  maxMemory: number;
  maxCpuTime: number;
  networkEnabled: boolean;
  securityOpts: string[];
}

export interface DockerMountConfig {
  source: string;
  target: string;
  type: 'bind' | 'volume' | 'tmpfs';
}

export interface RunContainerOptions {
  image: string;
  cmd: string[];
  mounts: DockerMountConfig[];
  stdin?: string;
  timeoutMs?: number;
  memory?: string;
  cpuPeriod?: number;
  cpuQuota?: number;
  networkMode?: string;
  securityOpt?: string[];
  workingDir?: string;
}

const DEFAULT_SECURITY_OPTS = [
  'no-new-privileges',
  'seccomp=unconfined'
];

// Configuration for C++ container
export const CPP_CONTAINER: ContainerConfig = {
  image: 'gcc:latest',
  workDir: '/app',
  compilationCommand: ['g++', '-std=c++17', '-O2', '-Wall', '-o', 'solution', 'solution.cpp'],
  executionCommand: ['./solution'],
  compilationTimeout: 10000, // 10 seconds
  maxMemory: 512, // 512 MB
  maxCpuTime: 2000, // 2 seconds
  networkEnabled: false,
  securityOpts: [...DEFAULT_SECURITY_OPTS]
};

// Configuration for Python container
export const PYTHON_CONTAINER: ContainerConfig = {
  image: 'python:3.9-slim',
  workDir: '/app',
  executionCommand: ['python', 'solution.py'],
  maxMemory: 512, // 512 MB
  maxCpuTime: 5000, // 5 seconds
  networkEnabled: false,
  securityOpts: [...DEFAULT_SECURITY_OPTS]
};

// Configuration for JavaScript (Node.js) container
export const JAVASCRIPT_CONTAINER: ContainerConfig = {
  image: 'node:16-slim',
  workDir: '/app',
  executionCommand: ['node', 'solution.js'],
  maxMemory: 512, // 512 MB
  maxCpuTime: 3000, // 3 seconds
  networkEnabled: false,
  securityOpts: [...DEFAULT_SECURITY_OPTS]
};

// Get container configuration based on language
export function getContainerConfig(language: string): ContainerConfig {
  switch (language.toUpperCase()) {
    case 'CPP':
      return CPP_CONTAINER;
    case 'PYTHON':
      return PYTHON_CONTAINER;
    case 'JAVASCRIPT':
      return JAVASCRIPT_CONTAINER;
    default:
      throw new Error(`Unsupported language: ${language}`);
  }
}

// Generate Docker run options from container configuration
export function getRunOptions(
  config: ContainerConfig,
  mountSource: string,
  cmd: string[] = config.executionCommand,
  stdin?: string
): RunContainerOptions {
  return {
    image: config.image,
    cmd,
    mounts: [
      {
        source: mountSource,
        target: config.workDir,
        type: 'bind'
      }
    ],
    stdin,
    timeoutMs: config.maxCpuTime,
    memory: `${config.maxMemory}m`,
    cpuPeriod: 100000,
    cpuQuota: 100000, // 1 CPU core
    networkMode: config.networkEnabled ? 'bridge' : 'none',
    securityOpt: config.securityOpts,
    workingDir: config.workDir
  };
}

// Generate Docker run options for compilation
export function getCompilationOptions(
  config: ContainerConfig,
  mountSource: string
): RunContainerOptions | null {
  if (!config.compilationCommand) {
    return null;
  }

  return {
    image: config.image,
    cmd: config.compilationCommand,
    mounts: [
      {
        source: mountSource,
        target: config.workDir,
        type: 'bind'
      }
    ],
    timeoutMs: config.compilationTimeout || 10000,
    memory: `${config.maxMemory}m`,
    cpuPeriod: 100000,
    cpuQuota: 100000, // 1 CPU core
    networkMode: 'none',
    securityOpt: config.securityOpts,
    workingDir: config.workDir
  };
}