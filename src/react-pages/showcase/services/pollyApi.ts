import type { VisemeData } from "@/demo-lib/polly";

import { getApiBase } from "./apiBase";

const normalizeBase = (base: string): string => base.trim().replace(/\/$/, "");

export const fetchVisemeData = async (
	text: string,
	voice: string,
): Promise<{ visemeData: VisemeData; audioBlob: Blob }> => {
	const base = getApiBase();
	if (!base) {
		throw new Error("Voice synthesis is unavailable. Configure VITE_API_URL to enable TTS.");
	}
	const apiBase = normalizeBase(base);

	const visemesPromise = fetch(`${apiBase}/tts/get-visemes`, {
		method: "POST",
		mode: "cors",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			voice,
			text,
		}),
	}).then((res) => {
		if (!res.ok) {
			throw new Error(`Failed to fetch visemes: ${res.status}`);
		}
		return res.json();
	});

	const audioPromise = fetch(`${apiBase}/tts/get-audio`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			voice,
			text,
		}),
	}).then((res) => {
		if (!res.ok) {
			throw new Error(`Failed to fetch audio: ${res.status}`);
		}
		return res.blob();
	});

	const [visemeData, audioBlob] = await Promise.all([visemesPromise, audioPromise]);

	return { visemeData, audioBlob };
};
