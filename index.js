import express from 'express';
import path from "path";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3200;
const publicpath = path.resolve("public");
app.use(express.static(publicpath));

const dbname = "Alchol";
const collectionname = "Shopkipper";
const collectionname2 = "Customer";
const collectionname3 = "List";

const url = process.env.MONGO_URL;
const client = new MongoClient(url);
const connection = async () => {
    try {
        const connect = await client.connect();
        console.log("✅ MongoDB Atlas Connected Successfully");
        return connect.db(dbname);
    } catch (err) {
        console.log("❌ MongoDB Connection Failed");
        console.error(err);
        throw err;
    }
};
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs")
app.get("/", (req, resp) => {
    resp.render("Shopkipper-registerpage")
})
app.get("/secondpage", (req, resp) => {

    resp.render("Shopkipper-loginepage")
})

app.get("/intro", (req, resp) => {

    resp.render("intro")
})



app.get("/thirdpage", (req, resp) => {
    resp.render("customer-register")
})
app.get("/fourthpage", (req, resp) => {
    resp.render("Customer-logine")
})
app.get("/brand", (req, resp) => {
    resp.render("brand", {
        aadhar: "",
         lastPurchase: null
    });
});
app.post("/", async (req, resp) => {
    const db = await connection();
    const collection = db.collection(collectionname);
    await collection.insertOne(req.body);
    const data = await collection.find().toArray();
    console.log(data);
    resp.redirect("/secondpage");
});
app.post("/", async (req, resp) => {
    const db = await connection();
    const collection = db.collection(collectionname);
    const result = await collection.insertOne(req.body)
    console.log(result);
    resp.redirect("/")
})
app.post("/secondpage", async (req, resp) => {
    const db = await connection();
    const collection = db.collection(collectionname)
    const user = await collection.findOne({
        licience_no: req.body.licience_no,
        password: req.body.password
    })
    if (user) {
        resp.send(`
        <script>
         alert("Logine Sucessifully") ;
         window.location.href="/thirdpage" ;
        </script>`)
    } else {
        resp.send(`
        <script> 
        alert("Username or Password is not register");
        window.location.href="/secondpage"
        </script>`)
    }
})
app.post("/thirdpage", async (req, resp) => {
    const db = await connection();
    const collection = db.collection(collectionname2);

    const result = await collection.insertOne(req.body)
    console.log(result);
    const data = await collection.find().toArray();
    console.log(data);
    resp.redirect("/fourthpage")
})
app.post("/fourthpage", async (req, resp) => {

    const db = await connection();

    const customerCollection = db.collection(collectionname2);
    const listCollection = db.collection(collectionname3);

    const user = await customerCollection.findOne({
        customer_Adhar_card_no: req.body.customer_Adhar_card_no,
        customer_password: req.body.customer_password
    });

    if (user) {

        const lastPurchase = await listCollection.findOne(
            { customer_Adhar_card_no: user.customer_Adhar_card_no },
            { sort: { purchaseDate: -1 } }
        );

        return resp.render("brand", {
            aadhar: user.customer_Adhar_card_no,
            lastPurchase: lastPurchase
        });
    }

    resp.send("Login Failed");
});
app.post("/brand", async (req, resp) => {
    const db = await connection();
    const collection = db.collection(collectionname3);

    req.body.purchaseDate = new Date();   // <-- हे Add कर

    await collection.insertOne(req.body);

    resp.redirect("/List");
});
app.get("/List",async(req,resp)=>{
    const db =  await connection();
    const collection = db.collection(collectionname3) ;
    const data = await collection.find().toArray() ;
    console.log(data);
    resp.render("List",{data})
    
})
app.get("/test", async (req, res) => {
    try {
        const db = await connection();
        await db.command({ ping: 1 });
        res.send("✅ MongoDB Connected");
    } catch (err) {
        res.status(500).send(err.message);
    }
});
app.listen(PORT, () => {
    console.log("Server running on port 3200");
});