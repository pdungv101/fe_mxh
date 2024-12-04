// components/PostList.js
import Post from "./Post";

const PostList = ({ posts, onUpdate, onDelete }) => {
  if (!posts || posts.length === 0) {
    return <p>No posts available.</p>;
  }
  return (
    <div className="max-w-2xl mx-auto p-4">
      {posts.map((post) => (
        <Post
          key={post.post_id}
          post={post}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default PostList;
