import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { baseUrl } from "../../utils";

const CommentItem = ({ comment }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${baseUrl}/api/users?userId=${comment.userId}`);
        setUser(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUser();
  }, [comment.userId]); 

  return (
    <div className="comment">
      {user && (
        <>
          <img
            src={user.profilePicture ? `data:image/png;base64,${user.profilePicture}` : "/path/to/defaultAvatar.png"}
            alt=""
            className="commentUserImg"
          />
          <span className="commentUsername">{user.username}</span>
        </>
      )}
      <p>{comment.text}</p>
    </div>
  );
};

export default CommentItem;
