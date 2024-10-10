import axios from 'axios';

class ChromaService {
  private chromaUri: string | null = null;

  private async init() {
    try {
      const data = {
        title: 'Razer Chroma SDK RESTful Test Application',
        description: 'This is a REST interface test application',
        author: {
          name: 'Chroma Developer',
          contact: 'www.razerzone.com'
        },
        device_supported: [
          'keyboard',
          'mouse',
          'headset',
          'mousepad',
          'keypad',
          'chromalink'],
        category: 'application'
      };

      console.log('Initializing Chroma SDK...');
      
      const response = await axios.post('http://localhost:54235/razer/chromasdk', data);
      
      if (response.status === 200) {
        console.log('Chroma SDK initialized');
        this.chromaUri = response.data.uri;
      }
    } catch (error) {
      console.error(error);
      throw new Error('Failed to initialize Chroma SDK');
    }
  }


  private async createStaticColorEffect(device: string, color: number) {
    const effect = {
      "effect": "CHROMA_STATIC",
      "param": {
        "color": color
      }
    };

    
    console.log(`Creating effect for ${device} device...`);
    const response = await axios.post(`${this.chromaUri}/${device}`, effect);
    console.log(`${device} effect created: ${response.data}`);
    
    return response.data;
  }

  private async heartbeat() {
    if (this.chromaUri) {
      console.log('Sending chroma heartbeat...');
      await axios.put(`${this.chromaUri}/heartbeat`);
    }
  }

  constructor() {
    this.init();

    setInterval(() => {
      this.heartbeat();
    }, 10000);
  }

  public async uninit() {
    if (this.chromaUri) {
      await axios.delete(this.chromaUri);
    }
  }
  
  public async setStaticColorEffect(deviceType: string, color: number) {
    if (this.chromaUri) {
      const effect = await this.createStaticColorEffect(deviceType, color);
      console.log(`Setting effect for ${deviceType} device...`);
      const response = await axios.put(`${this.chromaUri}/effect`, { id: effect.id });
      console.log(response.data);
    }
  }

  public clearEffect() {
    if (this.chromaUri) {
      axios.put(this.chromaUri, { effect: 'CHROMA_NONE' });
    }
  }
}

export default ChromaService;
