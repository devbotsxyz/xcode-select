// MIT License - Copyright (c) 2020 Stefan Arentz <stefan@devbots.xyz>
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.


const core = require('@actions/core');
const github = require('@actions/github');

const xcode = require('./xcode');


const parseConfiguration = async () => {
    const configuration = {
        version: core.getInput("version"),
        beta: core.getInput("beta") === "true",
    };

    if (!xcode.isValidVersionSpecification(configuration.version)) {
        throw Error(`Invalid version specification: ${configuration.version}`);
    }

    return configuration;
};


const main = async () => {
    try {
        if (process.platform !== "darwin") {
            throw new Error("This action can only run on macOS.");
        }

        const configuration = await parseConfiguration();

        let installs = await xcode.discoverInstalls("/Applications", configuration.beta);
        if (installs.length == 0) {
            throw Error("No Xcode installs could be found. This should not happen.");
        }

        let install = xcode.matchInstall(installs, configuration.version, configuration.beta);
        if (install == null) {
            throw Error(`Could not match Xcode version ${configuration.version} in available versions <${installs.map(i => i.shortVersion)}>.`);
        }

        core.info(`Selecting Xcode ${install.shortVersion} at ${install.path}`);
        await xcode.select(install);
    } catch (error) {
        core.setFailed(error.message);
    }
};


main();
