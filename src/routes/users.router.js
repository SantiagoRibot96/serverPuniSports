import express from "express";
import passport from "passport";

import UserController from "../controllers/users.controller.js";
import { upload } from "../utils/multer.js";

const router = express.Router();
const userController = new UserController();

router.post("/", userController.registerUser);
router.post("/login", userController.validateUser);
router.get("/logout", userController.logout);
router.get("/", userController.getUsers);
router.delete("/", userController.deleteUser);
router.get("/current", passport.authenticate("current", {session: false}), userController.getUser);

router.get("/github", passport.authenticate("github", {
    scope: ["user: email"]
}), async (req, res) => {});

router.get("/githubcallback", passport.authenticate("github", {
    failureRedirect: "https://punisports.vercel.app//login"
}), userController.githubToken);

router.post("/requestPasswordReset", userController.requestPasswordReset);
router.post("/reset-password", userController.resetPassword);
router.get("/:rol/:umail", userController.changeRol);
router.post("/:umail/documents", upload.fields([{name: 'document'}, {name: 'product'}, {name: 'profile'}]), userController.uploadDocuments);

export default router;