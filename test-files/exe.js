const { exec, spawn } = require('child_process');

cmdStr = './adhoc-network test 123';
exec(cmdStr, (err, data) => {
    console.log(err);
    console.log(data.toString());
});
