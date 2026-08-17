import { spawn } from 'child_process';
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SSH = 'C:\\Windows\\System32\\OpenSSH\\ssh.exe';
const PORT = 5173;
const RETRY_DELAY = 5000;

function startTunnel() {
  const attempt = { count: 0 };

  function connect() {
    attempt.count++;
    console.log(`[${ts()}] Connecting to Serveo (attempt #${attempt.count})...`);

    const proc = spawn(SSH, [
      '-o', 'StrictHostKeyChecking=no',
      '-o', 'ServerAliveInterval=30',
      '-o', 'ServerAliveCountMax=3',
      '-o', 'ExitOnForwardFailure=yes',
      '-o', 'TCPKeepAlive=yes',
      '-R', `80:localhost:${PORT}`,
      'serveo.net'
    ], { stdio: ['ignore', 'pipe', 'pipe'] });

    proc.stdout.on('data', (data) => {
      const line = data.toString().trim();
      console.log(line);

      const match = line.match(/(https?:\/\/[^\s]+)/);
      if (match) {
        const url = match[1];
        console.log(`\n  TUNNEL LIVE: ${url}`);
        console.log(`  Auto-reconnects on disconnect. Keep this terminal open.\n`);

        const envPath = join(__dirname, '.env');
        writeFileSync(envPath, `VITE_PUBLIC_URL=${url}\n`);
        console.log(`  .env updated. Restart Vite to refresh QR code:`);
        console.log(`  bun run dev --host\n`);
      }
    });

    proc.stderr.on('data', (data) => {
      const line = data.toString().trim();
      if (line) console.log(`  [stderr] ${line}`);
    });

    proc.on('close', (code) => {
      console.log(`[${ts()}] Tunnel disconnected (exit: ${code}). Reconnecting in ${RETRY_DELAY / 1000}s...`);
      setTimeout(connect, RETRY_DELAY);
    });

    proc.on('error', (err) => {
      console.log(`[${ts()}] SSH error: ${err.message}. Retrying in ${RETRY_DELAY / 1000}s...`);
      setTimeout(connect, RETRY_DELAY);
    });
  }

  connect();
}

function ts() {
  return new Date().toLocaleTimeString();
}

console.log('='.repeat(50));
console.log('  PERSISTENT SERVEO TUNNEL');
console.log('  Designed to run for weeks/months');
console.log('  Auto-reconnects on disconnect');
console.log('  Keep this terminal open');
console.log('='.repeat(50));
console.log('');

startTunnel();
