import { Request, Response } from "express";
import ApiError from "@errors/ApiError";
import UserService from "@services/user.service";
import User from "@models/user";

const userService = new UserService();

class UserController {
  public async getById(req: Request, res: Response) {
    try {
      const response = await userService.getById(parseInt(req.params.id, 10));
  
      res.status(200).json({ data: { user: response } });
    } catch (error: unknown) {
      if (error instanceof ApiError) {
        return res.status(error.statusCode).json({ error: error.toJSON() });
      }

      res.status(500).json({ error: JSON.stringify(error) });
    }
  }
}

export default UserController;
