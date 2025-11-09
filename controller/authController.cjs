const { createUser, loginUser } = require("../service/authService.js");

const createUserController = async (request, response) => {
  try {
    const { email, password, name, userType } = request.body;
    const userData = await createUser(email, password, name, userType);
    if (userData.status !== 201) {
      return response
        .status(userData.status)
        .json({ message: userData.message });
    }

    response.status(201).json({
      message: "User registered successfully",
      token: userData.token,
      user: {
        id: userData.user._id,
        email: userData.user.email,
        name: userData.user.name,
        role: userData.user.role,
      },
    });
  } catch (error) {
    response
      .status(500)
      .json({ message: "Server error", error: error.message });
    console.log(error);
  }
};

const loginUserController = async (request, response) => {
  try {
    const { email, password } = request.body;
    const result = await loginUser(email, password);
    if (result.status !== 200) {
      return response.status(result.status).json({ message: result.message });
    }

    response.json({
      message: result.message,
      token: result.token,
      user: {
        id: result.user._id,
        email: result.user.email,
        name: result.user.name,
        role: result.user.role,
      },
    });
  } catch (error) {
    response
      .status(500)
      .json({ message: "Server error", error: error.message });
    console.log(error);
  }
};

module.exports = {
  createUserController,
  loginUserController,
};
