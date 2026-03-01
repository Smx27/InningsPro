const migrations = {
  journal: {
    entries: [
      {
        idx: 0,
        when: 1767225600000,
        tag: '0000_init_matches',
        breakpoints: true,
      },
    ],
  },
  migrations: {
    m0000: `CREATE TABLE IF NOT EXISTS matches (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      team_a TEXT NOT NULL,
      team_b TEXT NOT NULL,
      overs INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'scheduled'
    );`,
  },
};

export default migrations;
