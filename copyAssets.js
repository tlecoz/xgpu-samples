import fs from 'fs-extra';

fs.copy('public', 'dist/public')
    .then(() => console.log('Assets copied successfully'))
    .catch(err => console.error(err));
