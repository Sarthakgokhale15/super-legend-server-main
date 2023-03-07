const express=require("express")
const router=new express.Router(); 

var cors = require('cors');
require('dotenv').config();
const corsOptions = {
    origin: "http://localhost:3000",

    // allow from anywhere
//     origin: "*",
  };
router.use(cors(corsOptions));
const {google}=require("googleapis");

router.post("/test",async(req,res)=>{
    res.send("post working");
})

router.post("/user",async(req,res)=>{

    const auth=new google.auth.GoogleAuth({
        credentials:{
            "type": "service_account",
            "project_id": "supr-legend-web",
            "private_key_id": process.env.private_key_id,
            "private_key": process.env.private_key,
            "client_email": process.env.client_email,
            "client_id": process.env.client_id,
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://oauth2.googleapis.com/token",
            "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
            "client_x509_cert_url": process.env.client_x509_cert_url
          },
        scopes:"https://www.googleapis.com/auth/spreadsheets"
    });

    const client=  await auth.getClient;
    const googleSheets=google.sheets({version:"v4",auth:client});
    const spreadsheetId="1zUeJVMWXURWAcz5UpadyiGjYWlnIpnB8Kgfd6F9k4Cs";



    // console.log(req.body.body);
    // console.log(req.query.childName);
    // const jcaIdNumber=req.query.jcaIdNumber;
    // console.log(jcaIdNumber);
    const payload=[[req.body.body.childName,req.body.body.Age,req.body.body.gender,req.body.body.parentName,req.body.body.category1,req.body.body.category2,req.body.body.category3,req.body.body.ContactNumber,req.body.body.location,req.body.body.jcaId,req.body.body.jcaIdNumber,req.body.body.mentorName]];
    // const payload=[[req.query.childName,req.query.Age,req.query.gender,req.query.parentName,req.query.category1,req.query.category2,req.query.category3,req.query.ContactNumber,req.query.location,req.query.jcaId,req.query.jcaIdNumber,req.query.mentorName]];



    try{
        await googleSheets.spreadsheets.values.append({
            auth,
            spreadsheetId,
            range:"Sheet1!A:B",
            valueInputOption:"USER_ENTERED",
            resource:{
                values:payload,
            }
    
    
        })
    }
    catch(e){
        res.status(400).send(e);
    }
   
    // console.log(done.status);
    res.send("server running data posted sucessfully");
    // return res.status(200);
    // return res;

});
module.exports=router