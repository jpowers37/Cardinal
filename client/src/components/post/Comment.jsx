import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from "../../context/AuthContext";
import { baseUrl } from "../../utils";
import CommentItem from './CommentItem';
import './comment.css';

const Comment = ({ postId }) => {
  const [text, setText] = useState('');
  const [comments, setComments] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(`${baseUrl}/api/posts/${postId}`);
        setComments(res.data.comments);
      } catch (err) {
        console.error(err);
      }
    };

    fetchComments();
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (text === '') return;

    try {
      const res = await axios.post(`${baseUrl}/api/posts/${postId}/comments`, { text, userId: user._id });
      setComments(res.data);
      setText('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="commentContainer">
      <form className="commentForm" onSubmit={handleSubmit}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a comment"
        ></textarea>
        <button type="submit">Comment</button>
      </form>
      <div>
        {comments.map((comment) => (
          <CommentItem key={comment._id} comment={comment} />
        ))}
      </div>
    </div>
  );
};

export default Comment;
