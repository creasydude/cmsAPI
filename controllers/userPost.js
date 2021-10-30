import Post from "../models/Post.js";
import SucResponse from "../utils/SucResponse.js";
import ErrorResponse from "../utils/ErrorResponse.js";

export const showPostController = async (req, res, next) => {
    const authorId = req.userId;
    try {
        const userPosts = await Post.find({ authorId });
        SucResponse(res, 200, userPosts);
    } catch (err) {
        next(err);
    }
};

export const updatePostController = async (req, res, next) => {
    const { _id, newTitle, newContent, newCategory } = req.body;
    const authorId = req.userId;
    if (!_id || !newTitle || !newContent) return next(new ErrorResponse("Enter PostId , Title , Content.", 400));
    try {
        const post = await Post.findOne({ authorId, _id });
        post.updatePost(newTitle, newContent, newCategory);
        await post.save();
        SucResponse(res, 201);
    } catch (err) {
        next(err);
    }
};

export const deletePostController = async (req, res, next) => {
    const { _id } = req.body;
    const authorId = req.userId;
    if (!_id) return next(new ErrorResponse("Enter PostId.", 400));
    try {
        await Post.findOneAndDelete({ authorId, _id });
        SucResponse(res, 200);
    } catch (err) {
        next(err);
    }
};