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


const fs = require("fs")
const path = require("path");

const execa = require("execa");
const plist = require("plist");
const semver = require("semver");


const isValidVersionSpecification = (v) => {
    return v == "latest" || semver.valid(semver.coerce(v)) != null;
};


const getInfo = async (p) => {
    const info = plist.parse(fs.readFileSync(path.join(p, "Contents/Info.plist"), "utf8"));
    return {
        beta: info["CFBundleIconName"].includes("Beta"),
        version: semver.coerce(info["CFBundleShortVersionString"]),
        shortVersion: info["CFBundleShortVersionString"],
        path: p
    };
};


const discoverInstalls = async (root, beta) => {
    let installs = [];

    const dir = await fs.promises.opendir(root);

    for await (const dirent of dir) {
        if (dirent.name.startsWith("Xcode_") && !dirent.isSymbolicLink()) {
            const info = await getInfo(path.join(root, dirent.name));
            if (info.beta === beta) {
                installs.push(info);
            }
        }
    }

    return installs.sort((a, b) => semver.rcompare(a.version, b.version));
};


const matchInstall = (installs, spec) => {
    if (spec === "latest") {
        return installs[0];
    }
    return installs.find(install => semver.satisfies(install.version, spec));
};


const select = async (version) => {
    if (!fs.existsSync(version.path)) {
        throw Error(`Cannot select Xcode at <${version.path}>: the path does not exist. `);
    }
    await execa("sudo", ["xcode-select", "-s", version.path]);
}


module.exports = {
    isValidVersionSpecification,
    discoverInstalls,
    matchInstall,
};
