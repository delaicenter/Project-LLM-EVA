import * as FileSystem from "expo-file-system";

const API_URL = "http://172.22.22.22:33400/transcribe";

export async function uploadAudio(uri: string): Promise<string | null> {
     try {
          const fileInfo = await FileSystem.getInfoAsync(uri);
          if (!fileInfo.exists) {
               console.error("File tidak ditemukan:", uri);
               return null;
          }

          const fileSize = "size" in fileInfo ? (fileInfo as { size: number }).size : null;
          console.log("Ukuran file:", fileSize ?? "Unknown");

          const formData = new FormData();
          formData.append("audio", {
               uri,
               name: "recording.m4a",
               type: "audio/m4a",
          } as unknown as Blob);

          console.log("Mengirim audio ke server...");
          const response = await fetch(API_URL, {
               method: "POST",
               body: formData,
          });

          if (!response.ok) {
               console.error("Gagal upload, status:", response.status);
               return null;
          }

          const result = await response.json();
          console.log("Hasil transkripsi:", result);

          return result?.transcript ?? null;
     } catch (error) {
          console.error("Gagal upload audio:", error);
          return null;
     }
}
