import jwt from 'jsonwebtoken'

// Admin authentication middleware
const authAdmin = async (req,res,next) => {
  try {
    
    // get token from headers file 
    const {atoken} = req.headers
    if(!atoken){
      return res.json({success: false, message: "Not Authorized Login Again"})
    }

    // Decode the token
    const token_decode = jwt.verify(atoken,process.env.JWT_SECRET)

    // checking token same as token generate
    if(token_decode !== process.env.ADMIN_EMAIL + process.env.AMDIN_PASSWORD){
      return res.json({success: false, message: "Not Authorized Login Again"})
    }

    next()
 
  } catch (error) {
    console.log(error)
    res.json({success:false,message:error.message})
  }
} 

export default authAdmin