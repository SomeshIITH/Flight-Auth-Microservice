const {UserRepository} = require('./../repository/index')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {JWT_KEY} = require('./../config/serverConfig');

class UserService{
    constructor(){
        this.userrepo = new UserRepository();
    }

    #checkPassword(plainpassword,encryptedPassword){
        try{
            return bcrypt.compareSync(plainpassword,encryptedPassword);
        }catch(error){
            // console.log("Password does not match");
            throw new Error("Password does not match");
        }
    }
    #createToken(user){
        try{
            const token = jwt.sign(user,JWT_KEY,{expiresIn : '1d'});
            return token;
        }catch(error){
            console.log("Error while creating token");
            throw error;
        }
    }
    #verifyToken(token){
        try{
            const response = jwt.verify(token,JWT_KEY);
            return response;
        }catch(error){
            console.log("Error while verifying token");
            throw error;
        }
    }

    async createUser(data){
        try{
            const user = await this.userrepo.createUser(data);
            return user;
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
            if(!user){
                throw new Error("User does not exist");
            }
            const passwordMatch = this.#checkPassword(plainpassword,user.password);
            if(!passwordMatch){
                throw new Error("Incorrect password");
            }
            const jwttoken = this.#createToken({email : user.email,id : user.id});
            return jwttoken;
        }catch(error){
                console.log("Something went wrong in the service layer");
                throw error;
        }
    }
    async isAuthenticated(token){
        try{
            const userinfo= this.#verifyToken(token);
            if(!userinfo){
                throw new Error("Invalid token");
            }
            const user = await this.userrepo.getUser(userinfo.id);
            if(!user){
                throw new Error("User does not exist");
            }
            return user;
        }catch(error){
            console.log("Something went wrong in the service layer");
            throw error;
        }
    }

    async isAdmin(userId){
        try{
            const response = await this.userrepo.isAdmin(userId);
            if(!response){
                throw new Error("User is not admin");
            }
            return user.isAdmin;
        }catch(error){
            console.log("Something went wrong in the service layer");
            throw error;
        }
    }

}

module.exports = UserService;