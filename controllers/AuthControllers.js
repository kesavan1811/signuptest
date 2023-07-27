const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { StatusCodes } = require("http-status-codes");

const otpGenerator = require("otp-generator");

const register = async (req, res, next) => {
  bcrypt.hash(req.body.password, 10, function(err, hashedPass) {
    if (err) {
      res.json({
        error: err
      });
    }

    const OTP = otpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false
    });

    let userData = new User({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      username: req.body.username,
      email: req.body.email,
      phone: req.body.phone,
      password: hashedPass,
      otp: OTP
    });

    var email = req.body.email;

    const user = User.findOne({ email });

    if (user) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "User already registered"
      });
    } else {
      userData
        .save()
        .then(user => {
          return res.redirect("verification.html");
        })
        .catch(error => {
          res.json({
            message: "An error occured!"
          });
        });
    }
  });
};

const verifyOtp = async (req, res, next) => {
  const otp = req.body.otp;
  const phone = req.body.phone;

  const user = await User.findOne({
    phone
  });

  if (user && user.otp !== otp) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "You entered wrong otp!"
    });
  } else {
    User.findByIdAndUpdate(user._id, {
      $set: { status: true }
    })
      .then(() => {
        res.json({
          message: "Your account verified successfully"
        });
      })
      .catch(err => {
        res.json({
          message: "An error occured"
        });
      });
  }
};

module.exports = {
  register,
  verifyOtp
};
