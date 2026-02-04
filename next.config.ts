import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // ... 기타 설정들 ...

    async rewrites() {
        // BACKEND_URL 값이 없으면 로컬(8000)로 연결
        const backendUrl = process.env.BACKEND_URL || "http://127.0.0.1:8000";

        return [
            {
                source: "/api/v1/:path*",
                destination: `${backendUrl}/:path*`, // 여기를 변수로 변경
            },
        ];
    },
};

export default nextConfig;
