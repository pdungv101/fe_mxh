// next.config.js
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/**", // Adjust this as per your actual path
      },
    ],
  },
};
