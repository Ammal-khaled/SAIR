server: {
  proxy: {
    "/api": {
      target: "http://sair-cpa-api.duckdns.org",
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, "")
    }
  }
}