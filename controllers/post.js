import Post from "../models/Post.js";
import ErrorResponse from "../utils/ErrorResponse.js";
import SucResponse from "../utils/SucResponse.js";

export const showPostsController = async (req, res, next) => {
    try {
        const posts = await Post.find();
        SucResponse(res, 201, { posts });
    } catch (err) {
        next(err);
    }
}

export const createPostController = async (req, res, next) => {
    let { title, content, category } = req.body;
    let authorId = req.userId;
    if (!title || !content) return next(new ErrorResponse("Missing Body Items.", 400));
    try {
        const post = await Post.create({
            title,
            content,
            category,
            authorId
        })
        SucResponse(res, 201, { post })
    } catch (err) {
        next(err)
    };
};