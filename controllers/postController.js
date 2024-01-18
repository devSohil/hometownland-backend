const Post = require("../models/postModel");
const Count = require("../models/countModel");
const fs = require("fs");
const User = require("../models/userModel");

exports.createPost = async (req, res) => {
  try {
    const {
      propertyType,
      areaWithUnit,
      area,
      state,
      country,
      currency,
      bedrooms,
      bathrooms,
      furnishing,
      floors,
      facing,
      swimming,
      listingfor,
      listedby,
      name,
      contact,
      email,
      whatsApp,
      communication,
      listingtenure,
      description,
      price,
    } = req.body;

    const files = req.files.map((file) => ({
      data: fs.readFileSync("uploads/" + file.filename),
      contentType: "image/png",
    }));
    let productId;
    const currentId = await Count.find({ _id: "658c119fc6395a59b624058c" });
    if (currentId.length !== 0) {
      const newId = currentId[0].count + 1;
      productId = await Count.findOneAndUpdate(
        { _id: "658c119fc6395a59b624058c" },
        { count: newId },
        { new: true }
      );
    }
    const user = await User.find({ _id: req.params?.id }).exec();
    const newPost = new Post({
      postId: productId?.count,
      propertyImage: files,
      propertyType,
      propertyArea: areaWithUnit,
      area,
      state,
      country,
      currency,
      bedrooms,
      bathrooms,
      furnishing,
      floors,
      facing,
      swimming,
      listingfor,
      listedby,
      name,
      contact,
      email,
      whatsApp,
      communication,
      listingtenure,
      description,
      price,
      userId: req.params?.id,
    });

    await newPost.save();

    res.status(201).json({ message: "Post created successfully" });
  } catch (error) {
    res.status(400).json({ error: "All fields required" });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find();

    res.status(200).json(posts);
  } catch (error) {
    res.status(400).json(error);
  }
};

exports.searchPost = async (req, res) => {
  const { search } = req.params;
  const matchingPlaces = await Post.aggregate([
    {
      $match: {
        $or: [
          { area: { $regex: new RegExp(search, "i") } },
          { state: { $regex: new RegExp(search, "i") } },
          { country: { $regex: new RegExp(search, "i") } },
        ],
      },
    },
  ]);

  res.json(matchingPlaces);
};

exports.filterPost = async (req, res) => {
  const { searched, filters, search } = req.query;
  try {
    const filt = filters?.rent
      ? "rent"
      : "" || filters?.sale
      ? "sale"
      : "" || filters?.book
      ? "book"
      : "";
    let matchingPlaces;
    if (searched) {
      matchingPlaces = await Post.aggregate([
        {
          $match: {
            $or: [
              { area: { $regex: new RegExp(search, "i") } },
              { state: { $regex: new RegExp(search, "i") } },
              { country: { $regex: new RegExp(search, "i") } },
            ],
          },
        },
      ]);
      if (filt) {
        const filteredPosts = matchingPlaces.filter(
          (post) => post.listingfor === filt
        );
        return res.status(200).json(filteredPosts);
      }
      // if (!search && !filt) {
      //   const posts = await Post.find();
      //   return res.status(200).json(posts);
      // }
    }
  } catch (error) {
    res.status(400).json(error);
  }
};

exports.singlePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.userPost = async (req, res) => {
  try {
    const post = await Post.find({ userId: req.params.id });
    res.status(200).json(post);
  } catch (error) {
    console.log(error);
  }
};

exports.deletePost = async (req, res) => {
  try {
    const deletedpost = await Post.findByIdAndDelete(req.params.id);
    const post = await Post.findById(deletedpost.userId);
    // res.status(200).json({ message: "Post deleted successfully" });
    res.status(200).json({ post });
  } catch (err) {
    res.status(500).json(err);
  }
};
