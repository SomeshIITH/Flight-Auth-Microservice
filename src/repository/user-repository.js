const {User,Role} = require('./../models/index')

class UserRepository{

    async createUser(data){
        try{ 
            const user = await User.create(data);
            return user;
        }catch(error){
            console.log("Something went wrong in the repository layer");
             throw error;
        }
    }
    async getUser(id){
        try{ 
            const user = await User.findByPk(id,{
                attributes : ['email','id']     //because we make jwt token by email and useid not passord
            });
            return user;
        }catch(error){
            console.log("Something went wrong in the repository layer");
             throw error;
        }
    }

    async getUserByEmail(email){
        try{
            // console.log("Finding user by email:", email);
            const user = await User.findOne({
                where : {
                    email : email
                }
            })
            // console.log("USER FOUND:", user);
            return user;
        }catch(error){
            console.log("Something went wrong in the repository layer");
             throw error;
        }
    }
    async deleteUser(id){
        try{ 
            await User.destroy({
                where : {
                    id : id
                }
            });
        }catch(error){
            console.log("Something went wrong in the repository layer");
             throw error;
        }
    }

    async isAdmin(userId){
        try{
            const user = await User.findByPk(userId);
            console.log(user);
            const adminRole = await Role.findOne({
                where : {
                    name : "ADMIN"
                }
            })
            return user.hasRole(adminRole); //magic method created by sequelize for many to many relation
        }catch(error){
                console.log("Something went wrong in the repository layer");
                throw error;
        }
    }
}
module.exports = UserRepository;