const { spawn } = require('child_process');

try {
  const child = spawn('xdg-open', ['http://localhost:9527/']);
  child.on('error', (error) => {
    console.error('Failed to open URL:', error);
  });
  child.on('exit', (code) => {
    if (code !== 0) {
      console.error('Child process exited with code', code);
    }
  });
} catch (error) {
  console.error('An error occurred:', error);
}
