import userService from './user.service.js';
class UserController {
    async getAll(req, res) {
        const users = await userService.findAll();
        res.status(200).json(users);
    }
    async create(req, res) {
        try {
            //validation not implemented yet
            // console.log("body structure", req.body)
            const user = await userService.createUser(req.body);
            res.status(201).json(user);
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}
export default new UserController();
