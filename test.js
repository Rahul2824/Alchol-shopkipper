import dns from "dns";

dns.resolveSrv("_mongodb._tcp.cluster3.lqgblve.mongodb.net", (err, records) => {
    if (err) {
        console.log("ERROR:", err);
    } else {
        console.log(records);
    }
});