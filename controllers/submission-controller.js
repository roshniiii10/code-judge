const submissionModel = require('../models/submission-model');
const problemModel = require('../models/problem-model');
const { executePython, executeCpp } = require('../utils/execute-code');

module.exports.submitCode = async (req, res) => {
    try {
        const { problemId, language, code } = req.body;

        // Fetch problem with testcases
        const problem = await problemModel.findById(problemId);
        if (!problem) {
            return res.status(404).json({ success: false, message: 'Problem not found' });
        }

        let passedCases = 0;
        const totalCases = problem.testcases.length;
        let finalStatus = 'Accepted';
        let errorOutput = null;

        // Run user code against every test case in a loop
        for (const testcase of problem.testcases) {
            try {
                let output;

                if (language === 'python') {
                    output = await executePython(code, testcase.input);
                } else if (language === 'cpp') {
                    output = await executeCpp(code, testcase.input);
                } else {
                    return res.status(400).json({ success: false, message: 'Unsupported language' });
                }

                // Check standard output against expected output
                if (output === testcase.expectedOutput.trim()) {
                    passedCases++;
                } else {
                    finalStatus = 'Wrong Answer';
                    break; // Stop evaluating remaining test cases
                }

            } catch (execErr) {
                if (execErr.type === 'CE') {
                    finalStatus = 'Compilation Error';
                } else if (execErr.type === 'TLE') {
                    finalStatus = 'Time Limit Exceeded';
                } else {
                    finalStatus = 'Runtime Error';
                }

                errorOutput = execErr.message;
                break; // Stop evaluating remaining test cases on execution error
            }
        }

        // Save submission record in database
        const submission = await submissionModel.create({
            user: req.user._id,
            problem: problemId,
            language,
            code,
            status: finalStatus,
            passedCases,
            totalCases,
            errorMessage: errorOutput
        });

        return res.status(200).json({
            success: true,
            data: submission
        });

    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};