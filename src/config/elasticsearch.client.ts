import { Client } from "@elastic/elasticsearch";

const eleasticClient = new Client({
  node: "http://localhost:9200",
});

export default eleasticClient;
