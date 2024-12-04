// components/PostList.js
import Post from "./Post";

const PostList = ({ posts, onUpdate, onDelete }) => {
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
