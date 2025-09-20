# Design & Architectural Decisions

This document records the key decisions made throughout the NeoMind OS project, especially for aspects that were not explicitly defined in the initial specification.

## Phase 1: Foundation & Authentication

- **State Management for Auth:** Chose React Context (`AuthContext.tsx`) for managing global authentication state. It's lightweight, built-in, and sufficient for our current needs, avoiding the overhead of a larger state management library like Redux or Zustand for now.
- **Firebase Initialization:** Centralized all Firebase configurations and service exports in a single file (`src/utils/firebase.ts`) to ensure a single point of initialization and easy management of Firebase services.
