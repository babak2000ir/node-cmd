const { spawn } = require('node:child_process');
const path = require('path');

const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
const serve = require('koa-static');
const Router = require('koa-router');

const app = new Koa();
const router = new Router();

app.use(bodyParser());

router.post('/api', async (ctx) => {
    const commandString = ctx.request.body.commandString;
    const result = await asyncRunInShell(commandString);
    ctx.body = result;
});

app.use(router.routes());
app.use(serve(path.join(__dirname, '/static')));

app.listen(3000);
console.log("Server listening on port 3000");

async function asyncRunInShell(cmdString) {
    return new Promise((resolve) => {
        let result = "";

        const command = cmdString.split(' ')[0];
        const args = cmdString.split(' ').splice(1);
        const cmd = spawn(command, args, { shell: true });

        cmd.stdout.on('data', (data) => {
            result += data + "\n";
        });

        cmd.stderr.on('data', (data) => {
            result += data + "\n";
        });

        cmd.stderr.on('error', (err) => {
            result += err + "\n";
        });

        cmd.on('close', (code) => {
            result += `Exit code: ${code}`;
            resolve(result);
        });
    });
}