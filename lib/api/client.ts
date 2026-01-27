import axios from "axios";

// ❌ 수정 전: process.env... || "http://127.0.0.1:8000"
// (이렇게 8000번 포트가 적혀있으면 리라이트(Proxy)를 안 타고 직통으로 가서 404가 뜹니다)

// ✅ 수정 후: "" (빈 문자열)
// (이렇게 비워둬야 요청이 Next.js 서버로 먼저 가서, 아까 설정한 주소 변환 규칙이 적용됩니다)
const baseURL = "";

export const apiClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const api = apiClient;

export default apiClient;