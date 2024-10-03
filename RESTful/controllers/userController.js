import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getUsersFromFile, saveUsersToFile } from "../utils/fileService.js";
import { PUBLIC_KEY } from "../utils/index.js";

export const registerUser = async (req, res) => {
  try {
    const {
      email,
      password,
      name,
      dateOfBirth,
      gender,
      address,
      isSubscriptionOn,
    } = req.body;

    if (!email || !password || !name || !isSubscriptionOn) {
      return res
        .status(400)
        .json({ message: "Invalid input: All fields are required" });
    }

    const users = await getUsersFromFile();
    const checkUserExist = users.find((u) => u.email == email);
    if (checkUserExist) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    const hashedPassword = bcrypt.hashSync(password);
    const newUser = {
      id: Date.now(),
      email,
      password: hashedPassword,
      name,
      dateOfBirth,
      gender,
      address,
      isSubscriptionOn,
    };

    users.push(newUser);
    await saveUsersToFile(users);

    res.status(201).json({ message: "Register successful!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const users = await getUsersFromFile();

    const user = users.find((u) => u.email === email);
    if (user && bcrypt.compareSync(password, user.password)) {
      const token = jwt.sign({ id: user.id, email: user.email }, PUBLIC_KEY, {
        expiresIn: "1h",
      });

      const hashedId = bcrypt.hashSync(user.id.toString());
      const userData = {
        id: hashedId,
        name: user.name,
        email: user.email,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
        address: user.address,
        isSubscriptionOn: user.isSubscriptionOn,
      };

      res.json({ user: userData, message: "Login successful!", token });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (newPassword != confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match!" });
    }

    const users = await getUsersFromFile();

    const user = users.find((u) => u.id == req.user.id);
    if (user && bcrypt.compareSync(currentPassword, user.password)) {
      user.password = bcrypt.hashSync(newPassword);
      await saveUsersToFile(users);

      res.json({ message: "Password changed successfully!" });
    } else {
      res.status(400).json({ message: "Invalid current password!" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteUserAccount = async (req, res) => {
  try {
    const { userId } = req.body;
    const users = await getUsersFromFile();
    const userIdFromToken = req.user.id;

    const isMatch = bcrypt.compareSync(userIdFromToken.toString(), userId);
    if (!isMatch) {
      return res
        .status(403)
        .json({ message: "Forbidden: User ID does not match" });
    }

    const userExists = users.find((u) => u.id == userIdFromToken);
    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }

    const filteredUsers = users.filter((u) => u.id != userIdFromToken);
    await saveUsersToFile(filteredUsers);

    res.json({ message: "Account deleted successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
