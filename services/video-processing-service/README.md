# Video Processing Service

## Introduction

This Video Processing Service provides an API for downloading videos from URLs, extracting audio, transcribing the audio to text, and analyzing the content to extract keywords. It leverages Google Cloud's Speech-to-Text API for transcription and is built with Node.js.

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or later recommended)
- Yarn (for dependency management)
- Google Cloud SDK (for authentication with Google Cloud services)

Additionally, you will need:
- A Google Cloud Platform (GCP) account
- A project on GCP with the Speech-to-Text API enabled
- A service account key file for authentication

## Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/videoprocessingservice.git
   cd videoprocessingservice
   ```
2. **Install dependencies:**
   ```bash
    yarn install
    ```
3. **Set up Google Cloud authentication:**
    - Create a service account in your GCP project and download the JSON key file.
    - Set the GOOGLE_APPLICATION_CREDENTIALS environment variable to the path of your JSON key file:
      ```bash
      export GOOGLE_APPLICATION_CREDENTIALS="/path/to/your/keyfile.json"
      ```
    - Alternatively, for Windows users:
      ```bash
      set GOOGLE_APPLICATION_CREDENTIALS="C:\path\to\your\keyfile.json"
      ```
## Running the Service

To start the service, run:
```bash
yarn start
```

## API Reference

The Video Processing Service provides the following endpoints:

- `POST /api/process-video`: Downloads a video from a URL and processes it to extract audio, transcribe the audio to text, and analyze the content to extract keywords.

  **Request:**
  ```json
  {
  "videoUrl": "https://example.com/path/to/video.mp4"
  }
  ```

  **Response:**
  ```json
  {
    "transcript": "Transcribed audio text...",
    "keywords": ["keyword1", "keyword2", "keyword3"]
  }
  ```

  ## Docker

  The Video Processing Service can also be run as a Docker container. 
  Please update the `Dockerfile` and `compose.yml` files with the appropriate environment variables and volumes for your service account key file.
  `- /Users/ashrith/Development/videogpt-416108-95c8a63eca76.json:/app/credentials.json` needs the `GOOGLE_APPLICATION_CREDENTIALS` to be updated with the path to your service account key file.
  run:
  ```bash
  docker compose up --build
  ```