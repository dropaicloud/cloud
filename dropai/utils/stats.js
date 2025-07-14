import fs from 'fs';
import path from 'path';

const statsFile = path.resolve('./stats.json');

function load() {
  try {
    return JSON.parse(fs.readFileSync(statsFile, 'utf8'));
  } catch {
    return { uploads: 0 };
  }
}

export default {
  record(type) {
    const data = load();
    data[type] = (data[type] || 0) + 1;
    fs.writeFileSync(statsFile, JSON.stringify(data));
  },
  get() {
    return load();
  },
};
