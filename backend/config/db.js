const mongoose=require("mongoose")

const connectDB=()=>mongoose.connect("mongodb://127.0.0.1:27017/pacetrack")
.then(()=>
{
    console.log("Database connected");
}
)

.catch(err=>console.log(err))
module.exports=connectDB