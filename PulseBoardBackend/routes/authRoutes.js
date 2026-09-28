import e from "express";
import {
  authLogin,
  authRegister,
  changePassword,
  getCurrentUser,
  getSessions,
  logoutCurrentSession,
  revokeOtherSessions,
  revokeSession,
  updateCurrentUser,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";
// import User from "../models/user.js";      //definatily we get error here

const router = e.Router()

// router.post('/register', async (req, res) =>{
//     try {
//         const {firstname, lastname, email, password} = req.body

//         const exitingUser = await User.findOne({email});        //check if user alrdy exts
//         if (exitingUser) {
//             return res.status(400).json({message: "User already exists ln:-12"})
//         }

//         // create new user
//         const newUser = new User({
//             firstname,
//             lastname,
//             email,
//             password,
//         })

//         await newUser.save()

//         res.status(200).json({message: "Reg successful"})
//     } catch (error) {
//         console.log(error); 
//         res.status(500).json({message: "Server error from authroutes"})
//     }
// })

router.post('/register', authRegister)
router.post('/login', authLogin)
router.get("/me", protect, getCurrentUser);
router.patch("/me", protect, updateCurrentUser);
router.patch("/change-password", protect, changePassword);
router.get("/sessions", protect, getSessions);
router.delete("/sessions/others", protect, revokeOtherSessions);
router.delete("/sessions/:sid", protect, revokeSession);
router.post("/logout", protect, logoutCurrentSession);

// router.get("/admin-test", protect, authorize("Admin"),(req, res) => {
//     res.status(200).json({
//       message: "Admin access granted",
//       user: req.user,
//     });
//   }
// );
// router.get("/management-test", protect, authorize("Admin", "Manager"), (req, res) => {
//     res.status(200).json({
//       message: "Management access granted",
//       user: req.user,
//     });
//   }
// );

export default router