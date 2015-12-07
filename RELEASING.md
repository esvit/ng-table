RELEASING
============

1. Update [semver](http://semver.org/) version number in:
    - package.json
    - bower.json

2. Minify source files: `grunt`

3. Make the test pass: `karma start`

4. Update CHANGELOG.md:
    1. `node changelog.js n.n.n` where `n.n.n` is the version number used in step 1. above
    2. copy-paste the generated text into the top of CHANGELOG.md
    3. as required, modify the generated text pasted into CHANGELOG.md

5. Check in the following updated files to git:
    - dist/*.*
    - bower.json
    - package.json
    - CHANGELOG.md

6. Commit:
    - use the commit message 'chore(release): n.n.n distribution files' where 'n.n.n' is the version number used in step 1

7. Use the grunt-release plugin to bump version, tag git and push:
	1. See https://github.com/geddski/grunt-release for version possibilities in order to follow [semver](http://semver.org/) convention
	2. check the good behavior : `grunt release --no-write`
	3. do the release: `grunt release`

8. Create a [github release](https://help.github.com/articles/creating-releases/) with same version used in steps above
    - copy-paste the text just added to CHANGELOG.md as release notes
