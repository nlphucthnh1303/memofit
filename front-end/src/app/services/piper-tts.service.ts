import { Injectable } from '@angular/core';
import * as ort from 'onnxruntime-web';

@Injectable({
    providedIn: 'root'
})
export class PiperTtsService {
    private session: ort.InferenceSession | null = null;
    private config: any = null;

    constructor() {
        // Chỉ định CDN chứa các file bổ trợ xử lý tính toán WASM của ONNX Runtime Web
        ort.env.wasm.wasmPaths = 'https://cdn.jsdelivr.net/npm/onnxruntime-web/dist/';
    }

    // 1. Tải cấu hình JSON và Model ONNX vào RAM của trình duyệt
    async initTTS() {
        if (this.session && this.config) return;

        try {
            // Tải file cấu hình đi kèm trước
            const response = await fetch('assets/piper/en_US-lessac-low.onnx.json');
            this.config = await response.json();

            // Khởi tạo ONNX session nạp model 15MB vào RAM
            this.session = await ort.InferenceSession.create('assets/piper/en_US-lessac-low.onnx', {
                executionProviders: ['wasm'], // Chạy bằng WebAssembly (CPU của máy học sinh)
                graphOptimizationLevel: 'all'
            });

            console.log('Piper TTS Tiếng Anh đã sẵn sàng chạy offline trên client!');
        } catch (error) {
            console.error('Lỗi khi khởi tạo Piper TTS:', error);
        }
    }

    // 2. Hàm gọi chính để phát âm từ vựng
    async speak(text: string) {
        if (!this.session || !this.config) {
            await this.initTTS();
        }

        try {
            // Chuyển chữ tiếng Anh thường (ví dụ: "benefit") thành mảng ID ký hiệu ngữ âm tương ứng
            const phonemeIds = this.textToPhonemeIds(text.toLowerCase());

            // Thêm các token đặc biệt (bắt đầu, kết thúc, khoảng nghỉ) theo chuẩn cấu trúc Piper
            const inputIds = [this.config.phoneme_id_map['^'][0], ...phonemeIds, this.config.phoneme_id_map['$'][0]];

            // Tạo Tensor đầu vào chuẩn cho ONNX
            const inputTensor = new ort.Tensor('int64', BigInt64Array.from(inputIds.map(id => BigInt(id))), [1, inputIds.length]);
            const inputLengths = new ort.Tensor('int64', BigInt64Array.from([BigInt(inputIds.length)]), [1]);
            const scales = new ort.Tensor('float32', Float32Array.from([0.667, 1.0, 0.8]), [3]); // Cấu hình tốc độ, độ vang mặc định

            // Thực thi Model tính toán sinh sóng âm thanh dạng Raw
            const outputMap = await this.session!.run({
                'input': inputTensor,
                'input_lengths': inputLengths,
                'scales': scales
            });

            // Lấy mảng dữ liệu âm thanh thô Float32 đầu ra
            const outputAudio = outputMap['output'].data as Float32Array;

            // Phát âm thanh ra loa của máy học sinh
            this.playAudio(outputAudio);

        } catch (error) {
            console.error('Lỗi khi sinh giọng nói:', error);
        }
    }

    // Hàm chuyển text sang mã Id dựa vào bảng phoneme_id_map trong file .json
    private textToPhonemeIds(text: string): number[] {
        const ids: number[] = [];
        for (const char of text) {
            if (this.config.phoneme_id_map[char]) {
                ids.push(this.config.phoneme_id_map[char][0]);
            }
        }
        return ids;
    }

    // Hàm sử dụng AudioContext của trình duyệt để phát mảng dữ liệu thô (Raw Audio)
    private playAudio(audioData: Float32Array) {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        // File cấu hình của Piper quy định mẫu âm thanh đầu ra là 22050Hz
        const sampleRate = this.config.audio?.sample_rate || 22050;

        const audioBuffer = audioCtx.createBuffer(1, audioData.length, sampleRate);
        audioBuffer.getChannelData(0).set(audioData);

        const source = audioCtx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioCtx.destination);
        source.start();
    }
}