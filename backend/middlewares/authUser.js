import jwt from 'jsonwebtoken'

// user authentication middleware
const authUser = async (req,res,next) => {
  try {
    
    // get token from headers file 
    const {token} = req.headers
    if(!token){
      return res.json({success: false, message: "Not Authorized Login Again"})
    }

    // Decode the token
    const token_decode = jwt.verify(token,process.env.JWT_SECRET)

    // get the user token
    req.body.userId = token_decode.id

    next()
 
  } catch (error) {
    console.log(error)
    res.json({success:false,message:error.message})
  }
} 

export default authUser