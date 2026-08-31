import { getBrowserFingerprint } from "@/utils/fingerprint";
import axios from "axios";

export const api = axios.create({ baseURL: "/api" });

// ດັກທຸກ Request ໃຫ້ແນບ Fingerprint ໄປນຳອັດໂຕໂນມັດ
api.interceptors.request.use(async (config) => {
    const fingerprint = await getBrowserFingerprint();
    config.headers["x-device-fingerprint"] = fingerprint;
    return config;
});