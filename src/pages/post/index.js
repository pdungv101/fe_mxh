// pages/posts.js
import CreatePost from "../../components/CreatePost";
import PostList from "../../components/PostList";

const PostsPage = () => {
  const addPost = (newPost) => {
    console.log("New post added:", newPost);
    // In a real application, you might want to refetch posts or add to local state
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Posts</h1>
      <CreatePost onAddPost={addPost} />
      <PostList />
    </div>
  );
};

export default PostsPage;
