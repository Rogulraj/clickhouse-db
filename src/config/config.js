const { createClient } = require("@clickhouse/client");

const clickhouseClient = createClient({
  host: "http://localhost:8123",
  username: "default",
  password: "",
});

module.exports = { clickhouseClient };
