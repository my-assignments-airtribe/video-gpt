# **Video GPT Project - High-Level Design Document**

## **Revision History**

| Version | Date       | Description of Changes              | Author(s)          |
|---------|------------|-------------------------------------|--------------------|
| 1.0.0   | 2024-02-04 | Initial creation of the HLD         | Ashrith Prakash    |
| 1.0.1   | 2024-02-09 | Simplified to focus on speech extraction; added queuing | Ashrith Prakash    |

## **Document Information**

- **Title:** High-Level Design for Video GPT
- **Version:** 1.0.0
- **Date:** 2024-02-04
- **Document Owner:** Ashrith Prakash
- **Authors:** Ashrith Prakash

## **Table of Contents**

1. [Introduction](#introduction)
2. [System Overview](#system-overview)
3. [Functional Requirements](#functional-requirements)
4. [Non-Functional Requirements](#non-functional-requirements)
5. [Architecture Design](#architecture-design)
6. [Data Design](#data-design)
7. [Key APIs](#key-apis)
8. [Overall Approach](#overall-approach)
9. [Security](#security)

## Introduction

### **Purpose**

The purpose of this document is to outline the high-level design for the Video GPT project. This project aims to develop a backend system that enables users to interact with video content through natural language queries. This document is intended for project stakeholders, including project managers, developers, and investors.

### **Scope**

This HLD covers the conceptual design of the system, including the architecture, key components, database design, API endpoints, and the overall approach for implementation. It outlines both functional and non-functional requirements and provides initial estimations for project scope, resources, and timelines.

## System Overview

The Video GPT system is designed to revolutionize how users interact with video content by enabling them to ask questions and receive information based on video analysis. The system will leverage advanced AI models to understand and generate responses to user queries, providing a seamless and interactive experience. To accommodate slower processing times and ensure the backend remains responsive, we'll introduce a queue system to decouple video processing from the real-time handling of user queries. 

### **Components**

- **User Interface (UI):** A web or mobile interface for user interactions, allowing users to submit video URLs and queries.
- **Backend Server:** 
  - Handles user registration, authentication, and account management.
  - Receives video upload requests and user queries.
  - For video uploads, the server enqueues video processing jobs, allowing for asynchronous processing.
  - For user queries, the server checks if the requested video's speech data is available and processes the query accordingly.
- **Queueing System:** 
  - Manages video processing jobs, ensuring that video processing is handled efficiently without blocking user interactions.
  - Provides status updates on video processing to users.
- **Video Processing Module:** 
  - Processes jobs from the queue, focusing on extracting speech from videos.
- **AI & NLP Engine:** Analyzes the video content and processes user queries to generate relevant responses based on the video's context and content.
- **Database:** Manages the storage of user data, video metadata, query logs, and analysis results, ensuring fast retrieval and secure storage.

## Functional Requirements

1. **Video Processing and Analysis:**
 - The system must be able to fetch videos from given URLs.
 - It should process and analyze video content to extract speech.
2. **Query Processing:**
 - Users should be able to submit queries related to the video content.
 - The system must interpret these queries and provide relevant responses based on the video analysis.
3. **User Interaction:**
 - Users must be able to register, login, and manage their accounts.
 - The system should provide an interface for users to submit video URLs and queries, and to receive responses.
4. **Response Generation:** 
 - It generates responses to queries based on the content analysis of the submitted videos.
5. **Data Storage:**
 - The system must store user data, including their queries and interaction history, securely.
 - Video metadata extracted from the analysis should be stored efficiently for quick retrieval in response to queries.

## Non-Functional Requirements

1. **Performance:**
 - The system must provide timely responses to user queries, aiming for minimal latency in video processing and query response generation.
 - It should be optimized for efficient processing and analysis of video content.
2. **Scalability:**
 - The system must be scalable, capable of handling an increasing number of users and queries without degradation in performance.
 - It should support scaling of video processing capabilities to accommodate larger or more complex video files.
3. **Reliability:**
 - Ensure high availability of the service, with minimal downtime.
 - The system should handle errors gracefully and maintain operational integrity under various conditions.
4. **Usability:**
 - The user interface must be intuitive and user-friendly, allowing users to easily navigate and use the system without extensive training.

## Architecture Design

The Video GPT system uses a microservices architecture, with services for user management, video processing, AI analysis, and query response generation. These components interact over a RESTful API, ensuring modularity and scalability.

### Workflow
1. User inputs a video URL and submits a query through the UI.
2. The backend server receives the request and forwards it to the video processing module.
3. The video processing module fetches the video, processes it, and extracts relevant data.
4. The AI & NLP engine receives processed video data and the user's query, performs analysis, and generates a response.
5. The response is sent back to the UI to be displayed to the user.

### **Flow Chart**
  ![Flow Chart](./flow-chart.png)

## Data Design

### **Data Models**

#### PostgreSQL Database
 PostgreSQL is used for structured data storage, such as user information and video metadata. [ACID properties and relational data model]
- **Users Table**
  - **Columns:** `UserID`, `Username`, `Email`, `PasswordHash`, `CreatedAt`, `UpdatedAt`
  - **Purpose:** Stores information about registered users. Each record represents a unique user with authentication details.
- **Videos Table**
  - **Columns:** `VideoID`, `UserId`, `URL`, `Title`, `Description`, `CreatedAt`, `UpdatedAt`
  - **Purpose:** Contains metadata about processed videos. The `UserID` column relates each video to a user.
#### MongoDB Database
 MongoDB's schema-less nature allows for the storage of complex, nested data without predefined structure, ideal for the dynamic and detailed results of video analysis.
- **Queries Table**
  - **Columns:** `QueryID`, `UserID`, `VideoID`, `QueryText`, `ResponseText`, `Timestamp`
  - **Purpose:**  Logs user queries for analytics and debugging. This collection can easily accommodate variations in data structure, such as additional metadata about queries without requiring schema modifications.
- **SpeechData Table**
  - **Columns:** `AnalysisID`, `VideoID`, `TextData`, `Timestamps`, `Language`, `CreatedAt`, `UpdatedAt`
  - **Purpose:** Stores extracted speech data from videos, linked to the Videos table in PostgreSQL for efficient query processing.

## Key APIs

### **User Management**
```jsx
// Endpoint for user registration
Endpoint: /user/register
Method: POST
Description: Registers a new user.
Request: { "username": "user", "email": "user@example.com", "password": "password123" }
Response: { "userId": "456", "status": "registered" }
```
### **Video Processing**
```jsx
// Endpoint for video upload
Endpoint: /video/upload
Method: POST
Description: Uploads a video URL for processing.
Request: { "url": "https://example.com/video.mp4" }
Response: { "videoId": "123", "status": "processing" }
```
The `/video/upload` endpoint triggers the enqueueing of a video for processing. The processing status updates and eventual availability of speech data are managed through the queue and processing module, with relevant status updates made accessible to users, if necessary.

### **Query Handling**
```jsx
// Endpoint for submitting a query about a video
Endpoint: /video/query
Method: POST
Description: Submits a query about a video.
Request: { "videoId": "123", "query": "What is the main topic?" }
Response: { "response": "The main topic is AI advancements." }
```


## Overall Approach

### Implementation Strategy

- **Technologies & Tools:**
  - **Backend:**  Node.js/Express or any suitable backend framework
  - **Video Processing:** OpenCV, FFmpeg for video frame extraction and preprocessing.
  - **AI & NLP Engine:** TensorFlow, PyTorch for building custom models, or use pre-trained models like OpenAI's GPT for text processing.
  - **Queueing System:** RabbitMQ or Kafka for managing asynchronous tasks and decoupling services.
  - **Database:** MongoDB for storing video metadata and analysis results; PostgreSQL for structured data like user information.
  - **Frontend:** React, chosen for its component-based architecture.

- **Rationale Behind Key Decisions:**
  - **Microservices Architecture:** Ensures scalability and modularity.
  - **Local Development with Docker:** Facilitates easy transition to cloud platforms and ensures consistency across environments.
  - **API-First Design:** Provides flexibility and ease of integration with other applications or services.
  

### Scalability & Performance

- Design the system to handle a high volume of concurrent users and queries.
- Use efficient data storage and retrieval techniques to minimize response times.

## Security
TBD
