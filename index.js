const express= require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const methodOverride = require('method-override');

const Routes = require("./routes/route.js")


app.use(express.json());
app.use(cors());
app.use(methodOverride('_method'));
app.use(express.urlencoded({extended:true}));

main().then(()=>{
    console.log("connected");
}).catch((err)=>{
    console.log("got some err ",err );
});

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/flipr");
}


app.use('/', Routes);


app.listen(3000 , ()=>{
    console.log("alive at 3000");
})