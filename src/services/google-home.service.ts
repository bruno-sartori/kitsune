import { ExecuteIntent, QueryIntent, SyncIntent } from "@interfaces/google-intents";
import DeviceService from "./device.service";

class GoogleHomeService {
  private deviceService: DeviceService;

  constructor() {
    this.deviceService = new DeviceService();
  }

  public async syncDevices(payload: SyncIntent, userId: number) {
    const devices = await this.deviceService.getAvailableDevices(userId);

    const data = {
      requestId: payload.requestId,
      payload: {
        agentUserId: 'user123',
        devices: devices.map(device => {
          return {
            id: device.id,
            type: 'action.devices.types.LIGHT',
            traits: [
              'action.devices.traits.OnOff',
              'action.devices.traits.ColorSetting',
              'action.devices.traits.Brightness'
            ],
            name: {
              name: device.name
            },
            willReportState: true,
            attributes: {
              colorTemperatureRange: {
                temperatureMinK: 2000,
                temperatureMaxK: 6500
              }
            },
            deviceInfo: {
              manufacturer: "smart-home-inc",
              model: "hs1234",
              hwVersion: "3.2",
              swVersion: "11.4"
            }
          }
        })
      }
    };

    return data;
  }

  public async queryDevices(payload: QueryIntent, userId: number) {
    const deviceIds = payload.inputs[0].payload.devices;
    const devices = await this.deviceService.getDevicesByIds(deviceIds.map(o => o.id), userId);

    const data = {
      requestId: payload.requestId,
      payload: {
        agentUserId: 'user123',
        devices: devices.reduce((result: any, item, index, array) => {
          result[item.id] = {
            status: 'SUCCESS',
            online: true,
            on: true,
            brightness: 80,
            color: {
              temperature: 4000,
              spectrumRgb: 65280
            }
          };
          return result;
        }, {}),
      }
    };

    return data;
  }

  public async execDevices(payload: ExecuteIntent, userId: number) {
    const deviceIds = payload.inputs[0].payload.commands[0].devices;
    const devices = await this.deviceService.getDevicesByIds(deviceIds.map(o => o.id), userId);

    const data = {
      requestId: payload.requestId,
      payload: {
        commands: devices.map(device => {
          return {
            ids: [device.id],
            status: 'SUCCESS',
            states: {
              online: true,
              on: payload.inputs[0].payload.commands[0].execution[0].params.on,
              brightness: payload.inputs[0].payload.commands[0].execution[0].params.brightness,
              color: {
                name: payload.inputs[0]?.payload?.commands[0]?.execution[0]?.params?.color?.name,
                temperature: payload.inputs[0]?.payload?.commands[0]?.execution[0]?.params?.color?.temperature,
                spectrumRgb: payload.inputs[0]?.payload?.commands[0]?.execution[0]?.params?.color?.spectrumRgb ?? 0
              }
            }
          }
        })
      }
    };

    return data
  }
}

export default GoogleHomeService;
