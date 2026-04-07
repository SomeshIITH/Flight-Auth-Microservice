const {UserRepository} = require('./../repository/index')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {JWT_KEY} = require('./../config/serverConfig');
const AppError = require('../utils/app-error');
const { StatusCodes } = require('http-status-codes');

class UserService{
    constructor(){
        this.userrepo = new UserRepository();
    }
    // Performance Fix: Changed to async compare to avoid blocking the event loop
    async #checkPassword(plainpassword,encryptedPassword){
        try{
            // return bcrypt.compareSync(plainpassword,encryptedPassword); //synchronous
            return await bcrypt.compare(plainpassword,encryptedPassword);
        }catch(error){
           throw new AppError("Password is incorrect",StatusCodes.BAD_REQUEST);
        }
    }
    #createToken(user){
        try{
            const token = jwt.sign(user,JWT_KEY,{expiresIn : '1d'});
            return token;
        }catch(error){
            throw new AppError("JWT token creation failed");
        }
    }
    #verifyToken(token){
        try{
            const response = jwt.verify(token,JWT_KEY);
            return response;
        }catch(error){
            // Distinguish between expired and invalid tokens
            const message = error.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token';
            throw new AppError(message, StatusCodes.UNAUTHORIZED);
        }
    }

    async signUp(data){
        try{
            const user = await this.userrepo.createUser({...data,role : "NORMAL"});
            const jwttoken = this.#createToken({email : user.email,id : user.id,role : user.role } );
            return jwttoken;
        }catch(error){
            console.log("Something went wrong in the service layer");
             throw error;
         }
    }

    async getUser(id){
        try{
            const user = await this.userrepo.getUser(id);
            return user;
        }catch(error){
            console.log("Something went wrong in the service layer");
             throw error;
         }
    }

    async deleteUser(id){
        try{
             await this.userrepo.deleteUser(id);
        }catch(error){
            console.log("Something went wrong in the service layer");
             throw error;
         }
    }

    async signIn(useremail,plainpassword){
        try{
            const user = await this.userrepo.getUserByEmail(useremail);
            if(!user)throw new AppError("User Not exist",StatusCodes.UNAUTHORIZED);
            if(user.role == "BLOCKED")throw new AppError("User is forbidden/blocked",StatusCodes.FORBIDDEN);

            const passwordMatch = await this.#checkPassword(plainpassword,user.password);
            if(!passwordMatch)throw new AppError("Password is incorrect ",StatusCodes.UNAUTHORIZED);
            const jwttoken = this.#createToken({email : user.email,id : user.id,role : user.role } );
            return jwttoken;
        }catch(error){
                throw error;
        }
    }
    async isAuthenticated(token){
        try{
            const userpayload= this.#verifyToken(token);
            const user = await this.userrepo.getUser(userpayload.id);
            if(!user)throw new AppError("User no longer exist",StatusCodes.NOT_FOUND);
            
            // if(user.role == "BLOCKED")throw new AppError("User is forbidden/blocked",StatusCodes.FORBIDDEN);
            //tradeoff we are taking assuning jwt expiry is short to make isauthenticated stateless
            // 9:00 AM: User logs in. They are NORMAL. Your signIn logic passes, and they get a JWT valid for 24 hours.
            // 9:05 AM: The user starts spamming your Flight Service or performing a DDoS attack.
            // 9:10 AM: An Admin sees this and changes the user's status to BLOCKED in the database.
            // 9:15 AM: The user makes another request to book a flight. that swhy we need BLOCKED checking
            return user.id;
        }catch(error){
            throw error;
        }
    }

    async isAdmin(userId){
        try{
            const response = await this.userrepo.isAdmin(userId);
           return response;//boolean value
        }catch(error){
            throw error;
        }
    }

}

module.exports = UserService;


//logic eith two token generation


// class UserService {
//     constructor() {
//         this.userrepo = new UserRepository();
//     }

//     // --- PRIVATE METHODS ---

//     async #checkPassword(plainPassword, encryptedPassword) {
//         try {
//             return await bcrypt.compare(plainPassword, encryptedPassword);
//         } catch (error) {
//             throw new AppError("Internal security error", StatusCodes.INTERNAL_SERVER_ERROR);
//         }
//     }

//     #generateTokens(user) {
//         try {
//             const payload = { email: user.email, id: user.id, role: user.role };
            
//             // Access Token: Short-lived (1 hour)
//             const accessToken = jwt.sign(payload, JWT_KEY, { expiresIn: '1h' });
            
//             // Refresh Token: Long-lived (7 days)
//             const refreshToken = jwt.sign({ id: user.id }, JWT_KEY, { expiresIn: '7d' });
            
//             return { accessToken, refreshToken };
//         } catch (error) {
//             throw new AppError("Token generation failed", StatusCodes.INTERNAL_SERVER_ERROR);
//         }
//     }

//     #verifyToken(token) {
//         try {
//             return jwt.verify(token, JWT_KEY);
//         } catch (error) {
//             if (error.name === 'TokenExpiredError') {
//                 throw new AppError("Token expired", StatusCodes.UNAUTHORIZED);
//             }
//             throw new AppError("Invalid token", StatusCodes.UNAUTHORIZED);
//         }
//     }

//     // --- PUBLIC METHODS ---

//     /**
//      * Standard SignUp logic
//      */
//     async signUp(data) {
//         try {
//             // Force role to NORMAL to prevent privilege escalation
//             const user = await this.userrepo.createUser({ ...data, role: "NORMAL" });
//             return user;
//         } catch (error) {
//             if (error instanceof AppError) throw error;
//             throw new AppError("Failed to create user", StatusCodes.INTERNAL_SERVER_ERROR);
//         }
//     }

//     /**
//      * Initial authentication: Exchange credentials for a token pair
//      */
//     async signIn(email, password) {
//         try {
//             const user = await this.userrepo.getUserByEmail(email);
//             if (!user) throw new AppError("Invalid email or password", StatusCodes.UNAUTHORIZED);

//             if (user.role === "BLOCKED") {
//                 throw new AppError("Account is suspended. Contact admin.", StatusCodes.FORBIDDEN);
//             }

//             const passwordMatch = await this.#checkPassword(password, user.password);
//             if (!passwordMatch) throw new AppError("Invalid email or password", StatusCodes.UNAUTHORIZED);

//             return this.#generateTokens(user);
//         } catch (error) {
//             if (error instanceof AppError) throw error;
//             throw new AppError("Sign-in failed", StatusCodes.INTERNAL_SERVER_ERROR);
//         }
//     }

//     /**
//      * Exchange a valid Refresh Token for a fresh Access Token pair
//      */
//     async refreshAccessToken(refreshToken) {
//         try {
//             const decoded = this.#verifyToken(refreshToken);
            
//             // We check the DB to ensure the user wasn't BLOCKED since they last logged in
//             const user = await this.userrepo.getUser(decoded.id);
//             if (!user) throw new AppError("User no longer exists", StatusCodes.NOT_FOUND);
            
//             if (user.role === "BLOCKED") {
//                 throw new AppError("User blocked. Cannot refresh session.", StatusCodes.FORBIDDEN);
//             }

//             return this.#generateTokens(user);
//         } catch (error) {
//             if (error instanceof AppError) throw error;
//             throw new AppError("Authentication refresh failed", StatusCodes.UNAUTHORIZED);
//         }
//     }

//     /**
//      * The Middleware logic: Verifies the Access Token on every protected request
//      */
//     async isAuthenticated(token) {
//         try {
//             const payload = this.#verifyToken(token);
            
//             // Real-time status check
//             const user = await this.userrepo.getUser(payload.id);
//             if (!user) throw new AppError("User not found", StatusCodes.NOT_FOUND);
            
//             if (user.role === "BLOCKED") {
//                 throw new AppError("Access denied. Account is blocked.", StatusCodes.FORBIDDEN);
//             }

//             return user.id;
//         } catch (error) {
//             if (error instanceof AppError) throw error;
//             throw new AppError("Not authenticated", StatusCodes.UNAUTHORIZED);
//         }
//     }

//     async isAdmin(userId) {
//         try {
//             return await this.userrepo.isAdmin(userId);
//         } catch (error) {
//             throw new AppError("Role verification failed", StatusCodes.INTERNAL_SERVER_ERROR);
//         }
//     }

//     async getUser(id) {
//         return await this.userrepo.getUser(id);
//     }

//     async deleteUser(id) {
//         return await this.userrepo.deleteUser(id);
//     }
// }

// module.exports = UserService;