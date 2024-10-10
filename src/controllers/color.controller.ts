import ApiError from "@errors/ApiError";
import ColorService from "@services/color.service";
import { Request, Response } from "express";


class ColorController {
  private colorService: ColorService;

  constructor() {
    this.colorService = new ColorService();
  }

  public async changeColor(req: Request, res: Response) {
    const { color } = req.body;
    const { user } = req;

    try {
      const response = await this.colorService.changeColor(color, user.id);
      res.status(200).json({ message: "Color changed", data: response });
    } catch (error) {
      console.error("Error changing color:", error);
      const newError = new ApiError("Error changing color", "INTERNAL_SERVER_ERROR");
      res.status(newError.statusCode).json({ error: newError.toJSON() });
    }
  }
}

export default ColorController;
