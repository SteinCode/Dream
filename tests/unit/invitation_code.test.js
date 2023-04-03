const generateCode =
  require("../../backend/controllers/codeGenerator.js").generateCode;
const server = require("../../server");
const mysql = require("mysql");

afterAll((done) => {
  server.close(done);
});
// Mock the mysql module
jest.mock("mysql", () => {
  return {
    createConnection: jest.fn(() => {
      return {
        connect: jest.fn(),
        query: jest.fn(),
        end: jest.fn(),
      };
    }),
  };
});

describe("generateCode function", () => {
  test("Should return a string of length 5", () => {
    const code = generateCode(5);
    expect(code).toHaveLength(5);
  });

  test("Should return a string of length 10", () => {
    const code = generateCode(10);
    expect(code).toHaveLength(10);
  });

  test("Should return a string of only uppercase letters, lowercase letters, and digits", () => {
    const code = generateCode(10);
    const pattern = /^[A-Za-z0-9]+$/;
    expect(pattern.test(code)).toBe(true);
  });

  test("Should return a different code every time it's called", () => {
    const code1 = generateCode(10);
    const code2 = generateCode(10);
    expect(code1).not.toEqual(code2);
  });

  test("Should throw an error if length argument is not a number", () => {
    expect(() => generateCode("not a number")).toThrow();
  });

  test("should generate a code with the correct length", () => {
    const length = 10;
    const code = generateCode(length);
    expect(code).toHaveLength(length);
  });

  test("should generate a code containing only alphanumeric characters", () => {
    const length = 10;
    const code = generateCode(length);
    const regex = /^[a-zA-Z0-9]+$/;
    expect(code).toMatch(regex);
  });

  test("should generate a different code every time it is called", () => {
    const length = 10;
    const code1 = generateCode(length);
    const code2 = generateCode(length);
    expect(code1).not.toEqual(code2);
  });
});
