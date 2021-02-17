const core = require('@actions/core')
const exec = require('@actions/exec')

function execForResult(cmd, args) {
    var myOutput = ""
    var myError = ""

    const options = {};
    options.listeners = {
    stdout: data => {
        myOutput += data.toString();
    },
    stderr: data => {
        myError += data.toString();
    }
    };

    await exec.exec(cmd, args, options)

    return myOutput
}

function runCarthageWorkaround() {
    await exec.exec(`${__dirname}/carthage.sh ${action}`)
}

async function main() {
    const action = core.getInput('action')
    const force = core.getInput('force')

    if (force) {
        runCarthageWorkaround()
        return
    }

    const xcodeVersion = parseFloat(execForResult("xcodebuild -version | head -n1 | cut -f2 -d' '", []))
    const usesXCFrameworks = action.includes("--use-xcframeworks")
    
    if (xcodeVersion >= 12 && !usesXCFrameworks) {
        runCarthageWorkaround()
    } else {
        await exec.exec(`carthage ${action}`)
    }
}

main().catch(err => core.setFailed(err.message))