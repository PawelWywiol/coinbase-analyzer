import { spawn } from 'node:child_process';
import { SSH } from '../config';
import { SSHConnectionError, SSHTimeoutError } from '../errors';

interface SSHConfig {
  host: string;
  user: string;
}

export const getSSHConfig = (): SSHConfig & { claudePath: string } => {
  const host = process.env.CLAUDE_SSH_HOST;
  const user = process.env.CLAUDE_SSH_USER;
  const claudePath = process.env.CLAUDE_SSH_PATH;

  if (!host || !user || !claudePath) {
    const missing = [
      !host && 'CLAUDE_SSH_HOST',
      !user && 'CLAUDE_SSH_USER',
      !claudePath && 'CLAUDE_SSH_PATH',
    ].filter(Boolean);
    throw new SSHConnectionError(`Missing env vars: ${missing.join(', ')}`);
  }

  return { host, user, claudePath };
};

export const executeSSHCommand = (command: string, config: SSHConfig): Promise<string> =>
  new Promise((resolve, reject) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      controller.abort();
      reject(new SSHTimeoutError(`Command timed out after ${SSH.COMMAND_TIMEOUT_MS}ms`));
    }, SSH.COMMAND_TIMEOUT_MS);

    const ssh = spawn(
      'ssh',
      [
        '-o',
        `ConnectTimeout=${Math.floor(SSH.CONNECT_TIMEOUT_MS / 1000)}`,
        '-o',
        'BatchMode=yes',
        '-o',
        'StrictHostKeyChecking=yes',
        `${config.user}@${config.host}`,
        command,
      ],
      { signal: controller.signal },
    );

    let stdout = '';
    let stderr = '';

    ssh.stdout.on('data', (data) => {
      stdout += data.toString();
    });
    ssh.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    ssh.on('close', (code) => {
      clearTimeout(timeout);

      if (code === 255) {
        reject(new SSHConnectionError(stderr || 'SSH connection failed'));
        return;
      }

      if (code !== 0) {
        reject(new SSHConnectionError(stderr || `Command exited with code ${code}`));
        return;
      }

      resolve(stdout);
    });

    ssh.on('error', (err) => {
      clearTimeout(timeout);
      reject(new SSHConnectionError(err.message));
    });
  });
