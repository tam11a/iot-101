const config = {
	apiURL: process.env.NEXT_PUBLIC_API_URL,
	// proxyApiURL: process.env.NEXT_PUBLIC_PROXY_API_URL,
	// xApiKey: process.env.NEXT_X_API_KEY,
	// ecryptSecret: process.env.NEXT_ENCRYPTION_SECRET,
	// mapApiKey: process.env.NEXT_MAP_KEY,
	nodeEnv: process.env.NEXT_NODE_ENV,
	mqttBroker: process.env.NEXT_PUBLIC_MQTT_BROKER as string,
	mqttBase: process.env.NEXT_PUBLIC_MQTT_BROKER_URL as string,
};

export default config;
