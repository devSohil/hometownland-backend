const express = require("express");
const {
  createPost,
  getAllPosts,
  searchPost,
  filterPost,
  singlePost,
  deletePost,
  userPost,
} = require("../controllers/postController");
const multer = require("multer");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

router.route("/").get(getAllPosts);
router.route("/search/:search").get(searchPost);
router.route("/filter").get(filterPost);
router.route("/singlepost/:id").get(singlePost);
router.route("/delete/:id").delete(deletePost);
router.route("/profile/:id").get(userPost);
router
  .route("/createpost/:id")
  .post(upload.array("propertyImage", 5), createPost);
module.exports = router;
