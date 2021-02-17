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
    core.info("Running workaround script with parameters:")
    core.info(`\t${action}`)
    await exec.exec(`${__dirname}/carthage.sh ${action}`)
}

async function main() {
    const action = core.getInput('action')
    const force = core.getInput('force')

    if (force) {
        core.info("Forced run of workaround script")
        runCarthageWorkaround()
        return
    }

    const xcodeVersion = parseFloat(execForResult("xcodebuild -version | head -n1 | cut -f2 -d' '", []))
    const usesXCFrameworks = action.includes("--use-xcframeworks")
    
    if (xcodeVersion >= 12 && !usesXCFrameworks) {
        core.info(`Using Xcode ${xcodeVersion} and not using --use-xcframeworks`)
        runCarthageWorkaround()
    } else {
        core.info(`Using Xcode ${xcodeVersion} or using --use-xcframeworks`)
        await exec.exec(`carthage ${action}`)
    }
}

main().catch(err => core.setFailed(err.message))