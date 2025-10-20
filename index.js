const { program } = require('commander');
const fs = require('fs');
const http = require('http');
const {XMLBuilder} = require('fast-xml-parser');
const url = require('url');

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
//////////////////////////////////////////////////////

const server = http.createServer((req, res) => {
    const query = url.parse(req.url, true).query;

    fs.readFile(options.input, 'utf-8', (err, data) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Error reading input file');
            returt;
        }
        
    const lines = data.trim().split('\n'); 
    
    let flights = [];
    try {
        flights = lines.map(line => JSON.parse(line)); 
    } catch (e) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Invalid JSON line format');
        return;
    }
    
    let filteredFlights = flights;

    if (query.airtime_min) {
      const minAirTime = Number(query.airtime_min);
      filteredFlights = filteredFlights.filter(f => f.AIR_TIME && Number(f.AIR_TIME) > minAirTime);
    }

    const showDate = query.date === 'true';

    const xmlObj = {
      flights: {
        flight: filteredFlights.map(f => {
          const obj = {};
          if (showDate) obj.date = f.FL_DATE;
          if (f.AIR_TIME) obj.air_time = f.AIR_TIME;
          if (f.DISTANCE) obj.distance = f.DISTANCE;
          return obj;
        }),
      },
    };

    const builder = new XMLBuilder({ format: true });
    const xml = builder.build(xmlObj);

    res.writeHead(200, { 'Content-Type': 'application/xml' });
    res.end(xml);
  });

});

server.listen(Number(options.port), options.host, () => {
    console.log(`Server running at http://${options.host}:${options.port}/`);
});

    



