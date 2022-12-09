const UserAuth = require("../../model/Auth");
const OtpData = require("../../model/Otp");
const Feedback = require("../../model/Feedback");
const Moviedata = require("../../model/Movie");
const Bookdata = require("../../model/Book")
const Seriesdata = require("../../model/Series")
const Time = require("../../model/TimeTracker")
var validator = require("validator");
var bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const { SendEmail } = require("../../utils/nodemailer");


const extime = 10 * 60 * 60;
const genratetoken = (id) => {
  return jwt.sign({ id }, "Imaginarium-GraphQL", {
    expiresIn: extime,
  });
};

const resolvers = {
  Query: {
    getUser: async () => {
      const users = await UserAuth.find();
      return users;
    },

    logout: async (_, args) => {
      const user = await UserAuth.findOneAndUpdate({ email: args.email }, { authToken: null }, { new: true })
        .then((result) => {
          return console.log("User LogOut Successfully...");
        }).catch((err) => {
          return console.log(err.message);
        })
    },


    //================= Movie APIS =================
    getMovie: async (_, args) => {
      const data = await Moviedata.findById({ _id: args.movieId })
      return data
    },

    deleteActor: async (_, args) => {
      let data
      try {
        const { actorId, movieId } = args
        const movie = await Moviedata.findById({ _id: movieId })
        if (!movie) {
          return console.log("Movie Doesn't Exists...");
        }
        await Moviedata.findOneAndUpdate(
          { _id: movieId },
          { $pull: { actors: { _id: actorId } } },
          { safe: true, multi: false }
        ).then((result) => {
          data = result
          console.log(data);
        }).catch((err) => {
          return console.log(err.message);
        })
      } catch (error) {
        return console.log(error.message);
      }
      return data
    },

    deleteSceneActor: async (parent, args) => {
      let data
      try {
        const { movieId, actId, sceneId, actorId } = args
        const movie = await Moviedata.findById({ _id: movieId })
        if (!movie) {
          return console.log("This Movie is Not Exists...");
        }
        await Moviedata.findByIdAndUpdate(
          { _id: movieId },
          { $pull: { "screenplay.$[e1].Scenes.$[e2].actors": { _id: actorId } } },
          {
            arrayFilters: [{
              "e1._id": actId,
            },
            {
              "e2._id": sceneId,
            }],
            new: true
          }).then((result) => {
            data = result.screenplay.filter(act => act._id == actId)
          }).catch((error) => {
            return console.log(error.message);
          })
      } catch (error) {
        return console.log(error.message);
      }
      return data[0]
    },

    getAuthorMovies: async (parent, args) => {
      let data
      try {
        const user = await UserAuth.findOne({ email: args.author })
        if (!user) {
          return console.log("User Is Doesn't Exists...");
        }
        const movies = await Moviedata.find({ author: args.author })
        if (!movies) {
          return console.log("You Can't Create Any Movie Right Now...");
        } else {
          data = movies
          console.log(data);
        }
      } catch (error) {
        return console.log(error.message);
      }
      return data
    },


    //================= Book APIS =================
    getBook: async (parent, args) => {
      const data = await Bookdata.findById({ _id: args.bookId })
      if (!data) {
        return console.log("Book Is Not Exists...");
      }
      return data
    },

    deleteWriter: async (parent, args) => {
      let data
      try {
        const book = await Bookdata.findById({ _id: args.bookId })
        if (!book) {
          return console.log("This Book Is Not Exists...");
        }
        await Bookdata.findByIdAndUpdate(
          { _id: args.bookId },
          { $pull: { writers: { _id: args.writerId } } },
          { new: true }
        ).then((result) => [
          data = result
        ]).catch((err) => {
          return console.log(error.message);
        })
      } catch (error) {
        return console.log(error.message);
      }
      return data
    },

    deleteChapterWriter: async (parent, args) => {
      let data
      try {
        const { bookId, actId, chapterId, writerId } = args
        const book = await Bookdata.findById({ _id: bookId })
        if (!book) {
          return console.log("This Book Is not Exists...");
        }
        await Bookdata.findByIdAndUpdate(
          { _id: bookId },
          { $pull: { "manuscript.$[e1].chapters.$[e2].writers": { _id: args.writerId } } },
          {
            arrayFilters: [
              {
                "e1._id": actId
              },
              {
                "e2._id": chapterId
              }
            ], new: true
          }
        ).then((result) => {
          data = result.manuscript.filter(act => act._id == actId)
          console.log(data[0]);
        }).catch((err) => {
          return console.log(err.message);
        })
      } catch (error) {
        return console.log(error.message);
      }
      return data[0]
    },

    getAuthorBooks: async (parent, args) => {
      try {
        const userBook = await Bookdata.find({ author: args.author })
        if (!userBook) {
          return console.log("User Don't Create Any Book...");
        }
        return userBook
      } catch (error) {
        return console.log(error.message);
      }
    },

    deleteBookAct: async (parent, args) => {
      let data
      try {
        const book = await Bookdata.findById({ _id: args.bookId })
        if (!book) {
          return console.log("Book Is Not Exists...");
        }
        await Bookdata.findByIdAndUpdate(
          { _id: args.bookId },
          { $pull: { manuscript: { _id: args.actId } } }, { new: true }
        ).then((result) => {
          data = result
          console.log(data);
        }).catch((error) => {
          return console.log(error.message);
        })
      } catch (error) {
        return console.log(error.message);
      }
      return data
    },

    deleteBookChapter: async (parent, args) => {
      let data
      try {
        const book = await Bookdata.findById({ _id: args.bookId })
        if (!book) {
          return console.log("Book Is Not Exists...");
        }
        await Bookdata.findByIdAndUpdate(
          { _id: args.bookId },
          { $pull: { "manuscript.$[e1].chapters": { _id: args.chapterId } } },
          {
            arrayFilters: [
              {
                "e1._id": args.actId
              }
            ], new: true
          }
        ).then((result) => {
          data = result
        }).catch((error) => {
          return console.log(error.message);
        })
      } catch (error) {
        return console.log(error.message);
      }
      return data
    },


    //================= Series APIS =================
    getSeries: async (parent, args) => {
      const data = await Seriesdata.findById({ _id: args.seriesId })
      return data
    },

    deleteSeriesActor: async (parent, args) => {
      let data
      try {
        const { actorId, seriesId } = args
        const series = await Seriesdata.findById({ _id: seriesId })
        if (!series) {
          return console.log("series Doesn't Exists...");
        }
        await Seriesdata.findOneAndUpdate(
          { _id: seriesId },
          { $pull: { actors: { _id: actorId } } },
          { safe: true, multi: false }
        ).then((result) => {
          data = result
          return;
        }).catch((err) => {
          return console.log(err.message);
        })
      } catch (error) {
        return console.log(error.message);
      }
      return data
    },

    deleleSeriesSceneActor: async (parent, args) => {
      let data
      try {
        const { seriesId, seasonId, episodeId, actId, sceneId, actorId } = args
        const series = await Seriesdata.findById({ _id: seriesId })
        if (!series) {
          return console.log("This Series Is Can't Exists...");
        }
        await Seriesdata.findByIdAndUpdate(
          { _id: seriesId },
          { $set: { "screenplay.$[season].Episodes.$[episode].Acts.$[act].Scenes.$[scene].actors": { _id: actorId } } },
          {
            arrayFilters: [
              { "season._id": seasonId },
              { "episode._id": episodeId },
              { "act._id": actId },
              { "scene._id": sceneId },
            ], new: true
          }
        ).then((result) => {
          data = result.screenplay.filter(season => season._id == seasonId)
          return
        }).catch((error) => {
          return console.log(error.message);
        })
      } catch (error) {
        return console.log(error.message);
      }
      return data[0]
    },

    getAuthorSeries: async (parent, args) => {
      let data
      try {
        const user = await UserAuth.findOne({ email: args.author })
        if (!user) {
          return console.log("User Is Doesn't Exists...");
        }
        const series = await Seriesdata.find({ author: args.author })
        if (!series) {
          return console.log("You Can't Create Any Series Right Now...");
        } else {
          data = series
        }
      } catch (error) {
        return console.log(error.message);
      }
      return data
    },

    deleteSeason: async (parent, args) => {
      let data
      try {
        const series = await Seriesdata.findById({ _id: args.seriesId })
        if (!series) {
          return console.log("series Is Not Exists...");
        }
        await Seriesdata.findByIdAndUpdate(
          { _id: args.seriesId },
          { $pull: { screenplay: { _id: args.seasonId } } }, { new: true }
        ).then((result) => {
          data = result
        }).catch((error) => {
          return console.log(error.message);
        })
      } catch (error) {
        return console.log(error.message);
      }
      return data
    },


    //================= Time Tracking APIS =================
    getTime:async (parent, args)=>{
      let data
      try {
        const Timedata = await Time.findOne({user:args.user}).then((result)=>{
          data = result
        })        
      } catch (error) {
        return console.log(error.message);
      }
      return data
    }
  },





  Mutation: {
    signUp: async (parent, args) => {
      let data;
      try {
        const { username, email, password, conpassword } = args;
        if (!username || !email || !password || !conpassword) {
          return console.log("Please Enter All Details");
        }
        if (!validator.isEmail(email)) {
          return console.log("Enter Valid Email");
        }
        const user = await UserAuth.findOne({ email: email });
        if (user) {
          return console.log("User Is Alredy Exists");
        }
        const strongPassword = new RegExp(
          "(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})"
        );
        if (!strongPassword.test(password.trim())) {
          return console.log(
            "Password must be at least 8 characters long with one uppercase letter, one lowercase letter, one digit, and one special character !"
          );
        }
        if (password != conpassword) {
          return console.log("Confirm Password Was Not Matched");
        }
        let otp = await otpGenerator.generate(6, {
          lowerCaseAlphabets: false,
          upperCaseAlphabets: false,
          specialChars: false,
        });
        const hashpass = await bcrypt.hash(password, 10);
        const hashotp = await bcrypt.hash(otp, 10);
        await new UserAuth({
          username,
          email,
          password: hashpass,
        })
          .save()
          .then((result) => {
            data = result;
            SendEmail(email, "Verify User", otp);
            new OtpData({ email, otp: hashotp }).save().then(() => {
              console.log("User Created Please Check Your Mail....");
            });
          })
          .catch((err) => {
            return console.log(err.message);
          });
      } catch (error) {
        return console.log(error.message);
      }
      return data;
    },

    verifyUser: async (parent, args) => {
      try {
        const { email, otp } = args;
        const user = await UserAuth.findOne({ email: email });
        if (!user) {
          return console.log("User Is Not Registered...");
        }
        const UserOtp = await OtpData.findOne({ email: email });
        if (!UserOtp) {
          return console.log("Otp Is Not Genrated...");
        }
        if (UserOtp.expiresAt < Date.now()) {
          return console.log("Otp Is Expired...");
        }
        const validate = await bcrypt.compare(otp, UserOtp.otp);
        if (!validate) {
          return console.log("Enter Valid Otp...");
        }
        await UserAuth.findOneAndUpdate(
          { email: email },
          { $set: { verify: true } },
          { new: true }
        ).then(() => {
          OtpData.findOneAndDelete({ email: email }).then(() => {
            return console.log("User Verified Successfully...");
          });
        });
      } catch (error) {
        return console.log(error.message);
      }
      return "Success";
    },

    signIn: async (parent, args) => {
      let data;
      try {
        const { email, password } = args;
        if (!email || !password) {
          return console.log("Please Enter All Details...");
        }
        if (!validator.isEmail(email)) {
          return console.log("Enter Valid Email...");
        }
        const user = await UserAuth.findOne({ email: email });
        if (!user) {
          return console.log("User Is Not Registered...");
        }
        const strongPassword = new RegExp(
          "(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})"
        );
        if (!strongPassword.test(password.trim())) {
          return console.log(
            "Password must be at least 8 characters long with one uppercase letter, one lowercase letter, one digit, and one special character !..."
          );
        }
        const validate = await bcrypt.compare(password, user.password);
        if (!validate) {
          return console.log("Invalid Credentials...");
        }
        if (user.verify != true) {
          return console.log("User Is Not Verified...");
        }
        let token = await genratetoken(user.id);
        await UserAuth.findByIdAndUpdate(
          { _id: user.id },
          { authToken: token },
          { new: true }
        )
          .then((result) => {
            data = result;
            return console.log("User Login Successfully...");
          })
          .catch((err) => {
            return console.log(err.message);
          });
      } catch (error) {
        return console.log(error.message);
      }
      return data;
    },

    forgotPasswordOtp: async (parent, args) => {
      try {
        const { email } = args;
        const user = await UserAuth.findOne({ email: email });
        if (!user) {
          return console.log("User Register First!!");
        }
        let otp = await otpGenerator.generate(6, {
          lowerCaseAlphabets: false,
          upperCaseAlphabets: false,
          specialChars: false,
        });
        await SendEmail(user.email, "Verification Mail", otp);
        let hashOtp = await bcrypt.hash(otp, 10);
        await new OtpData({
          email,
          otp: hashOtp,
          createdAt: Date.now(),
          expiresAt: Date.now() + 1000 * 60 * 60,
        })
          .save()
          .then(() => {
            console.log("Otp Send Successfully");
          });
      } catch (error) {
        return console.log(error.message);
      }
      return null;
    },

    verifyOtp: async (parent, args) => {
      try {
        const { otp, password, conpassword, email } = args;
        const userOtp = await OtpData.findOne({ email: email });
        if (!userOtp) {
          return console.log("Otp is Expired in DB");
        }
        if (userOtp.expiresAt < Date.now()) {
          await OtpData.findOneAndDelete({ email: email }).then(() => {
            return console.log("Otp is Expired");
          });
        }
        let validate = await bcrypt.compare(otp, userOtp.otp);
        if (!validate) {
          return console.log("Enter Valid Otp!!");
        }
        const strongPassword = new RegExp(
          "(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})"
        );
        if (!strongPassword.test(password.trim())) {
          return console.log(
            "Password must be at least 8 characters long with one uppercase letter, one lowercase letter, one digit, and one special character !"
          );
        }
        if (password != conpassword) {
          return console.log("Confirm Password Was Not Matched");
        }
        const hashpass = await bcrypt.hash(password, 10);
        await UserAuth.findOneAndUpdate(
          { email: email },
          { password: hashpass },
          { new: true }
        )
          .then((result) => {
            OtpData.findOneAndDelete({ email: email }).then(() => {
              return console.log("Password Update Successfully");
            });
          })
          .catch((err) => {
            return console.log(err.message);
          });
      } catch (error) {
        return console.log(error.message);
      }
      return null;
    },

    signUpbyGoogle: async (parent, args) => {
      let data;
      try {
        const { email } = args;
        let user = await UserAuth.findOne({ email: email });
        if (user) {
          return console.log("User Is Already Existes...");
        }
        token = genratetoken(email);
        await new UserAuth({ ...args, authToken: token, verify: true })
          .save()
          .then((result) => {
            data = result;
            return console.log("User Login Successfully");
          });
      } catch (error) {
        return console.log(error.message);
      }
      return data;
    },

    signUpbyApple: async (parent, args) => {
      let data;
      try {
        const { email } = args;
        let user = await UserAuth.findOne({ email: email });
        if (user) {
          return console.log("User Is Already Existes...");
        }
        token = genratetoken(email);
        await new UserAuth({ ...args, authToken: token, verify: true })
          .save()
          .then((result) => {
            data = result;
            return console.log("User Login Successfully");
          });
      } catch (error) {
        return console.log(error.message);
      }
      return data;
    },

    langauage: async (parent, args) => {
      let data;
      try {
        const { id, langauage } = args;
        await UserAuth.findOneAndUpdate(
          { id: id },
          { $set: { langauage: langauage } },
          { new: true }
        ).then((result) => {
          data = result;
          console.log("Langauage Added Successfully");
        });
      } catch (error) {
        return console.log(error.message);
      }
      return data;
    },

    editProfile: async (parent, args) => {
      try {
        const {
          email,
          username,
          firstname,
          oldpassword,
          password,
          conpassword,
          file,
        } = args;
        const user = await UserAuth.findOne({ email: email });
        if (!user) {
          return console.log("User Is Does't Exists...");
        }
        if (user.verify != true) {
          return console.log("User Is Not Verified...");
        }
        const strongfirstname = new RegExp("(?=.*[a-z])(?=.*[^a-z])(?=.{6,})");
        if (!strongfirstname.test(firstname)) {
          return res
            .status(400)
            .json({
              message:
                "Firstname must have 6 character include(alphabate and special character)",
            });
        }
        if (user.email == email) {
          if (!oldpassword) {
            await UserAuth.findOneAndUpdate(
              { email: email },
              { username: username, firstname: firstname, file: file },
              { new: true }
            )
              .then((result) => {
                return console.log("UserDetails Update Successfully...");
              })
              .catch((err) => {
                return console.log(err.message);
              });
          } else {
            const valid = await bcrypt.compare(oldpassword, user.password);
            if (!valid) {
              return console.log("OldPassword Is Wrong...");
            }
            const strongPassword = new RegExp(
              "(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})"
            );
            if (!strongPassword.test(password.trim())) {
              return console.log(
                "Password must be at least 8 characters long with one uppercase letter, one lowercase letter, one digit, and one special character !"
              );
            }
            if (password !== conpassword) {
              return console.log("NewPasswords Were Not Matched...");
            }
            const hashpassword = await bcrypt.hash(password, 10);
            await UserAuth.findOneAndUpdate(
              { email: email },
              {
                email: email,
                username: username,
                firstname: firstname,
                password: hashpassword,
                file: file,
              }
            )
              .then((result) => {
                return console.log("UserCredentils Update Successfully...");
              })
              .catch((err) => {
                return console.log(err.message);
              });
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    },

    feedback: async (parent, args) => {
      let data
      const { user, type, question, description } = args
      const userData = await UserAuth.findOne({ email: user })
      if (!userData) {
        return console.log("User Is Not Exists...");
      }
      await new Feedback({
        user, type, question, description
      }).save().then((result) => {
        data = result
        return console.log("FeedBack Store Successfully...");
      }).catch((err) => {
        return console.log(err.message);
      })
      return data
    },

    
    //================= Movie APIS =================
    addNewMovie: async (parent, args) => {
      let data
      try {
        const { type, moviebanner, title, tagline, synopsis, logline, genres, tags, actors, similarmovies, author, screenplay } = args
        let screenplayObj = {}
        let act = []
        let scene = []
        let description
        for (i = 1; i <= 4; i++) {
          act.push({
            actName: `Act ${i}`,
            Scenes: scene
          })
          for (j = 1; j <= 10; j++) {
            scene.push({
              sceneName: `Scene ${j}`,
              description,
              actors: []
            });
          }
          scene = [];
        }
        screenplayObj = Object.assign(act)
        const user = await UserAuth.findOne({ email: author });
        if (!user) {
          return console.log("User Doesn't Exists...");
        }
        if (user.verify != true) {
          return console.log("User Doesn't Verify...");
        }
        const Movie = await Moviedata.find({ title: title });
        if (Movie) {
          const match = Movie.map(data => data.author.includes(author))
          if (match.includes(true)) {
            return console.log(
              "You Can't Create Movie This Same Name, Try With Another..."
            );
          } else {
            await new Moviedata({
              screenplay: screenplayObj,
              ...args,
            })
              .save()
              .then((result) => {
                data = result;
              })
              .catch((err) => {
                return console.log(err.message);
              });
          }
        } else {
          await new Moviedata({
            screenplay: screenplayObj,
            ...args,
          })
            .save()
            .then((result) => {
              data = result;
            })
            .catch((err) => {
              return console.log(err.message);
            });
        }
      } catch (error) {
        return console.log(error.message);
      }
      return data
    },

    addNewActor: async (parent, args) => {
      try {
        const { actorname, heroname, actorDescription, actorImage } = args
        Actor = {
          actorname, heroname, actorDescription, actorImage
        }
      } catch (error) {
        return console.log(error.message);
      }
      return Actor
    },

    updateMovie: async (parent, args) => {
      let data
      try {
        const movie = await Moviedata.findById({ _id: args.movieId })
        if (!movie) {
          return console.log("This Movie Is Not Exists...");
        }
        await Moviedata.findByIdAndUpdate({ _id: args.movieId },
          { ...args }, { new: true }).then((result) => {
            data = result
          }).catch((err) => {
            return console.log(err.message);
          })
      } catch (error) {
        return console.log(error.message);
      }
      return data
    },

    updateScene: async (parent, args) => {
      let data
      try {
        const { movieId, actId, sceneId, sceneName, description, actors } = args
        const movie = await Moviedata.findById({ _id: movieId })
        if (!movie) {
          return console.log("This Movie is Not Exists...");
        }
        let SceneObj = {
          sceneName: sceneName,
          description: description,
          actors: actors
        }
        await Moviedata.findByIdAndUpdate(
          { _id: movieId },
          { $set: { "screenplay.$[e1].Scenes.$[e2]": SceneObj } },
          {
            arrayFilters: [{
              "e1._id": actId,
            },
            {
              "e2._id": sceneId,
            }],
            new: true
          }).then((result) => {
            data = result.screenplay.filter(act => act._id == actId)
          }).catch((error) => {
            return console.log(error.message);
          })
      } catch (error) {
        return console.log(error.message);
      }
      return data[0]
    },

    updateSceneActor: async (parent, args) => {
      let data
      try {
        const { movieId, actId, sceneId, actorId, actors } = args
        const movie = await Moviedata.findById({ _id: movieId })
        if (!movie) {
          return console.log("This Movie is Not Exists...");
        }
        await Moviedata.findByIdAndUpdate(
          { _id: movieId },
          { $set: { "screenplay.$[e1].Scenes.$[e2].actors.$[e3]": actors } },
          {
            arrayFilters: [{
              "e1._id": actId,
            }, {
              "e2._id": sceneId,
            }, {
              "e3._id": actorId
            }],
            new: true
          }).then((result) => {
            data = result.screenplay.filter(act => act._id == actId)
          }).catch((error) => {
            return console.log(error.message);
          })
      } catch (error) {
        return console.log(error.message);
      }
      return data[0]
    },


    //================= Book APIS =================
    addNewBook: async (parent, args) => {
      let data
      try {
        const user = await UserAuth.findOne({ email: args.author })
        if (!user) {
          return console.log("User Is Not Exists...");
        }
        const Book = await Bookdata.find({ title: args.title })
        if (Book.length) {
          const match = Book.map(data => data.author.includes(author))
          if (match.includes(true)) {
            return console.log("You Can't Create Book This Same Name, Try With Another...");
          } else {
            await new Bookdata({
              author: args.author,
              ...args
            }).save().then((result) => {
              data = result
              return;
            }).catch((err) => {
              return console.log(err.message);
            })
          }
        } else {
          await new Bookdata({
            author: args.author,
            ...args
          }).save().then((result) => {
            data = result
            return;
          }).catch((err) => {
            return console.log(err.message);
          })
        }
      } catch (error) {
        return console.log(error.message);
      }
      return data
    },

    addNewWriter: async (parent, args) => {
      return args
    },

    addNewAct: async (parent, args) => {
      let data
      try {
        const { bookId } = args
        const book = await Bookdata.findById({ _id: bookId })
        let Actname = book.manuscript.length
        let manuscriptObj = {}
        let act = []
        let chapter = []
        let description
        for (i = Actname + 1; i <= Actname + 1; i++) {
          act.push({
            actName: `Act ${i}`,
            chapters: chapter
          })
          for (j = 1; j <= 10; j++) {
            chapter.push({
              chapterName: `Scene ${j}`,
              description,
              writers: []
            });
          }
          chapter = [];
        }
        manuscriptObj = Object.assign(act)
        await Bookdata.findByIdAndUpdate(
          { _id: bookId },
          { $push: { manuscript: manuscriptObj } },
          { new: true }
        ).then((result) => {
          data = result
        }).catch((err) => {
          return console.log(err.message);
        })
      } catch (error) {
        return console.log(error.message);
      }
      return data
    },

    updateBook: async (parent, args) => {
      let data
      try {
        const book = await Bookdata.findById({ _id: args.bookId })
        if (!book) {
          return console.log("This Book Is Not Exists...");
        }
        await Bookdata.findByIdAndUpdate({ _id: args.bookId },
          { ...args }, { new: true }).then((result) => {
            data = result
          }).catch((err) => {
            return console.log(err.message);
          })
      } catch (error) {
        return console.log(error.message);
      }
      return data
    },

    updateChapter: async (parent, args) => {
      let data
      try {
        const { bookId, actId, chapterId, chapterName, description, writers } = args
        let chapterObj = {
          chapterName,
          description,
          writers
        }
        const book = await Bookdata.findById({ _id: bookId })
        if (!book) {
          return console.log("This Book Is not Exists...");
        }
        await Bookdata.findByIdAndUpdate(
          { _id: bookId },
          { $set: { "manuscript.$[e1].chapters.$[e2]": chapterObj } },
          {
            arrayFilters: [
              {
                "e1._id": actId
              },
              {
                "e2._id": chapterId
              }
            ], new: true
          }
        ).then((result) => {
          data = result.manuscript.filter(act => act._id == actId)
          console.log(data);
        }).catch((err) => {
          return console.log(err.message);
        })
      } catch (error) {
        return console.log(error.message);
      }
      return data[0]
    },

    updateChapterWriter: async (parent, args) => {
      let data
      try {
        const { bookId, actId, chapterId, writers, writerId } = args
        const book = await Bookdata.findById({ _id: bookId })
        if (!book) {
          return console.log("This Book Is not Exists...");
        }
        await Bookdata.findByIdAndUpdate(
          { _id: bookId },
          { $set: { "manuscript.$[e1].chapters.$[e2].writers.$[e3]": writers } },
          {
            arrayFilters: [
              {
                "e1._id": actId
              },
              {
                "e2._id": chapterId
              },
              {
                "e3._id": writerId
              }
            ], new: true
          }
        ).then((result) => {
          data = result.manuscript.filter(act => act._id == actId)
          console.log(data);
        }).catch((err) => {
          return console.log(err.message);
        })
      } catch (error) {
        return console.log(error.message);
      }
      return data[0]
    },


    //================= Series APIS =================
    addNewSeries: async (parent, args) => {
      let data
      try {
        const { author, title } = args
        const user = await UserAuth.findOne({ email: author })
        if (!user) {
          return console.log("User Is Not Register...");
        }
        const series = await Seriesdata.find({ title: title })
        if (series.length) {
          const same = series.map(data => data.author.includes(author))
          if (same.includes(true)) {
            return console.log("You Can't Create Series With The Same Name...");
          } else {
            console.log("in sub else....");
            await new Seriesdata({
              author: author,
              ...args
            }).save().then((result) => {
              data = result
            }).catch((err) => {
              return console.log(err.message);
            })
          }
        } else {
          console.log("in main else....");
          await new Seriesdata({
            author: author,
            ...args
          }).save().then((result) => {
            data = result
          }).catch((err) => {
            return console.log(err.message);
          })
        }
      } catch (error) {
        return console.log(error.message);
      }
      return data
    },

    addNewSeriesActor: async (parent, args) => {
      try {
        const { actorname, heroname, actorDescription, actorImage } = args
        Actor = {
          actorname, heroname, actorDescription, actorImage
        }
      } catch (error) {
        return console.log(error.message);
      }
      return Actor
    },

    addNewSeason: async (parent, args) => {
      let data
      try {
        const { seriesId, season } = args
        const series = await Seriesdata.findById({ _id: seriesId })
        if (!series) {
          return console.log("Series Is Can't Exists...");
        }
        let seasonObj = {
          seasonName: `Season ${series.screenplay.length + 1}`,
          seasonDescription: `Season ${series.screenplay.length + 1}'s ${season.seasonDescription}`,
          Episodes: []
        }
        await Seriesdata.findByIdAndUpdate(
          { _id: args.seriesId },
          { $push: { screenplay: seasonObj } },
          { new: true }
        ).then((result) => {
          data = result
          return
        }).catch((error) => {
          return console.log(error.message);
        })
      } catch (error) {
        return console.log(error.message);
      }
      return data
    },

    addNewSeriesEpisode: async (parent, args) => {
      let data
      try {
        const { seriesId, seasonId, episodeName } = args
        const series = await Seriesdata.findById({ _id: seriesId })
        if (!series) {
          return console.log("Series Is Can't Exists...");
        }
        let len = await series.screenplay.filter(season => season._id == seasonId)
        let description
        let seasonObj = {};
        let episode = [];
        let act = [];
        let scene = [];
        for (let j = 1; j <= 1; j++) {
          episode.push({
            episodeName: episodeName ? episodeName : `Episode ${((len[0].Episodes.length) + 1)}`,
            Acts: act
          })
          for (let k = 1; k <= 4; k++) {
            act.push({
              actName: `Act${k}`,
              Scenes: scene
            })
            for (let p = 1; p <= 10; p++) {
              scene.push({
                sceneName: `Scene${p}`,
                description,
                actors: []
              })
            }
            scene = [];
          }
          act = [];
        }
        seasonObj = Object.assign(episode)
        await Seriesdata.findByIdAndUpdate(
          { _id: seriesId },
          { $push: { "screenplay.$[e1].Episodes": seasonObj } },
          {
            arrayFilters: [{
              "e1._id": seasonId
            }], new: true
          }
        ).then((result) => {
          data = result.screenplay.filter(season => season._id == seasonId)
          return
        }).catch((error) => {
          return console.log(error.message);
        })
      } catch (error) {
        return console.log(error.message);
      }
      return data[0]
    },

    updateSeries: async (parent, args) => {
      let data
      try {
        const series = await Seriesdata.findById({ _id: args.seriesId })
        if (!series) {
          return console.log("This Book Is Not Exists...");
        }
        await Seriesdata.findByIdAndUpdate({ _id: args.seriesId },
          { ...args }, { new: true }).then((result) => {
            data = result
            return
          }).catch((err) => {
            return console.log(err.message);
          })
      } catch (error) {
        return console.log(error.message);
      }
      return data
    },

    updateSeriesScene: async (parent, args) => {
      let data
      try {
        const { seriesId, seasonId, episodeId, actId, sceneId, scene } = args
        const series = await Seriesdata.findById({ _id: seriesId })
        if (!series) {
          return console.log("This Series Is Can't Exists...");
        }
        await Seriesdata.findByIdAndUpdate(
          { _id: seriesId },
          { $set: { "screenplay.$[season].Episodes.$[episode].Acts.$[act].Scenes.$[scene]": scene } },
          {
            arrayFilters: [
              { "season._id": seasonId },
              { "episode._id": episodeId },
              { "act._id": actId },
              { "scene._id": sceneId },
            ], new: true
          }
        ).then((result) => {
          data = result.screenplay.filter(season => season._id == seasonId)
          return
        }).catch((error) => {
          return console.log(error.message);
        })
      } catch (error) {
        return console.log(error.message);
      }
      return data[0]
    },

    updateSeriesSceneActor: async (parent, args) => {
      let data
      try {
        const { seriesId, seasonId, episodeId, actId, sceneId, actorId, actors } = args
        const series = await Seriesdata.findById({ _id: seriesId })
        if (!series) {
          return console.log("This Series Is Can't Exists...");
        }
        await Seriesdata.findByIdAndUpdate(
          { _id: seriesId },
          { $set: { "screenplay.$[season].Episodes.$[episode].Acts.$[act].Scenes.$[scene].actors.$[actor]": actors } },
          {
            arrayFilters: [
              { "season._id": seasonId },
              { "episode._id": episodeId },
              { "act._id": actId },
              { "scene._id": sceneId },
              { "actor._id": actorId }
            ], new: true
          }
        ).then((result) => {
          data = result.screenplay.filter(season => season._id == seasonId)
          return
        }).catch((error) => {
          return console.log(error.message);
        })
      } catch (error) {
        return console.log(error.message);
      }
      return data[0]
    },

    
    //================= Time Tracking APIS =================
    addTrackTime: async (parent, args) => {
      let data
      try {
        const { user, totalTime } = args
        const extraTime = Number(totalTime) / 60;
        const Userdata = await UserAuth.findOne({ email: user });
        if (!Userdata) {
          return res.status(404).json({ code: 404, message: "User Not Found" });
        }
        const d_t = new Date();
        let year = d_t.getFullYear();
        let month = ("0" + (d_t.getMonth() + 1)).slice(-2);
        let day = ("0" + d_t.getDate()).slice(-2);
        let DateNow = day + "-" + month + "-" + year;        
        const User = await Time.findOne({ user: user });
        if (User) {
          if (User.time == DateNow) {
            data = User.userTime;
            Details = await data.find((Timedata) => Timedata.date == DateNow);
            if (Details) {
              newTime = Details.totalTime + extraTime;
              await Time.findOneAndUpdate(
                { user: user },
                {
                  $set: {
                    "userTime.$[e1]": {
                      totalTime: newTime.toFixed(2),
                      date: DateNow,
                    },
                  },
                },
                {
                  arrayFilters: [
                    {
                      "e1.date": DateNow,
                    },
                  ],
                  new: true,
                }
              )
                .then((result) => {
                  data = result
                  console.log(data,'111111111');
                })
                .catch((error) => {
                  return console.log(error.message);
                });
            }
          } else {
            await Time.findOneAndUpdate(
              { user: user },
              {
                $push: {
                  userTime: { totalTime: extraTime.toFixed(2), date: DateNow },
                },
              }
            )
              .then(async () => {
                await Time.findOneAndUpdate({ user: user }, { time: DateNow }).then((result) => {
                  data = result
                  console.log(data,'222222222222');
                })
              })
              .catch((error) => {
                return console.log(error.message);
              });
          }
        } else {
          await new Time({
            user: user,
            userTime: { totalTime: extraTime.toFixed(2), date: DateNow },
            time: DateNow,
          })
            .save()
            .then((result) => {
              data = result
              console.log(data,'33333333333');
            })
            .catch((error) => {
              return console.log(error.message);
            });
        }
      } catch (error) {
        return console.log(error.message);
      }
      return data
    }

  },
};
module.exports = { resolvers };
