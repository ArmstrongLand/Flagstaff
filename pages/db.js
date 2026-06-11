// ── Firebase Realtime Database helper ──
// All pages import this via <script src="db.js"></script>

const FIREBASE_URL = 'https://flagstaff-armstrong-default-rtdb.firebaseio.com';

const DB = {
  // ── LOW LEVEL ──
  async get(path) {
    const r = await fetch(`${FIREBASE_URL}/${path}.json`);
    if (!r.ok) throw new Error('DB get failed: ' + r.status);
    return r.json();
  },
  async set(path, data) {
    const r = await fetch(`${FIREBASE_URL}/${path}.json`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!r.ok) throw new Error('DB set failed: ' + r.status);
    return r.json();
  },
  async patch(path, data) {
    const r = await fetch(`${FIREBASE_URL}/${path}.json`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!r.ok) throw new Error('DB patch failed: ' + r.status);
    return r.json();
  },
  async del(path) {
    const r = await fetch(`${FIREBASE_URL}/${path}.json`, { method: 'DELETE' });
    if (!r.ok) throw new Error('DB delete failed: ' + r.status);
    return r.json();
  },

  // ── NEIGHBORHOODS (published maps) ──
  async getNeighborhoods() {
    const data = await this.get('neighborhoods');
    return data || {};
  },
  async saveNeighborhood(name, mapData) {
    await this.set(`neighborhoods/${encodeKey(name)}`, { name, data: mapData, updatedAt: Date.now() });
  },
  async getNeighborhood(name) {
    const d = await this.get(`neighborhoods/${encodeKey(name)}`);
    return d ? d.data : null;
  },

  // ── SOLD LOTS ──
  async getSold() {
    const data = await this.get('sold');
    return data || {};
  },
  async setSoldForHood(hood, lotIds) {
    await this.set(`sold/${encodeKey(hood)}`, lotIds);
  },

  // ── WEEK DONE STATE ──
  async getDone() {
    const data = await this.get('done');
    return data || {};
  },
  async setDoneForHood(hood, lotIds) {
    await this.set(`done/${encodeKey(hood)}`, lotIds);
  },

  // ── WEEK LOGS ──
  async getLogs() {
    const data = await this.get('logs');
    if (!data) return [];
    // Firebase returns object with keys, convert to array sorted newest first
    return Object.values(data).sort((a, b) => b.id - a.id);
  },
  async addLog(entry) {
    await this.set(`logs/${entry.id}`, entry);
  }
};

function encodeKey(str) {
  // Firebase keys can't have . # $ [ ]
  return str.replace(/[.#$[\]]/g, '_');
}