import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // ... 기타 설정들 ...

    async rewrites() {
        // BACKEND_ORIGIN > BACKEND_URL > 로컬(8000) 우선순위로 백엔드 목적지를 결정
        const backendUrl =
            process.env.BACKEND_ORIGIN ||
            process.env.BACKEND_URL ||
            "http://127.0.0.1:8000";

        return [
            {
                source: "/api/v1/:path*",
                destination: `${backendUrl}/:path*`, // 여기를 변수로 변경
            },
        ];
    },
};

export default nextConfig;
