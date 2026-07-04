/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  // Thumbnails are pre-optimized local .webp — skip the runtime optimizer
  // (and the sharp dependency) in the container.
  images: { unoptimized: true },
};

export default nextConfig;
