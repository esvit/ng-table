RELEASING
============

1. Minify source files: `grunt`

2. Make the test pass: `karma start`

3. Update [semver](http://semver.org/) version number in:
    - package.json
    - bower.json

4. Update CHANGELOG.md: 
    - `node changelog.js n.n.n CHANGELOG.md` where `n.n.n` is the version number used in step above
    - modify the generated section in CHANGELOG.md as required

5. Push the following files to git:
    - dist/*.*
    - bower.json 
    - package.json
    - CHANGELOG.md

6. Create a [github release](https://help.github.com/articles/creating-releases/) with same version used in steps above