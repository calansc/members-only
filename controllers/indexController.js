const db = require("../db/queries");
const bcrypt = require("bcryptjs");
const pool = require("../db/pool");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
require("../config/passport.js");

// add custom express validator
// const { body, validationResult } = require("express-validator");

// passport.use(
//   new LocalStrategy(async (username, password, done) => {
//     try {
//       const { rows } = await pool.query(
//         `SELECT * FROM users WHERE email = $1`,
//         [username]
//       );
//       const user = rows[0];

//       if (!user) {
//         console.log("incorrect email");
//         return done(null, false, { message: "Incorrect email" });
//       }
//       const match = await bcrypt.compare(password, user.password);
//       if (!match) {
//         // passwords do not match
//         console.log("incorrect password");
//         return done(null, false, { message: "Incorrect password" });
//       }
//       return done(null, user);
//     } catch (err) {
//       return done(err);
//     }
//   })
// );

// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// passport.deserializeUser(async (id, done) => {
//   try {
//     const { rows } = await pool.query(`SELECT * FROM users WHERE id = $1`, [
//       id,
//     ]);
//     const user = rows[0];
//     done(null, user);
//   } catch (err) {
//     done(err);
//   }
// });

async function deleteMessage(req, res, next) {
  try {
    console.log("delete message id:", req.params["messageId"]);
    await pool.query("DELETE FROM messages WHERE id = ($1)", [
      req.params["messageId"],
    ]);
    await pool.query("DELETE FROM user_message WHERE messageid = ($1)", [
      req.params["messageId"],
    ]);
    res.redirect("/");
  } catch (err) {
    console.error(err);
    return next(err);
  }
}

async function postNewMessage(req, res, next) {
  try {
    const title = req.body.title;
    const text = req.body.messageText;
    const userId = req.user.id;
    console.log("post new message:", title, text, userId);

    const insertMessageQuery =
      "INSERT INTO messages (title, text, timestamp) VALUES ($1, $2, NOW()) RETURNING id";
    const messageResult = await pool.query(insertMessageQuery, [title, text]);
    const messageId = messageResult.rows[0].id;
    console.log("Inserted message with ID:", messageId);

    const insertUserMessageQuery =
      "INSERT INTO user_message (userid, messageid) VALUES ($1, $2)";
    await pool.query(insertUserMessageQuery, [userId, messageId]);

    res.redirect("/");
  } catch (err) {
    console.error(err);
    return next(err);
  }
}

async function postAdminRegister(req, res, next) {
  try {
    const adminCode = req.body.adminCode;
    if (adminCode === process.env.ADMIN_PASSWORD) {
      console.log("correct admin code");
      await pool.query("UPDATE users SET admin = TRUE WHERE id = ($1)", [
        req.user.id,
      ]);
      res.redirect("/");
    } else {
      res.render("index", {
        user: req.user,
        errors: [{ msg: "Incorrect admin code", req }],
      });
    }
  } catch (err) {
    console.error(err);
    return next(err);
  }
}

async function getAdminRegister(req, res) {
  res.render("admin-register", { user: req.user });
}

async function postMemberRegister(req, res, next) {
  try {
    const memberCode = req.body.memberCode;
    if (memberCode === process.env.MEMBER_PASSWORD) {
      console.log("correct member code");
      await pool.query("UPDATE users SET member = TRUE WHERE id = ($1)", [
        req.user.id,
      ]);
      res.redirect("/");
    } else {
      res.render("index", {
        user: req.user,
        errors: [{ msg: "Incorrect member code", req }],
      });
    }
  } catch (err) {
    console.error(err);
    return next(err);
  }
}

async function getMemberRegister(req, res) {
  res.render("member-register", { user: req.user });
}

async function login(req, res, next) {
  // call passport?
  console.log("call login", req.body);
  passport.authenticate("local", {
    successRedirect: "/login-success",
    failureRedirect: "/login-failure",
  })(req, res, next);
}

async function redirectIndex(req, res, next) {
  res.redirect("/");
}

async function loginFailure(req, res) {
  res.render("index", {
    errors: [{ msg: "Username or password did not match", req }],
  });
}

async function logout(req, res) {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
}

async function postSignUp(req, res, next) {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    await pool.query(
      "INSERT INTO users (firstname, lastname, email, password) VALUES ($1, $2, $3, $4)",
      [req.body.firstname, req.body.lastname, req.body.email, hashedPassword]
    );
    res.redirect("/");
  } catch (err) {
    console.error(err);
    return next(err);
  }
}

async function signUp(req, res) {
  res.render("sign-up-form");
}

async function index(req, res) {
  try {
    const results = await pool.query(
      "SELECT to_char(timestamp, 'Mon DD HH24:MI') AS posted, title, text, messages.id, firstname, lastname FROM messages INNER JOIN user_message ON messages.id = user_message.messageid INNER JOIN users ON user_message.userid = users.id ORDER BY timestamp DESC"
    );
    const messages = results.rows;
    res.render("index", {
      user: req.user,
      messages: messages,
    });
  } catch (err) {
    console.error(err);
    return next(err);
  }
}

module.exports = {
  index,
  signUp,
  postSignUp,
  login,
  logout,
  loginFailure,
  redirectIndex,
  getMemberRegister,
  postMemberRegister,
  getAdminRegister,
  postAdminRegister,
  postNewMessage,
  deleteMessage,
};
