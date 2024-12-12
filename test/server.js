import http from 'http';

// 创建HTTP服务器
const server = http.createServer((req, res) => {
  console.log(req.url);

  // 设置响应头
  res.writeHead(200, { 'Content-Type': 'text/plain' });

  // 发送响应内容
  res.end('Hello, World!\n');
});

// 服务器监听端口3000
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
