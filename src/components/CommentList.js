import React from "react";
import Comment from "./Comment";

const CommentList = ({ comments, onUpdate, onDelete }) => {
  return (
    <div className="mt-4">
      <h2 className="font-bold pb-4">Comments</h2>
      {comments.length > 0 ? (
        comments.map((comment) => (
          <Comment
            key={comment.comment_id}
            comment={comment}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        ))
      ) : (
        <p>No comments available for this post.</p>
      )}
    </div>
  );
};

export default CommentList;
