import ApiError from "@errors/ApiError";
import DeviceService from "@services/device.service";
import { Request, Response } from "express";

const deviceService = new DeviceService();

class DeviceController {
  public async init(req: Request, res: Response, next: any) {
    const { firebase } = req;
    deviceService.setDb(firebase);
    next();
  }

  public async getAvailableDevices(req: Request, res: Response) {
    const { user } = req;

    try {
      const response = await deviceService.getAvailableDevices(user.id);
      res.status(200).json({ data: response });
    } catch (error) {
      console.error("Error fetching available devices:", error);
      const newError = new ApiError("Error fetching available devices", "INTERNAL_SERVER_ERROR");
      res.status(newError.statusCode).json({ error: newError.toJSON() });
    }
  }
}

export default DeviceController;
