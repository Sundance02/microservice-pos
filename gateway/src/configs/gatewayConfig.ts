import { createProxyMiddleware, type Options } from 'http-proxy-middleware';

class ProxyOptions {
    public createServiceProxy(target: string, path: string) {
        return createProxyMiddleware({
            target,
            changeOrigin: true,
            pathRewrite: {
                [`^${path}`]: '',
            }
        });
    };
}

export default new ProxyOptions()