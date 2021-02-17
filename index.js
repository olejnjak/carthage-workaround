const core = require('@actions/core')
const exec = require('@actions/exec')

async function execForResult(cmd, args) {
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

async function runCarthageWorkaround(action) {
    core.info("Running workaround script with parameters:")
    core.info(`\t${action}`)
    await exec.exec(`${__dirname}/carthage.sh ${action}`)
}

async function main() {
    const action = core.getInput('action')
    const force = core.getInput('force').toLowerCase() === "true"

    if (force) {
        core.info("Forced run of workaround script")
        await runCarthageWorkaround(action)
        return
    }

    const xcodeBuildOutput = await execForResult("xcodebuild", ["-version"])
    const xcodeVersion = parseFloat(xcodeBuildOutput.split('\n')[0].split(' ')[1])
    const usesXCFrameworks = action.includes("--use-xcframeworks")
    
    if (xcodeVersion >= 12 && !usesXCFrameworks) {
        core.info(`Using Xcode ${xcodeVersion} and not using --use-xcframeworks`)
        await runCarthageWorkaround(action)
    } else {
        core.info(`Using Xcode ${xcodeVersion} or using --use-xcframeworks`)
        await exec.exec(`carthage ${action}`)
    }
}

main().catch(err => core.setFailed(err.message))