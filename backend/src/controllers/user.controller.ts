import { getStatusByName } from "../services/status.service.js";
import { createUser } from "../services/user.service.js";

const registerUser = async (req, res) => {
  try {
    const { full_name, email, password, roleId } = req.body;

    if (!full_name || !email || !password || !roleId) {
      return res.status(400).json({ message: "All fields are required." });
    }
    const statusName = roleId === 1 ? "approved" : "pending";
    const status = await getStatusByName(statusName); // Fetch ID from DB
    if (!status) {
      return res.status(500).json({ message: `Status '${statusName}' not found.` });
    }

    const user = await createUser({ full_name, email, password, roleId, statusId: status.id });
    
    const responseMessage =
      roleId === 1
        ? "Admin registered successfully."
        : "Registered. Waiting for admin approval.";

    res.status(201).json({ message: responseMessage, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Something went wrong" });
  }
};
export { registerUser };
