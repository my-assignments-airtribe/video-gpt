// Assuming you're using the Google Cloud Speech-to-Text client
import speech, { protos } from '@google-cloud/speech';
import fs from 'fs';

const client = new speech.SpeechClient();

export const transcribeAudio = async (filePath: string): Promise<string> => {
  const file = fs.readFileSync(filePath);
  const audioBytes = file.toString('base64');

  const audio: protos.google.cloud.speech.v1.IRecognitionAudio = {
    content: audioBytes,
  };

  const config: protos.google.cloud.speech.v1.IRecognitionConfig = {
    encoding: 'MP3',
    sampleRateHertz: 16000,
    languageCode: 'en-US',
  };

  const request: protos.google.cloud.speech.v1.IRecognizeRequest = {
    audio: audio,
    config: config,
  };

  try {
    // Await the recognize method's promise and then destructure its response
    const [response] = await client.recognize(request);
    const transcription = response.results
      ?.map(result => result.alternatives?.[0]?.transcript)
      .filter((transcript): transcript is string => !!transcript)
      .join('\n');
  
    return transcription || '';
  } catch (error) {
    console.error('Error during transcription:', error);
    throw error; // Rethrow the error to handle it upstream
  }
};
