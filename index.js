const core = require('@actions/core')
const exec = require('@actions/exec')

async function main() {
    const action = core.getInput('action')
    
    await exec.exec(`${__dirname}/carthage.sh ${action}`)
}

main().catch(err => core.setFailed(err.message))