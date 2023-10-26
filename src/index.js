const { clickhouseClient } = require("./config/config");
const express = require("express");
const cros = require("cors");

const app = express();

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(cros());

app.options("*", cros());

app.listen(5000, (err) => {
  if (err) {
    console.log("connection error");
  } else {
    console.log("connected to 5000");
  }
});

//get all data from my_table
app.get("/get/all-data", async (req, res) => {
  try {
    const resultSet = await clickhouseClient.query({
      query: "SHOW DATABASES",
      format: "JSONEachRow",
    });
    const dataset = await resultSet.json();
    return res.status(200).send(dataset);
  } catch (err) {
    console.log(err);
    return res.status(400).send("query failed");
  }
});

//insert data to the my_table
app.post("/insert/data", async (req, res) => {
  try {
    const { name, age, email, is_active } = req.body;
    const resultSet = await clickhouseClient.insert({
      table: "my_table",
      values: { name, age, email, is_active },
      format: "JSONEachRow",
    });
    return res.status(200).send(resultSet);
  } catch (error) {
    console.log(error);
    return res.status(400).send("query failed");
  }
});

//update my_table data
app.put("/update/:id", async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;

    const resultSet = await clickhouseClient.command({
      query: `ALTER TABLE my_table UPDATE name='${name}' WHERE id=${id}`,
    });

    return res.status(200).send(resultSet);
  } catch (error) {
    console.log(error);
    return res.status(400).send("query failed");
  }
});

//delete my_table data
app.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const resultSet = await clickhouseClient.command({
      query: `ALTER TABLE my_table DELETE WHERE id = ${id}`,
    });

    return res.status(200).send(resultSet);
  } catch (error) {
    console.log(error);
    return res.status(400).send("query failed");
  }
});
