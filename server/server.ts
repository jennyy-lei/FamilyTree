import * as express from 'express';
import * as path from 'path';

const app = express();

const projectRoot = path.join(__dirname, '..');
const staticPath = path.join(projectRoot, 'static');
const sourcePath = path.join(projectRoot, 'client', 'ts');
const clientDistPath = path.join(projectRoot, 'dist', 'client');

app.get('/', (req: express.Request, res: express.Response) => {
  res.sendFile(path.join(staticPath, 'index.html'));
});

console.log(projectRoot);

app.use('/', express.static(staticPath));
app.use('/dist', express.static(clientDistPath));

// Devel use only, hide behind flag.
app.use('/client/ts', express.static(path.join(sourcePath)));

app.listen(8888, () => {
  console.log('Server listening on port 8888!')
});
