const generateCode =
  require("../../backend/controllers/codeGenerator.js").generateCode;
const addCodeToDB =
  require("../../backend/controllers/codeGenerator.js").addCodeToDB;

// const db = {
//   query: jest.fn(),
// };
const db = require("../../database");
const server = require("../../server.js");

describe("The generateCode function", () => {
  describe("Boundary testing", () => {
    test("generateCode returns an empty string for length 0", () => {
      expect(generateCode(0)).toEqual("");
    });
    test("generateCode returns a string of 100 characters for length 100", () => {
      const code = generateCode(100);
      expect(code.length).toBe(100);
    });
  });
  describe("Equivalence Partitioning", () => {
    test("generateCode returns a string of 20 characters for length 20", () => {
      const code = generateCode(20);
      expect(code.length).toBe(20);
    });
    test("generateCode returns a unique code each time it is called with the same length parameter", () => {
      const length = 10;
      const code1 = generateCode(length);
      const code2 = generateCode(length);
      expect(code1).not.toEqual(code2);
    });
  });
});

describe("The addCodeToDB function", () => {
  test("addCodeToDB calls back with the correct results when the database query is successful", (done) => {
    const code = generateCode(10);
    const expectedResults = { insertId: 123, affectedRows: 1 };
    jest.spyOn(db, "query").mockImplementation((query, params, callback) => {
      callback(null, expectedResults);
    });

    addCodeToDB(code, (error, results) => {
      expect(error).toBeNull();
      expect(results).toEqual(expectedResults);
      done();
    });
  });
  describe("Error guessing", () => {
    test("addCodeToDB calls back with an error if the database query fails", () => {
      const callback = jest.fn();
      const error = new Error("Database query failed");
      jest.spyOn(db, "query").mockImplementation((query, params, callback) => {
        callback(error);
      });

      addCodeToDB("ABCD123", callback);
      expect(callback).toHaveBeenCalledWith(error);
    });
  });
});
