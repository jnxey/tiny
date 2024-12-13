import http from 'http';

const server = http.createServer((req, res) => {
  try {
    console.log('---------------------1');
    res.on('error', (error) => {
      console.log(error, '---------------------2');
    });
    JSON.parse('{{');
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('test');
  } catch (err) {
    console.error('Request error:', err);
    res.statusCode = 500;
    res.end('Internal Server Error');
  }

  // setTimeout(() => {
  //   JSON.parse('1234');
  //   res.writeHead(200, { 'Content-Type': 'text/plain' });
  //   res.end('test');
  //   console.log('---------------------1');
  // }, 3000);
  // res.on('finish', () => console.log('finish-----------'));
  // res.on('prefinish', () => console.log('prefinish-----------'));
});

// 监听 error 事件
server.on('error', (err) => {
  console.log(error, '---------------------3');
});

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});
