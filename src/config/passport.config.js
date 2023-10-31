import passport from "passport";
import local, { Strategy } from "passport-local";
import { createHash, isValidPass } from "../../utils.js";
import userModel from "../DAO/models/users.model.js";
const localStrategy = Strategy;

const initializePassport = () => {
  passport.use(
    "register",
    new localStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, username, password, done) => {
        try {
          let user = await userModel.findOne({ email: username });
          if (user) {
            console.log("usuario ya registrado");
            return done(null, false);
          } else {
            const newUser = {
              first_name: req.body.first_name, 
              last_name: req.body.last_name,
              email: req.body.email,
              age: req.body.age,
              password: createHash(password),
            };



            let result = await userModel.create(newUser);
            console.log("usuario registrado con exito");
            return done(null, result);
          }
        } catch (error) {
          console.log("error al obtener usuario en bd");
          return done("error al obtener usuario", error);
        }
      }
    )
  );

  ////////////////////////// login
  passport.use(
    "login",
    new localStrategy(
      { usernameField: "email" },
      async (username, password, done) => {
        try {
          const user = await userModel.findOne({ email: username });

          if (!user) {
            console.log(`el usuario no existe`);
          }
          if (!isValidPass(user, password)) {
            return done(null, false);
          }
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};

export default initializePassport;
