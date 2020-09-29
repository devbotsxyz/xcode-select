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


const xcode = require("./xcode");


test('matchVersionInPath', () => {
    const tests = {
        "/Applications/Xcode_12.app":     "12",
        "/Applications/Xcode_12.0.app":   "12.0",
        "/Applications/Xcode_12.0.0.app": "12.0.0",
        "/Applications/Xcode_12.2.app":   "12.2",
        "/Applications/Xcode_10.3.1.app": "10.3.1",
        "/Applications/Xcode_10.3.app":   "10.3",
        "/Applications/Xcode_10.3.0.app": "10.3.0",
        "/Applications/Xcode.app":        null,
    };

    for (let [path, version] of Object.entries(tests)) {
        expect(xcode.matchVersionInPath(path)).toEqual(version);
    }
});


test('isValidVersionSpecification', () => {
    const tests = {
        "12": true,
        "12.0": true,
        "12.0.0": true,
        "12.2": true,
        "12.2.0": true,
        "10.3.1": true,
        "latest": true,
        "something": false,
        "": false,
    };

    for (let [version, valid] of Object.entries(tests)) {
        expect(xcode.isValidVersionSpecification(version)).toBe(valid);
    }
});
