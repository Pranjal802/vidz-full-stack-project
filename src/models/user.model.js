import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const UserSchema = new Schema(
    {
        username:{
            type:String,
            required:true,
            unique:true,
            trim:true,
            lowercase:true,
            index:true,
        },
        email:{
            type:String,
            required:true,
            unique:true,
            trim:true,
            lowercase:true,

        },
        fullname:{
            type:String,
            required:true,
            trim:true,
            index:true,
        },
        avatar:{
            type:String, // cloudeninary url
            requiresd:true,
            // default:"https://www.gravatar.com/avatar/
        },
        coverImage:{
            type:String, // cloudeninary url
            // default:"https://www.gravatar.com/avatar/",
        },
        watchHistory:[
            {
                type:Schema.Types.ObjectId,
                ref:"Video",
            }
        ],
        password:{
            type:String,
            required:[true,"Password is required"],
            // trim:true,
        },
        refreshToken:{
            type:String,
            // required:true,
        },

    },
    {timestamps:true}
);

UserSchema.pre("save", async function(next){
    if(!this.isModified("password")) next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
})

UserSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

UserSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id:this._id,
            email:this.email,
            username:this.username,
            fullname:this.fullname,
        }, 
        process.env.ACCESS_TOKEN_SECRET, 
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY,
        }
    )
}
UserSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id:this._id,
        }, 
        process.env.REFRESH_TOKEN_SECRET, 
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY,
        }
    )}

export const User = mongoose.model("User", UserSchema);