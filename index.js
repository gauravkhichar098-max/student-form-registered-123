require("dotenv").config();
const express=require("express");
const multer=require("multer");
const storage=multer.diskStorage(
    {
        destination:function(req,file,cb)
        {
            cb(null,'./public/images/');
        },
        filename:function(req,file,cb)
        {
            cb(null,file.originalname);
        }
    }
)
const upload=multer({storage:storage});
const {Pool}=require("pg");
const pool=new Pool(
    {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
        /*host:"localhost",
        user:"postgres",
        password:"IECS",
        database:"Registration Form",
        port:5432*/
    }
);
const bodyParser=require("body-parser");
const app=express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.get("/",(req,res)=>
{
    res.sendFile(__dirname + "/public/index.html");
});
app.post("/form",upload.single("file"),(req,res)=>
{
    let file=req.file.originalname;
    let{reno,snm,bch,sed,adr}=req.body;
    async function connectDB()
    {
        try {
                //await pool.connect();
                console.log("Connected");
                //const qry="insert into Registered_details values('"+reno+"','"+snm+"','"+bch+"','"+sed+"','"+file+"','"+adr+"')";
                //const result=await pool.query(qry);
                const qry = "INSERT INTO Registered_details VALUES ($1,$2,$3,$4,$5,$6)";
                const result= await pool.query(qry, [reno, snm, bch, sed, file, adr]);
                console.log("data stored",result.rows);
                res.redirect("index.html");
        } catch (error) {
                console.error("Disconnected",error);
                res.send("error occured");
        }
    }
    connectDB()
});
const PORT = process.env.PORT || 4567;
app.listen(PORT, () => 
{ 
    console.log("Server running on port " + PORT); 
});
/*app.listen(4567,()=>
{
    console.log("server chl rha h!");
});*/