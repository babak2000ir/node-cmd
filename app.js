//import node
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

//import npm
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import serve from 'koa-static';
import Router from 'koa-router';

//consts
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//init
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