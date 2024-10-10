import { ExecuteIntent, QueryIntent, SyncIntent } from "@interfaces/google-intents";
import DeviceService from "./device.service";
import { collection, doc, setDoc, Firestore, onSnapshot } from "firebase/firestore";
import ChromaService from "./chroma.service";

const chromaService = new ChromaService();

class IntentExecutorService {
  private db: Firestore | null = null;
  private deviceService: DeviceService;

  constructor(db: Firestore) {
    this.deviceService = new DeviceService();
    this.setDb(db);
  }

  public setDb(db: Firestore) {
    this.db = db;
    this.deviceService.setDb(db);
  }

  public async executeIntent(intent: ExecuteIntent) {
    // Execute the intent
    console.log(intent);

    switch (intent.inputs[0].intent) {
      case 'action.devices.EXECUTE':
        return await this.executeDevices(intent);
      default:
        return;
    }
  }

  private async executeDevices(intent: ExecuteIntent) {
    const deviceIds = intent.inputs[0].payload.commands[0].devices.map(o => o.id);
    const devices = await this.deviceService.getDevicesByIds(deviceIds, 1);
    const execution = intent.inputs[0].payload.commands[0].execution[0];

    switch (execution.command) {
      case 'action.devices.commands.ColorAbsolute':
        return await this.executeColor(devices, execution.params.color?.spectrumRgb!);
      default:
        return;
    }
  }

  private async executeColor(devices: any[], color: number) {
    for (let i = 0, len = devices.length; i < len; i++) {
      const device = devices[i];
      console.log(`Setting color ${color} for device ${device.name}`);
      await chromaService.setStaticColorEffect(device.type, color);
    }

    return true;
  }
}

export default IntentExecutorService;
