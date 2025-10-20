const { program } = require('commander');
const fs = require('fs');
const http = require('http');

program
    .option('-i, --input <path>', 'path to input file')
    .option('-h, --host <host>', 'server host')
    .option('-p, --port <port>', 'server port')

program.parse();
const options = program.opts();

if(!options.input) {
    console.error('Please, specify input file');
    process.exit(1);
}

if (!fs.existsSync(options.input)) { 
    console.error('Cannot find input file');
    process.exit(1);
}

if(!options.host) {
    console.error('Please, specify host parameter');
    process.exit(1);
}

if(!options.port) {
    console.error('Please, specify port parameter');
    process.exit(1);
}

const data = fs.readFileSync(options.input, 'utf-8');

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(data);
});

server.listen(Number(options.port), options.host, () => {
    console.log(`Server running at http://${options.host}:${options.port}/`);
});

    



