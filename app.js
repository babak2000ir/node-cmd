const { spawn } = require('node:child_process');

const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
const app = new Koa();
app.use(bodyParser());

app.use(async (ctx, next) => {
    const result = await asyncRunInShell();
    ctx.body = result;
});

app.listen(3000);
console.log("Server listening on port 3000");

async function asyncRunInShell() {
    return new Promise((resolve) => {
        let result = "";
        const cmd = spawn('dir', [], { shell: true });
    
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
            result += `child process exited with code ${code}`;
            resolve(result);
        });
    });
  }