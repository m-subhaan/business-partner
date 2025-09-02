// TypeScript stub implementation for @mcp/sdk until the actual package is available

export class Client {
  private clientInfo: any;
  private capabilities: any;
  private transport: any = null;

  constructor(clientInfo: any, capabilities: any) {
    this.clientInfo = clientInfo;
    this.capabilities = capabilities;
  }

  async connect(transport: any) {
    this.transport = transport;
    await transport.connect();
  }

  async request(request: any, options: any) {
    if (!this.transport || !this.transport.connected) {
      throw new Error('Client not connected');
    }
    
    // Mock response for demonstration
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({ mock: true, method: request.method, params: request.params })
        }
      ]
    };
  }

  async close() {
    if (this.transport) {
      await this.transport.close();
    }
  }
}

export class StdioClientTransport {
  private options: any;
  public connected: boolean = false;

  constructor(options: any) {
    this.options = options;
  }

  async connect() {
    this.connected = true;
    console.error(`Client transport connected: ${this.options.command} ${this.options.args.join(' ')}`);
  }

  async close() {
    this.connected = false;
  }
}
