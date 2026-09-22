{\rtf1\ansi\ansicpg1252\cocoartf2870
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\margl1440\margr1440\vieww27960\viewh17620\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 const express = require('express');\
const \{ createProxyMiddleware \} = require('http-proxy-middleware');\
\
const app = express();\
const PORT = process.env.PORT || 3000;\
\
// Serve a clean UI with an URL bar and iframe wrapper\
app.get('/', (req, res) => \{\
  res.send(`\
    <!DOCTYPE html>\
    <html lang="en">\
    <head>\
      <title>Unblocked Web View</title>\
      <style>\
        body \{ margin: 0; font-family: monospace; background: #0f172a; color: #f8fafc; height: 100vh; display: flex; flex-direction: column; \}\
        .bar \{ display: flex; gap: 8px; padding: 10px; background: #1e293b; \}\
        input \{ flex: 1; padding: 8px 12px; background: #0f172a; border: 1px solid #334155; color: #00ffcc; border-radius: 4px; \}\
        button \{ padding: 8px 16px; background: #00ffcc; border: none; color: #0f172a; font-weight: bold; cursor: pointer; border-radius: 4px; \}\
        iframe \{ flex: 1; border: none; width: 100%; height: 100%; background: #ffffff; \}\
      </style>\
    </head>\
    <body>\
      <div class="bar">\
        <input id="url" value="https://www.coolmathgames.com" placeholder="Enter target site URL..." />\
        <button onclick="loadSite()">Go</button>\
      </div>\
      <iframe id="view" src="/proxy/https://www.coolmathgames.com"></iframe>\
\
      <script>\
        function loadSite() \{\
          let target = document.getElementById('url').value;\
          if (!target.startsWith('http')) target = 'https://' + target;\
          document.getElementById('view').src = '/proxy/' + target;\
        \}\
      </script>\
    </body>\
    </html>\
  `);\
\});\
\
// Proxy handler: removes blocking headers dynamically\
app.use('/proxy/:targetUrl(*)', (req, res, next) => \{\
  const target = req.params.targetUrl;\
\
  createProxyMiddleware(\{\
    target: target,\
    changeOrigin: true,\
    pathRewrite: \{ '^/proxy/.*': '' \},\
    on: \{\
      proxyRes: (proxyRes) => \{\
        // Strip X-Frame-Options & Content-Security-Policy headers so iframes load\
        delete proxyRes.headers['x-frame-options'];\
        delete proxyRes.headers['content-security-policy'];\
        delete proxyRes.headers['frame-options'];\
      \}\
    \}\
  \})(req, res, next);\
\});\
\
app.listen(PORT, () => console.log(`Proxy running on port $\{PORT\}`));}