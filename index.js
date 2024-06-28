const express= require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const ejs = require('ejs');
var encrypt = require('mongoose-encryption');

const app = express();

app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));


  mongoose.connect("mongodb://127.0.0.1:27017/userDB");

  const userSchema = new mongoose.Schema({
    email: String,
    password: String
  });

//Encryption

  const secret="ThisisourSecretKey";

  userSchema.plugin(encrypt,{secret:secret, encryptedFields: ['password']});
  

//Model
  const User = mongoose.model('User', userSchema);



  
app.get("/",(req,res)=>{
  res.render("home");
});
app.get("/login",(req,res)=>{
  res.render("login");
});
app.get("/register",async(req,res)=>{

  
  res.render("register");
});

app.post("/register",async(req,res)=>{


  try {
    const user=new User({
      email:req.body.username,
      password: req.body.password
    });

    await user.save();
    console.log("User saved successfully");
    res.render("secrets");

} catch (err) {
console.log("Unsuccessful Register");
}

})


app.post("/login",async(req,res)=>{
  
  try {
         const user = await User.findOne({email:req.body.username});
         if(user){

            if(user.password===req.body.password){res.render("secrets");} 
            else res.redirect("/");

         }
  } catch (err) {
      console.log("error logging in");
  };

  res.redirect("/");
})




app.listen(3000,(req,res)=>{
  console.log("Server is listening on Port 3000");
})