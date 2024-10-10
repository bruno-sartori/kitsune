import Device from '@models/device';

class DeviceService {
  public async getAvailableDevices(userId: number) {
    const devices = await Device.findAll({ where: { group: 'light', userId } });

    if (devices.length === 0) {
      return [];
    }

    return devices;
  }

  public async getDevicesByIds(deviceIds: Array<string>, userId: number) {
    const devices = await Device.findAll({ where: { id: deviceIds, userId } });

    if (devices.length === 0) {
      return [];
    }

    return devices;
  }
}

export default DeviceService;
