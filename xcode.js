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


const glob = require("glob");
const execa = require('execa');
const semver = require('semver');
const fs = require('fs')


const isValidVersionSpecification = (v) => {
    return v == "latest" || semver.valid(semver.coerce(v)) != null;
};


const matchVersionInPath = (path) => {
    let match = path.match(/Xcode_(.+)\.app/);
    if (match === null) {
        return null;
    }
    return match[1];
};


const discoverVersions = () => {
    let versions = [];
    const paths = glob.sync("/Applications/Xcode_*.app");
    for (const path of paths) {
        let v = matchVersionInPath(path);
        if (v != null) {
            versions.push({path: path, shortVersion: v, version: semver.coerce(v)});
        }
    }
    return versions.sort((a, b) => semver.rcompare(a.version, b.version));
};


const latestVersion = (versions) => {
    return versions[0];
};


const matchVersion = (versions, spec) => {
    return versions.find(version => semver.satisfies(version.version, spec));
};


const findVersion = (versions, spec) => {
    if (spec == 'latest') {
        return latestVersion(versions);
    }
    return matchVersion(versions, spec);
};


const select = async (version) => {
    if (!fs.existsSync(version.path)) {
        throw Error(`Cannot select Xcode at <${version.path}>: the path does not exist. `);
    }
    await execa("sudo", ["xcode-select", "-s", version.path]);
}


module.exports = {
    isValidVersionSpecification,
    matchVersionInPath,
    discoverVersions,
    latestVersion,
    matchVersion,
    findVersion,
    select
};
