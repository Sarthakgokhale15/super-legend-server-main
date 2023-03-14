const express=require("express")
const nodemailer=require("nodemailer")
const MailGen=require("mailgen")
const router=new express.Router(); 

var cors = require('cors');
require('dotenv').config();
const corsOptions = {
    // origin: "http://localhost:3000",

    // allow from anywhere
    origin: "*",
  };
router.use(cors(corsOptions));
const {google}=require("googleapis");

router.post("/test",async(req,res)=>{
    res.send("post working");
})

async function getAuthSheets(){
    const auth=new google.auth.GoogleAuth({
        credentials:{
            "type": "service_account",
            "project_id": "supr-legend-web",
            "private_key_id": process.env.private_key_id,
            "private_key": process.env.private_key.split(String.raw`\n`).join('\n'),
            "client_email": process.env.client_email,
            "client_id": process.env.client_id,
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://oauth2.googleapis.com/token",
            "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
            "client_x509_cert_url": process.env.client_x509_cert_url
          },
        scopes:"https://www.googleapis.com/auth/spreadsheets"
    });
    const client=  await auth.getClient();
    const googleSheets=google.sheets({version:"v4",auth:client});
    
    const spreadsheetId="1zUeJVMWXURWAcz5UpadyiGjYWlnIpnB8Kgfd6F9k4Cs";
    return {
        auth,client,googleSheets,spreadsheetId
    }
}


router.post("/partner",async(req,res)=>{
    const {auth,googleSheets}=await getAuthSheets();
    spreadsheetId="1H1Pe4i7LabkBbOPv8j99FvFpeXJSld887ywj1r7HdGU";

    // console.log(req.body);
    const payload=[req.body.body];
    console.log(payload);
     const row=await googleSheets.spreadsheets.values.append({
            auth,
            spreadsheetId,
            range:"Sheet1!A:B",
            valueInputOption:"USER_ENTERED",
            resource:{
                values:payload,
            }
    
    
        })
        return res.status(201);

});
router.post("/user",async(req,res)=>{
    const {auth,googleSheets,spreadsheetId}=await getAuthSheets();
    const email=req.body.body.email;
    const parentName=req.body.body.parentName;




    console.log(req.body.body);

    const payload=[
        [
            req.body.body.childName,
            req.body.body.Age,
            req.body.body.gender,
            req.body.body.parentName,
            req.body.body.category1,
            req.body.body.category2,
            req.body.body.category3,
            req.body.body.FormattedContactNumber,
            req.body.body.location,
            req.body.body.email,
            req.body.body.cat1,
            req.body.body.cat2,
            req.body.body.cat3,
            req.body.body.cat4,
            req.body.body.cat5,
            req.body.body.cat6,
            req.body.body.cat7,
            req.body.body.cat8,
            req.body.body.cat9,
            req.body.body.cat10,
            req.body.body.date

        ]];
    
   

    if(payload[0][0]=='' || payload[0][1]=='' || payload[0][2]=='' || payload[0][3]==''|| payload [0][7]=='' || payload[0][8]=='' || payload[0][7].length!=10 ){
        res.status(404).send('Data Not Stored');
        return;
    }
    if(payload[0][4]==false && payload[0][5]==false && payload[0][6]==false){
        res.status(404).send('Data Not Stored');
        return;
    }
    else{
        const row=await googleSheets.spreadsheets.values.append({
            auth,
            spreadsheetId,
            range:"Sheet1!A:B",
            valueInputOption:"USER_ENTERED",
            resource:{
                values:payload,
            }
    
    
        })
        // res.send(row.data);
    }


        let config={
            service:'gmail',
            auth:{
                user:process.env.EMAIL,
                pass:process.env.PASSWORD
            }
        }
        let transporter=nodemailer.createTransport(config)
        let MailGenerator=new MailGen({
            theme:"default",
            product : {
                name: "SuprLegend",
                link : 'https://mailgen.js/'
            }

        })



        let response={
            body:{
                name:parentName,
                intro:"Your account created successfully!",
                outro:"Looking forward to engage with you."
            }
        }


      let mail=MailGenerator.generate(response);
      let message={
        from: process.env.EMAIL, // sender address
        to: email, // list of receivers
        subject: "Thanks for your interest ✔", // Subject line
        // text: "successfully registered with us", // plain text body
        html: mail, // html body
      }

        transporter.sendMail(message).then((info)=>{
             res.status(201).json({
                msg:"email sent!",
                info:info.messageId,
                preview:nodemailer.getTestMessageUrl(info)
            })
         }).catch((e)=>{
            res.status(500).json({e});
         });


         


       
   
   
    

});


module.exports=router