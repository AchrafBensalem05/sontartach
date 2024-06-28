const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const maxAge = 24 * 60 * 60;

exports.signup = async (req, res) => {
  const { nom, prenom, position, departement, role, email, password } =
    req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(500).json({ message: "user already exist" });
    const hashedPassword = await bcrypt.hash(password, 12);
    const result = await User.create({
      nom: nom,
      prenom: prenom,
      position: position,
      departement: departement,
      role: role,
      email: email,
      password: hashedPassword,
    });
    console.log("userrrrrrrrrrrrrrrrrrr");
    const token = jwt.sign({ id: result.id }, config.secret, {
      algorithm: "HS256",
      allowInsecureKeySizes: true,
      expiresIn: 86400,
    });
    res.cookie("jwt", token, {
      httpOnly: false,
      maxAge: maxAge * 1000,
      sameSite: "none", // Set the SameSite attribute to 'none'
      secure: false,
    });

    res
      .status(200)
      .json({ result, token, message: "you ccreated user successfully" });
  } catch (error) {
    console.error("Error in signup:", error);
    return res.status(500).json({ message: "Internal server error" }); // 500 Internal Server Error
  }
};

exports.signin = async (req, res) => {
  console.log('before fiiiiiiiiiind user')
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    console.log('existingUser',existingUser)

    if (!existingUser) return res.status(500).json({error: 'email_not_found', message: "email not found" });

    const passwordIsValid = await bcrypt.compare(
      password,
      existingUser.password
    );
    console.log('passwordIsValid',passwordIsValid)
    if (!passwordIsValid) {
      console.log('passwordIsValid',passwordIsValid)
      return res.status(500).json({error: 'invalid_password', message: "password is incorrect" });
    }
    console.log('fiiiiiiiiiind userdddddddddddd')

    const token = jwt.sign({ id: existingUser.id }, config.secret, {
      algorithm: "HS256",
      allowInsecureKeySizes: true,
      expiresIn: 86400, // 24 hours
    });
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: maxAge * 1000,
      sameSite: "none", // Set the SameSite attribute to 'none'
      secure: false,
    });
    console.log('fiiiiiiiiiind user AAAAAAAAA')
    res
      .status(200)
      .json({ existingUser, token, message: "You logged in successfully" });
      console.log('fiiiiiiiiiind user BBBBBBBBBBBBB')

  } catch (error) {
    console.error("Error in signup:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getUser = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('amaaaaaaaaaaaaaani',id)

    const user = await User.findById(id)
    console.log('amaaaaaaaaaaaaaani',user)
    res.status(201).json({ user });
  } catch (error) {

    console.error("Error fetching Inspections:", error);
    res.status(500).json({ error: "Failed to fetch Inspections" });
  }
};
