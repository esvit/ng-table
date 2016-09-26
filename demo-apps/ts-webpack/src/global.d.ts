// fake the nodejs require function so that we can add 'require' calls for html files;
// these calls to 'require' will then be converted by webpack ngtemplate-loader
// note that I would have prefered to use standard es2015 import for these
// html files but that would have meant using typescript 2 feature of implicit
// ambient modules which in turn would have meant turning off noImplicitAny checks
// which is a VERY bad idea
declare function require(path: string): any;