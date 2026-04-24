# Design Specification: Salisbury Review Web App

## 1. Overview
This document outlines the design language, technical architecture, and UI/UX principles for the Salisbury Review web application. The design integrates Salisbury University's core branding, emphasizing a clean, modern, and collegiate aesthetic optimized for usability and performance.

## 2. Design System

### 2.1 Color Palette
The color palette utilizes standard Maroon and Gold as primary drivers, balanced with crisp neutral tones to ensure high readability and a professional appearance.

* **Primary Maroon:** `#8A1538` 
    * *Usage:* Primary call-to-action buttons, header backgrounds, and active navigational states.
* **Primary Gold:** `#FDB913` 
    * *Usage:* Accent elements, interactive review stars, and highlighting key analytical metrics.
* **Background (Base):** `#F3F4F6` 
    * *Usage:* Main application canvas to provide subtle contrast against content.
* **Surface (Cards):** `#FFFFFF` 
    * *Usage:* Review containers, input forms, and modal windows.
* **Text (Primary):** `#111827` 
    * *Usage:* High-contrast dark gray for primary content and headings.
* **Text (Secondary):** `#4B5563` 
    * *Usage:* Medium gray for metadata, timestamps, and secondary descriptions.

### 2.2 Typography
* **Font Family:** *Inter* or a similar modern sans-serif.
* **Hierarchy:** Strict distinction between headings (bold, varying sizes) and body copy (regular weight) to facilitate scanning.

## 3. Technical Architecture
The application is structured using a decoupled, highly scalable architecture.

* **Frontend Framework:** Next.js (React)
    * *Purpose:* Handles server-side rendering for optimal SEO on public reviews and provides a highly responsive user interface.
* **Styling:** Tailwind CSS
    * *Purpose:* Utility-first styling configured with the custom palette outlined in Section 2.1.
* **Backend API:** FastAPI (Python)
    * *Purpose:* Provides high-performance, asynchronous endpoints for review submission, retrieval, and user authentication.
* **Containerization:** Docker
    * *Purpose:* Standardizes the deployment environment across local development and production servers.

## 4. UI/UX Principles
* **Direct & Official Communication:** All interface copy, empty states, and system notifications will maintain a professional, objective, and direct tone.
* **Card-Based Information Architecture:** Reviews and entities will be presented within isolated surface containers to create a clear visual hierarchy.
* **Responsive Scaling:** The interface must fluidly adapt across mobile, tablet, and desktop viewports without loss of functionality.
* **Accessibility Standards:** All interactive elements must support keyboard navigation, and the maroon/gold color pairings must adhere to WCAG contrast guidelines.