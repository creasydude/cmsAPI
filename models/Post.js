import mongoose from 'mongoose';

const postSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    category: {
        type: Array,
        default: ["nocategory"]
    },
    authorId: {
        type: String,
        required: true
    }
});

postSchema.methods.updatePost = function (title, content, category) {
    this.title = title;
    this.content = content;
    if (category) this.category = category;
};

const Post = mongoose.model("Post", postSchema);
export default Post;