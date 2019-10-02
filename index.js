var socks = require('socksv5'),
    SSHClient = require('ssh2').Client;

const fixieUrl = process.env.FIXIE_SOCKS_HOST;
const fixieValues = fixieUrl.split(new RegExp('[/(:\\/@)/]+'));

socks.connect({
  host: 'ssh.example.org',
  port: 22,
  proxyHost: fixieValues[2],
  proxyPort: fixieValues[3],
  auths: [socks.auth.UserPassword(fixieValues[0], fixieValues[1])]
}, function(socket) {
  var conn = new SSHClient();
  conn.on('ready', function() {
    conn.exec('uptime', function(err, stream) {
      if (err) throw err;
      stream.on('close', function(code, signal) {
      conn.end();
      }).on('data', function(data) {
        console.log('STDOUT: ' + data);
      }).stderr.on('data', function(data) {
        console.log('STDERR: ' + data);
      });
    });
  }).connect({
    sock: socket,
    username: 'ssh-user',
    privateKey: require('fs').readFileSync('/here/is/my/key')
  });
});
