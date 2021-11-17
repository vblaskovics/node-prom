const http = require("http");
const url = require("url");
const client = require("prom-client");

// Create a Registry which registers the metrics
const register = new client.Registry();

// Add a default label which is added to all metrics
// register.setDefaultLabels({
//   app: "node-prom-app",
// });

// Enable the collection of default metrics
client.collectDefaultMetrics({ register });

// Define the HTTP server
const server = http.createServer(async (req, res) => {
  // Retrieve route from request object
  const route = url.parse(req.url).pathname;
  console.log('GET', route);
  switch (route) {
    case "/metrics":
      // Return all metrics the Prometheus exposition format
      // res.setHeader('Content-Type', register.contentType)
      res.writeHead(200, { "Content-Type": register.contentType });
      let metrics = await register.metrics();
      res.write(metrics);
      res.end();
      break;
    default:
      res.writeHead(200, { "Content-Type": "text/html" });
      res.write("<h1>Node metrics server</h1>");
      res.write('Open <a href="/metrics">metrics</a>');
      res.end();
      break;
  }
});

// Start the HTTP server which exposes the metrics on http://localhost:8080/metrics
server.listen(8080);
console.log(`Server running at http://localhost:8080/`);
console.log(`Open metrics at http://localhost:8080/metrics`);
