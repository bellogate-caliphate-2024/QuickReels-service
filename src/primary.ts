// import cluster from 'cluster';
// import os from 'os';
// import { dirname } from 'path';
// import { fileURLToPath } from 'url';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// const cpuCount = os.cpus().length;

// console.log(`The total number of CPUs: ${cpuCount}`);
// console.log(`Primary process PID: ${process.pid}`);

// if (cluster.isMaster) {
//   for (let i = 0; i < cpuCount; i++) {
//     cluster.fork();
//   }

//   cluster.on('exit', (worker, code, signal) => {
//     console.log(`Worker ${worker.process.pid} died`);
//     console.log('Starting another worker');
//     cluster.fork();
//   });
// } else {
//   // Start your application logic in worker processes
//   console.log(`Worker process PID: ${process.pid}`);
//   // Example: require('./app') or import app from './app';
// }
