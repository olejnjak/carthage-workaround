const core = require('@actions/core');
const github = require('@actions/github');
const { execSync } = require("child_process");

try {
    const action = core.getInput('action');
    const ref = github.context.ref;
    
    execSync(`curl https://raw.githubusercontent.com/olejnjak/carthage-workaround/${ref}/carthage.sh > carthage.sh`);
    execSync(`chmod +x carthage.sh`);
    execSync(`./carthage.sh ${action}`);
} catch (error) {
    core.setFailed(error.message);
}