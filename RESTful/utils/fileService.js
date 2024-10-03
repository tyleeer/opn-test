import fs from "fs-extra";

const dataFilePath = "./data/users.json";

export const getUsersFromFile = async () => {
  try {
    const data = await fs.readFile(dataFilePath, "utf8");
    if (!data) return [];
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading from file", error);
    return [];
  }
};

export const saveUsersToFile = async (users) => {
  try {
    await fs.writeFile(dataFilePath, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error("Error writing to file", error);
  }
};
