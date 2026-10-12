const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

async function ensureEdge() {
  try {
    await req('/json/version');
    return null;
  } catch (e) {
    console.log('Spawning headless Edge...');
    const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
    const proc = spawn(edgePath, [
      '--headless=new',
      '--disable-gpu',
      '--remote-debugging-port=9222',
      '--user-data-dir=' + (process.env.TEMP || 'C:\\Windows\\Temp') + '\\edge_cdp_vines',
      'about:blank'
    ], { detached: true, stdio: 'ignore' });
    proc.unref();
    await new Promise((r) => setTimeout(r, 2000));
    return proc;
  }
}

async function req(path, method = 'GET') {
  return new Promise((resolve, reject) => {
    const r = http.request('http://127.0.0.1:9222' + path, { method }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch (e) { reject(new Error('Parse error on ' + data)); }
      });
    });
    r.on('error', reject);
    r.end();
  });
}

(async () => {
  try {
    await ensureEdge();
    const page = await req('/json/new?http://localhost:3000', 'PUT');
    console.log('Target created:', page.id);
    const ws = new WebSocket(page.webSocketDebuggerUrl);

    let msgId = 1;
    function send(method, params = {}) {
      return new Promise((resolve, reject) => {
        const curId = msgId++;
        function onMessage(event) {
          const msg = JSON.parse(event.data);
          if (msg.id === curId) {
            ws.removeEventListener('message', onMessage);
            if (msg.error) reject(new Error(msg.error.message));
            else resolve(msg.result);
          }
        }
        ws.addEventListener('message', onMessage);
        ws.send(JSON.stringify({ id: curId, method, params }));
      });
    }

    await new Promise((r) => { ws.onopen = r; });
    console.log('Connected to CDP');

    await send('Page.enable');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 960,
      deviceScaleFactor: 1,
      mobile: false
    });

    await new Promise((r) => setTimeout(r, 2000));

    // 1. UConn Hero Screenshot
    const shot1 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('screenshot_uconn_hero.png', Buffer.from(shot1.data, 'base64'));
    console.log('Saved screenshot_uconn_hero.png');

    // Section element screenshots
    const sections = [
      { name: 'vectors', sel: '#overview' },
      { name: 'arch', sel: '#architecture' },
      { name: 'thrusts', sel: '#thrusts' },
      { name: 'quad', sel: '#quad-chart' },
      { name: 'tools', sel: '#software' },
      { name: 'pubs', sel: '#publications' },
      { name: 'team', sel: '#team' },
      { name: 'impacts', sel: '#impacts' },
      { name: 'footer', sel: '.site-footer' }
    ];

    for (const sec of sections) {
      await send('Runtime.evaluate', { expression: `
        (() => {
          const el = document.querySelector('${sec.sel}');
          if (el) {
            const top = Math.max(0, el.getBoundingClientRect().top + window.pageYOffset - 75);
            window.scrollTo({ top: top, behavior: 'instant' });
            document.documentElement.scrollTop = top;
          }
        })()
      ` });
      await new Promise((r) => setTimeout(r, 700));
      const shot = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(`screenshot_uconn_${sec.name}.png`, Buffer.from(shot.data, 'base64'));
      console.log(`Saved screenshot_uconn_${sec.name}.png`);
    }

    // 4. Main Branch Hero
    await send('Page.navigate', { url: 'http://localhost:3000/?branch=main' });
    await new Promise((r) => setTimeout(r, 1500));
    await send('Runtime.evaluate', { expression: 'window.scrollTo(0, 0)' });
    const shotMain = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('screenshot_main_hero.png', Buffer.from(shotMain.data, 'base64'));
    console.log('Saved screenshot_main_hero.png');

    ws.close();
    console.log('Screenshots complete.');
    process.exit(0);
  } catch (err) {
    console.error('Screenshot error:', err);
    process.exit(1);
  }
})();
