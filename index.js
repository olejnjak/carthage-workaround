const core = require('@actions/core');
const { execSync } = require("child_process");

try {
    const action = core.getInput('action')
    execSync(`./carthage.sh ${action}`);
} catch (error) {
    core.setFailed(error.message);
}