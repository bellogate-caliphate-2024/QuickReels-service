// __mocks__/firebase-admin.ts
export const admin = {
  apps: [],
  initializeApp: jest.fn(),
  credential: {
    cert: jest.fn(),
  },
};