import express from 'express';
import path from "path";
const app = express()
import { Collection, MongoClient } from "mongodb";
import { connect } from 'http2';
import { log } from 'console';
const publicpath = path.resolve('public')
app.use(express.static(publicpath))

const dbname = "Alchol";
const collectionname = "Shopkipper";
const collectionname2 = "Customer"
const collectionname3 = "List"
const url = "mongodb://localhost:27017";
const client = new MongoClient(url);

const connection = async () => {
    const connect = await client.connect();
    return await connect.db(dbname)
}
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs")
app.get("/firstpage", (req, resp) => {
    resp.render("Shopkipper-registerpage")
})
app.get("/secondpage", (req, resp) => {

    resp.render("Shopkipper-loginepage")
})



app.get("/thirdpage", (req, resp) => {
    resp.render("customer-register")
})
app.get("/fourthpage", (req, resp) => {
    resp.render("Customer-logine")
})
app.get("/brand", (req, resp) => {
    resp.render("brand", {
        aadhar: ""
    });
});
app.post("/firstpage", async (req, resp) => {
    const db = await connection();
    const collection = db.collection(collectionname);
    await collection.insertOne(req.body);
    const data = await collection.find().toArray();
    console.log(data);
    resp.redirect("/secondpage");
});
app.post("/firstpage", async (req, resp) => {
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

    const collection = db.collection(collectionname2);

    const user = await collection.findOne({
        customer_Adhar_card_no: req.body.customer_Adhar_card_no,
        customer_password: req.body.customer_password
    });
if (user) {
    return resp.render("brand", {
        aadhar: user.customer_Adhar_card_no
    });
}

    resp.send(`
    <script>
        alert("Username or Password is not Registered");
        window.location.href="/fourthpage";
    </script>`);

});
app.post("/brand", async (req, resp) => {
    const db = await connection();
    const collection = db.collection(collectionname3);

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

app.listen(3200, () => {
    console.log("Server running on port 3200");
});