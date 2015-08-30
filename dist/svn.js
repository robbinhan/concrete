/**
 * Created by robbin on 15/7/28.
 */
(function () {
    var colors, exec, gitContinue, readyCallback;

    exec = require('child_process').exec;

    colors = require('colors');

    readyCallback = null;

    svn = module.exports = {
        runner: '',
        branch: '',
        user: '',
        pass: '',
        config: {
            runner: 'concrete.runner',
            branch: 'concrete.branch',
            user: 'concrete.user',
            pass: 'concrete.pass'
        },
        /**
         *
         * @param target  本地目录
         * @param callback
         */
        init: function (target, callback) {
            var fs, path;
            readyCallback = callback;
            path = require('path');
            if (target.toString().charAt(0) !== '/') {
                target = process.cwd() + '/' + target;
            }
            process.chdir(target);
            svn.target = path.normalize(target + '/.svn/');
            fs = require('fs');
            return fs.exists(svn.target, function (exists) {
                if (exists === false) {
                    console.log(("'" + target + "' is not a valid svn repo").red);
                    process.exit(1);
                }
                return gitContinue();
            });
        },
        pull: function (next) {
            console.log('pull');
            var jobs, out;
            jobs = require('./jobs');
            out = "Pulling......";
            return jobs.updateLog(jobs.current, out, function () {
                console.log(out.grey);
                return exec('svn up ./', (function (_this) {
                    return function (error, stdout, stderr) {
                        if (error != null) {
                            out = "" + error;
                            jobs.updateLog(jobs.current, out);
                            return console.log(out.red);
                        } else {
                            out = "Updated";
                            console.log(stdout);
                            return jobs.updateLog(jobs.current, out, function () {
                                console.log(out.grey);
                                return next();
                            });
                        }
                    };
                })(this));
            });
        }
    };


    gitContinue = function () {
        return readyCallback();
    };

}).call(this);
