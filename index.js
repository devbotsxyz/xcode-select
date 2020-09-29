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


const main = async () => {
    try {
        if (process.platform !== "darwin") {
            throw new Error("This action can only run on macOS.");
        }

        let requestedVersion = core.getInput('version', {required: true});
        if (!xcode.isValidVersionSpecification(requestedVersion)) {
            throw Error(`Invalid version specification: ${requestedVersion}`);
        }

        let availableVersions = xcode.discoverVersions();
        if (availableVersions.length == 0) {
            throw Error("No Xcode installs could be found.");
        }

        let version = xcode.findVersion(availableVersions, requestedVersion);
        if (version == null) {
            throw Error(`Could not match Xcode version <${requestedVersion}> in <${availableVersions.map(v => v.shortVersion)}>.`);
        }

        console.log(`Selecting Xcode <${version.shortVersion}> at <${version.path}>`);
        await xcode.select(version);
    } catch (err) {
        core.setFailed(err.message);
    }
};


main();
