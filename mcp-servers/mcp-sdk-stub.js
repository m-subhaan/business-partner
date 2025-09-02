// Stub implementation for @mcp/sdk until the actual package is available
// This provides the basic structure needed for the MCP servers to run

class Server {
  constructor(serverInfo, capabilities) {
    this.serverInfo = serverInfo;
    this.capabilities = capabilities;
    this.requestHandlers = new Map();
  }

  setRequestHandler(method, handler) {
    this.requestHandlers.set(method, handler);
  }

  async connect(transport) {
    this.transport = transport;
    console.error(`${this.serverInfo.name} connected via ${transport.constructor.name}`);
  }

  async handleRequest(method, params) {
    const handler = this.requestHandlers.get(method);
    if (handler) {
      return await handler({ params });
    }
    throw new Error(`No handler for method: ${method}`);
  }
}

class StdioServerTransport {
  constructor() {
    this.connected = false;
  }

  async connect() {
    this.connected = true;
  }

  async close() {
    this.connected = false;
  }
}

class Client {
  constructor(clientInfo, capabilities) {
    this.clientInfo = clientInfo;
    this.capabilities = capabilities;
    this.transport = null;
  }

  async connect(transport) {
    this.transport = transport;
    await transport.connect();
  }

  async request(request, options) {
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

class StdioClientTransport {
  constructor(options) {
    this.options = options;
    this.connected = false;
  }

  async connect() {
    this.connected = true;
    console.error(`Client transport connected: ${this.options.command} ${this.options.args.join(' ')}`);
  }

  async close() {
    this.connected = false;
  }
}

module.exports = {
  Server,
  StdioServerTransport,
  Client,
  StdioClientTransport
};
