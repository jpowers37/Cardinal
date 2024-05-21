import "./post.css";
import { MoreVert } from "@material-ui/icons";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { format } from "timeago.js";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Modal from "react-modal";
import "bootstrap/dist/css/bootstrap.min.css";
import { baseUrl } from "../../utils";

Modal.setAppElement("#root");
 
export default function Post({ post, onDelete, onUpdate }) {
  const [like, setLike] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(false);
  const [user, setUser] = useState({});
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  //const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedDesc, setUpdatedDesc] = useState(post.desc);
  const { user: currentUser } = useContext(AuthContext);

  useEffect(() => {
    setIsLiked(post.likes.includes(currentUser._id));
  }, [currentUser._id, post.likes]);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(baseUrl+`/api/users?userId=${post.userId}`);
      setUser(res.data);
    };
    fetchUser();
  }, [post.userId]);

  const likeHandler = () => {
    try {
      axios.put(baseUrl+"/api/posts/" + post._id + "/like", { userId: currentUser._id });
    } catch (err) {}
    setLike(isLiked ? like - 1 : like + 1);
    setIsLiked(!isLiked);
  };

  const deleteHandler = async () => {
    try {
      await axios.delete(baseUrl+"/api/posts/" + post._id, { data: { userId: currentUser._id } });
      onDelete(post._id);
    } catch (err) {
      console.log(err);
    }
  };

  // const openModal = () => {
  //   setModalIsOpen(true);
  // };

  // const closeModal = () => {
  //   setModalIsOpen(false);
  // };

  // const updateHandler = async () => {
  //   try {
  //     const res = await axios.put("/posts/" + post._id, { userId: currentUser._id, desc: updatedDesc });
  //     onUpdate(res.data);
  //     setModalIsOpen(false);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };
  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setUpdatedDesc(post.desc); // Reset to original description
  };

  const handleSaveClick = async () => {
    try {
      const res = await axios.put(baseUrl+"/api/posts/" + post._id, {
        userId: currentUser._id,
        desc: updatedDesc,
      });
      onUpdate(res.data);
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update post:", err);
    }
  };


  return (
    <div className="post">
    <div className="postWrapper">
      <div className="postTop">
        <div className="postTopLeft">
        <Link to={baseUrl+`/api/profile/${user.username}`}>
              <img
                src={
                  user.profilePicture
                    ? `data:image/png;base64,${user.profilePicture}`
                    : "/path/to/defaultAvatar.png"
                }
                alt=""
                className="topbarImg"
              />
            </Link>
          <span className="postUsername">{user.username}</span>
          <span className="postDate">{format(post.createdAt)}</span>
        </div>
        <div className="postTopRight">
          <DropdownButton id="dropdown-basic-button" className="custom-dropdown" title={<MoreVert />}>
            <Dropdown.Item onClick={handleEditClick}>Update</Dropdown.Item>
            <Dropdown.Item onClick={deleteHandler}>Delete</Dropdown.Item>
          </DropdownButton>
        </div>
      </div>
      <div className="postCenter">
        {isEditing ? (
          <div>
            <textarea
              className="postEditTextArea"
              value={updatedDesc}
              onChange={(e) => setUpdatedDesc(e.target.value)}
            />
            <button onClick={handleSaveClick}>Save</button>
            <button onClick={handleCancelClick}>Cancel</button>
          </div>
        ) : (
          <span className="postText" onClick={handleEditClick}>{post?.desc}</span>
        )}
        <img className="postImg" src={PF + post.img} alt="" />
      </div>
      <div className="postBottom">
        <div className="postBottomLeft">
          <img
            className="likeIcon"
            src={`like.png`}
            onClick={likeHandler}
            alt=""
          />
          {/* <img
            className="likeIcon"
            src={`${PF}heart.png`}
            onClick={likeHandler}
            alt=""
          /> */}
          <span className="postLikeCounter">{like} people like it</span>
        </div>
        <div className="postBottomRight">
          <span className="postCommentText">{post.comment} comments</span>
        </div>
      </div>
    </div>
  </div>
);
}