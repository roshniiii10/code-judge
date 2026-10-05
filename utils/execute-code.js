const { exec, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const { v4: uuid } = require('uuid');

const tempDir = path.join(__dirname, '../temp');
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
}

const executePython = (code, input) => {
    return new Promise((resolve, reject) => {
        const jobId = uuid();
        const codePath = path.join(tempDir, `${jobId}.py`);

        // 1. Write Python code to temporary file
        // Remove non-breaking spaces (U+00A0) and replace with standard spaces
        const cleanCode = code.replace(/\u00A0/g, ' ');
        fs.writeFileSync(codePath, cleanCode);

        // 2. Spawn Python process directly
        const child = spawn('python', [codePath]);

        let stdoutData = '';
        let stderrData = '';
        let isTimedOut = false;

        // 3. Set up 2-second timeout guard using setTimeout() and child.kill()
        const timer = setTimeout(() => {
            isTimedOut = true;
            child.kill('SIGKILL'); // Force terminate hanging processes immediately
        }, 2000);

        // 4. Pass testcase input into stdin stream
        if (input) {
            child.stdin.write(input);
        }
        child.stdin.end();

        // 5. Capture output streams
        child.stdout.on('data', (data) => {
            stdoutData += data.toString();
        });

        child.stderr.on('data', (data) => {
            stderrData += data.toString();
        });

        // 6. Handle process completion and cleanup
        child.on('close', (exitCode) => {
            clearTimeout(timer); // Clear timeout guard

            // Clean up temporary script file using fs
            if (fs.existsSync(codePath)) fs.unlinkSync(codePath);

            if (isTimedOut) {
                return reject({ type: 'TLE', message: 'Time Limit Exceeded (2s)' });
            }

            if (exitCode !== 0) {
                return reject({ type: 'RTE', message: stderrData || `Runtime Error (Exit Code ${exitCode})` });
            }

            resolve(stdoutData.trim());
        });

        // Handle unexpected process execution errors
        child.on('error', (err) => {
            clearTimeout(timer);
            if (fs.existsSync(codePath)) fs.unlinkSync(codePath);
            reject({ type: 'RTE', message: err.message });
        });
    });
};

const executeCpp = (code, input) => {
    return new Promise((resolve, reject) => {
        const jobId = uuid();
        const codePath = path.join(tempDir, `${jobId}.cpp`);
        const outPath = path.join(tempDir, `${jobId}.exe`);

        const cleanCode = code.replace(/\u00A0/g, ' ');
        fs.writeFileSync(codePath, cleanCode);

        // 1. Compile Phase
        const compileCommand = `g++ "${codePath}" -o "${outPath}"`;

        exec(compileCommand, (compileErr, stdout, stderr) => {
            if (compileErr) {
                if (fs.existsSync(codePath)) fs.unlinkSync(codePath);
                
                // Explicitly return type 'CE' for Compilation Error
                return reject({
                    type: 'CE',
                    message: stderr || compileErr.message
                });
            }

            // 2. Execution Phase
            const child = spawn(outPath);

            let stdoutData = '';
            let stderrData = '';
            let isTimedOut = false;

            const timer = setTimeout(() => {
                isTimedOut = true;
                child.kill('SIGKILL');
            }, 2000);

            if (input) {
                child.stdin.write(input);
            }
            child.stdin.end();

            child.stdout.on('data', (data) => { stdoutData += data.toString(); });
            child.stderr.on('data', (data) => { stderrData += data.toString(); });

            child.on('close', (exitCode) => {
                clearTimeout(timer);
                if (fs.existsSync(codePath)) fs.unlinkSync(codePath);
                if (fs.existsSync(outPath)) fs.unlinkSync(outPath);

                if (isTimedOut) {
                    return reject({ type: 'TLE', message: 'Time Limit Exceeded (2s)' });
                }

                if (exitCode !== 0) {
                    return reject({ type: 'RTE', message: stderrData || `Runtime Error (Exit Code ${exitCode})` });
                }

                resolve(stdoutData.trim());
            });

            child.on('error', (err) => {
                clearTimeout(timer);
                if (fs.existsSync(codePath)) fs.unlinkSync(codePath);
                if (fs.existsSync(outPath)) fs.unlinkSync(outPath);
                reject({ type: 'RTE', message: err.message });
            });
        });
    });
};

module.exports = { executeCpp, executePython };