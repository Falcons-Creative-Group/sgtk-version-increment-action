const core = require('@actions/core')
const github = require('@actions/github')

try {
    // Get the tag and base version from inputs
    let tag = core.getInput('tag');
    console.log(`tag: ${tag}`);

    // 'base-version' input defined in action metadata file
    let baseVersion = core.getInput('base-version');
    console.log(`Base version: ${baseVersion}`);

    // Check if 'tag' is empty, and throw an error if it is
    if (!tag) {
        throw new Error(`Tag is empty. Please provide a value for 'tag' input`);
    }
    
    // Check if 'baseVersion' is empty, and throw an error if it is
    if (!baseVersion) {
        throw new Error(`Base version is empty. Please provide a value for 'base-version' input`);
    }

    // Use regex to extract the version suffix from the tag
    const regex = new RegExp(`${baseVersion}(?:\\.([0-9]+))?`);
    const match = tag.match(regex);

    let versionSuffix = 0;
    if (match && match[1]) {
        versionSuffix = parseInt(match[1], 10);
    } else {
        console.log(`No base version matched in tag: ${tag}. Using base version: ${baseVersion}`);
    }

    // Increase the version suffix
    versionSuffix++;

    // Combine the increased version suffix back with the base version
    const version = `${baseVersion}.${versionSuffix}`;

    // 'version' output defined in action metadata file
    core.setOutput('version', version)

    // Get the JSON webhook payload for the event that triggered the workflow
    const payload = JSON.stringify(github.context.payload, undefined, 2)
    console.log(`The event payload: ${payload}`)

} catch (error) {
    core.setFailed(error.message)
}