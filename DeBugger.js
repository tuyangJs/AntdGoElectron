const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('');
console.log('\x1b[36m%s\x1b[0m', '项目正在初始化...');
console.log('');

const electronPath = path.join(__dirname, 'node_modules', '.bin', 'electron');

// Set desired port here
const desiredPort = 8281;  //修改端口

function runCommand(command, args, label, onStdout, onClose) {
  const env = Object.create(process.env); // Clone current environment variables
  env.PORT = desiredPort; // Set the desired port

  const proc = spawn(command, args, {
    stdio: ['pipe', 'pipe', 'pipe'],
    shell: true,
    env, // Pass the environment variables
  });

  let stdoutBuffer = '';
  proc.stdout.on('data', (data) => {
    stdoutBuffer += data.toString();
    const lines = stdoutBuffer.split('\n');
    lines.forEach((line) => {
      if (line) {
        console.log(`\x1b[90m[${label}]\x1b[0m ${line}`);
      }
    });
    stdoutBuffer = lines.pop(); // Keep the last line for next chunk
    if (onStdout) {
      onStdout(data.toString());
    }
  });

  proc.stderr.on('data', (data) => {
    process.stderr.write(`\x1b[90m[${label}]\x1b[0m ${data.toString()}`);
  });

  proc.on('error', (err) => {
    console.error(`调试出错！ ${command}: ${err}`);
  });

  proc.on('close', (code) => {
    console.log(`\x1b[31m%s\x1b[0m`, `[${label}] Process exited with code ${code}`);
    if (code !== 0) {
      console.error(`Command ${command} ${args.join(' ')} exited with code ${code}`);
    }
    if (onClose) {
      onClose();
    }
  });
  return proc;
}

const isWin = process.platform === 'win32';
const command = isWin ? 'cmd' : 'sh';
const args = isWin ? ['/c', 'npx umi dev'] : ['-c', 'npx umi dev'];

let networkAddress = null;
let webpackCompiled = false; // Flag to track if Webpack compilation is detected
console.log('\x1b[36m%s\x1b[0m', '-> 启动 Umi & Ant Design ');
let umiProc = runCommand(command, args, 'umi', (output) => {
  // Check for network address
  const networkMatch = output.match(/Network:\s*(http:\/\/\d+\.\d+\.\d+\.\d+:\d+)/);
  if (networkMatch) {
    networkAddress = networkMatch[1];
  }
  // Check for Webpack compiled only once
  if (!webpackCompiled) {
    const webpackMatch = output.match(/\[Webpack\] Compiled/);
    if (webpackMatch && networkAddress) {
      webpackCompiled = true; // Set flag to true to ensure it's only processed once

      // Stop further umi output
      umiProc.stdout.pause();

      setTimeout(() => {
        console.log('');
        console.log(`\x1b[32mUmi 编译成功\x1b[0m URL → \x1b[36m${networkAddress}\x1b[0m`);
        startCountdown(4, '\x1b[32m即将启动 Electron\x1b[0m', () => {
          console.log('\x1b[36m%s\x1b[0m', '-> 启动 Electron ......');
          console.log();
          let electronProc = runCommand(electronPath, ['.', '--my-Url', networkAddress], 'electron', null, () => {
            console.log('\x1b[33m%s\x1b[0m', '-> Electron 已结束，正在停止 Umi ...');
            if (umiProc) {
              umiProc.stdin.end(); // End standard input stream
              umiProc.stdout.end(); // End standard output stream
              umiProc.stderr.end(); // End standard error stream
              umiProc.kill('SIGTERM'); // Try to send SIGTERM signal to stop umi
              setTimeout(() => {
                if (umiProc.exitCode === null) { // If process is still running
                  umiProc.kill('SIGKILL'); // Force terminate process
                }
                console.log('\x1b[33m%s\x1b[0m', '-> 调试结束 <-');
              }, 2000); // Wait for 2 seconds before forcing kill
            }
          });
        });
      }, 2000);
    }
  }
});

function startCountdown(seconds, text, callBack) {
  console.log('');

  // Save the original stdout
  const originalStdout = process.stdout;

  // Create a writable stream to null device (Unix) or NUL (Windows)
  const nullStream = fs.createWriteStream(process.platform === 'win32' ? 'NUL' : '/dev/null');

  // Redirect stdout to nullStream
  process.stdout = nullStream;

  let remaining = seconds;
  const interval = setInterval(() => {
    process.stdout.write(`\r${text} ${remaining}秒`);
    remaining--;
    if (remaining < 0) {
      clearInterval(interval);

      // Restore the original stdout
      process.stdout = originalStdout;

      console.log(''); // Print a new line after countdown

      callBack();
    }
  }, 1000);
}
