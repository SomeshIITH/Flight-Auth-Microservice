const {User} = require('./../models/index')
const { StatusCodes} = require('http-status-codes');
const AppError = require('./../utils/app-error')

class UserRepository{

    async createUser(data){
        try{ 
            const user = await User.create(data);
            if(!user)throw new AppError("Use not created",StatusCodes.BAD_REQUEST);
            return user;
        }catch(error){
            if(error.name == 'SequelizeUniqueConstraintError')throw new AppError("User already Exist with this email",StatusCodes.CONFLICT);
             throw error;
        }
    }
    async getUser(id){
        try{ 
            const user = await User.findByPk(id,{
                attributes : ['email','id','role']     //because we make jwt token by email and useid not passord
            });
            if(!user)throw new AppError("User not found",StatusCodes.NOT_FOUND);
            return user;
        }catch(error){
            // console.log("Something went wrong in the repository layer");
             throw error;
        }
    }

    async getUserByEmail(email){
        try{
            // console.log("Finding user by email:", email);
            const user = await User.findOne({
                where : { email : email }
                // attributes : ['email','id','role'] not need because we need password ifor bcrypt comparing
            })
            if(!user)throw new AppError("User not found",StatusCodes.NOT_FOUND);
            return user;
        }catch(error){
            console.log("Something went wrong in the repository layer");
             throw error;
        }
    }
    async deleteUser(id){
        try{ 
            await User.destroy({  where : { id : id}   });
        }catch(error){
            console.log("Something went wrong in the repository layer");
             throw error;
        }
    }

    async isAdmin(userId){
        try{
            const user = await User.findByPk(userId);
            if (!user) return false;
            // Simplified check: No extra DB query for the Role table!
            return user.role === 'ADMIN';
        }catch(error){
                console.log("Something went wrong in the repository layer");
                throw error;
        }
    }

    async updateRole(userId, newRole) {
        try {
            const user = await User.findByPk(userId);
            if (!user) throw new AppError('User not found', StatusCodes.NOT_FOUND);
            user.role = newRole;
            await user.save();
            return user;
        } catch (error) {
            throw error;
        }
    }
}
module.exports = UserRepository;