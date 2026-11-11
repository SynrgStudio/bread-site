import { fileURLToPath } from "node:url"

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // El sitio es estático: `next build` lo deja en out/ y GitHub Pages lo sirve.
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  // El CSS va dentro del HTML: un pedido menos antes de pintar.
  experimental: { inlineCss: true },
  // Next agrega rellenos para navegadores viejos (Array.at, Object.hasOwn...)
  // que los de `browserslist` en package.json ya traen. Se reemplazan por un
  // módulo vacío.
  webpack(config, { webpack }) {
    config.plugins.push(
      new webpack.NormalModuleReplacementPlugin(
        /polyfills[\\/]polyfill-module/,
        fileURLToPath(new URL("./lib/empty.js", import.meta.url)),
      ),
    )
    return config
  },
}

export default nextConfig
