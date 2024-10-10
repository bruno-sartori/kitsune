import Device from '@models/device';
import ChromaService from './chroma.service';

const chromaService = new ChromaService();

class ColorService {
  public async changeColor(color: number, userId: number) {
    const devices = await Device.findAll({ where: { group: 'light', userId } });
    
    if (devices.length === 0) {
      return;
    }

    for (let i = 0, len = devices.length; i < len; i++) {
      const device = devices[i];
      console.log(`Setting color ${color} for device ${device.name}`);
      await chromaService.setStaticColorEffect(device.type, color);
    }

    return true;
  }
}

export default ColorService;
