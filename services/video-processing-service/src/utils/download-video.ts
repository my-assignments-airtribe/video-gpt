// src/utils/downloadVideo.ts
// import { exec } from 'youtube-dl-exec';
import axios from "axios";
import fs from "fs";
import path from "path";

import ytdl from "ytdl-core";

const downloadYouTubeVideo = (url: string, outputPath: string) => {
  return new Promise((resolve, reject) => {
    ytdl(url, { quality: "lowest" })
      .pipe(fs.createWriteStream(outputPath))
      .on("finish", resolve)
      .on("error", (e) => {
        console.error("Error downloading YouTube video", e);
        reject(new Error("Error downloading YouTube video"));
      });
  });
};

const isYouTubeUrl = (url: string): boolean => {
  return url.includes("youtube.com") || url.includes("youtu.be");
};

export const downloadVideo = async (
  url: string,
  outputPath: string
): Promise<string> => {
  if (isYouTubeUrl(url)) {
    // Use youtube-dl-exec for YouTube URLs
    console.log("Downloading YouTube video:", url, "to", outputPath);
    const result = await downloadYouTubeVideo(url, outputPath);
    console.log("Downloaded YouTube video:", result);
    return outputPath;
  } else {
    // Fallback to axios for other URLs
    const response = await axios({
      method: "GET",
      url: url,
      responseType: "stream",
    });

    const writer = fs.createWriteStream(outputPath);
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on("finish", () => resolve(outputPath));
      writer.on("error", reject);
    });
  }
};
