import "./rightbar.css";
import { Users } from "../../dummyData";
import Online from "../online/Online";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { Add, Remove } from "@material-ui/icons";
import { baseUrl } from "../../utils";

export default function Rightbar({ user }) {
  const { user: currentUser, dispatch } = useContext(AuthContext);
  const [friends, setFriends] = useState([]);
  const [followed, setFollowed] = useState(
    currentUser.followings.includes(user?._id)
  );
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    city: "",
    from: "",
    relationship: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        city: user.city || "",
        from: user.from || "",
        relationship: user.relationship || "",
      });
    }
  }, [user]);

  useEffect(() => {
    const getFriends = async () => {
      if (user) {
        try {
          const friendList = await axios.get(baseUrl + `/api/users/friends/${user._id}`);
          setFriends(friendList.data);
        } catch (err) {
          console.log(err);
        }
      }
    };
    getFriends();
  }, [user]);

  const handleClick = async () => {
    try {
      if (followed) {
        await axios.put(baseUrl+`/api/users/${user._id}/unfollow`, {
          userId: currentUser._id,
        });
        dispatch({ type: "UNFOLLOW", payload: user._id });
      } else {
        await axios.put(baseUrl+`/api/users/${user._id}/follow`, {
          userId: currentUser._id,
        });
        dispatch({ type: "FOLLOW", payload: user._id });
      }
      setFollowed(!followed);
    } catch (err) {
      console.log(err);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(baseUrl + `/api/users/${user._id}`, { ...formData, userId: currentUser._id });
      setIsEditing(false);
      // Update the local user state
      user.city = formData.city;
      user.from = formData.from;
      user.relationship = formData.relationship;
      // Optionally update the global user state if needed
      dispatch({ type: "UPDATE_USER", payload: user });
    } catch (err) {
      console.error(err);
    }
  };

  const HomeRightbar = () => {
    return (
      <>
        <h4 className="rightbarTitle">Online Friends</h4>
        <ul className="rightbarFriendList">
          {Users.map((u) => (
            <Online key={u.id} user={u} />
          ))}
        </ul>
      </>
    );
  };

  const ProfileRightbar = () => {
    if (!user) {
      return null; // or a loading indicator
    }
    
    return (
      <>
        {user.username !== currentUser.username && (
          <button className="rightbarFollowButton" onClick={handleClick}>
            {followed ? "Unfollow" : "Follow"}
            {followed ? <Remove /> : <Add />}
          </button>
        )}
        <h4 className="rightbarTitle">User information</h4>
        <div className="rightbarInfo">
          {isEditing ? (
            <form className="rightbarInfoForm" onSubmit={handleFormSubmit}>
              <div className="rightbarInfoItem">
                <span className="rightbarInfoKey">City:</span>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="Enter city"
                />
              </div>
              <div className="rightbarInfoItem">
                <span className="rightbarInfoKey">From:</span>
                <input
                  type="text"
                  name="from"
                  value={formData.from}
                  onChange={handleInputChange}
                  placeholder="Enter origin"
                />
              </div>
              <div className="rightbarInfoItem">
                <span className="rightbarInfoKey">Relationship:</span>
                <select
                  name="relationship"
                  value={formData.relationship}
                  onChange={handleInputChange}
                >
                  <option value="">Select relationship status</option>
                  <option value="1">Single</option>
                  <option value="2">Married</option>
                </select>
              </div>
              <button type="submit">Save</button>
              <button type="button" onClick={handleEditToggle}>Cancel</button>
            </form>
          ) : (
            <>
              <div className="rightbarInfoItem">
                <span className="rightbarInfoKey">City:</span>
                <span className="rightbarInfoValue">{user.city || "N/A"}</span>
              </div>
              <div className="rightbarInfoItem">
                <span className="rightbarInfoKey">From:</span>
                <span className="rightbarInfoValue">{user.from || "N/A"}</span>
              </div>
              <div className="rightbarInfoItem">
                <span className="rightbarInfoKey">Relationship:</span>
                <span className="rightbarInfoValue">
                  {user.relationship === 1
                    ? "Single"
                    : user.relationship === 2
                    ? "Married"
                    : "N/A"}
                </span>
              </div>
              {user.username === currentUser.username && (
                <button onClick={handleEditToggle}>Edit</button>
              )}
            </>
          )}
        </div>
        <h4 className="rightbarTitle">User friends</h4>
        <div className="rightbarFollowings">
          {friends.map((friend) => (
            <Link
              to={baseUrl +"/api/profile/" + friend.username}
              style={{ textDecoration: "none" }}
              key={friend._id}
            >
              <div className="rightbarFollowing">
                <img
                  src={
                    friend.profilePicture
                      ? `data:image/png;base64,${friend.profilePicture}`
                      : "client/public/assets/person/noAvatar.png"
                  }
                  alt=""
                  className="rightbarFollowingImg"
                />
                <span className="rightbarFollowingName">{friend.username}</span>
              </div>
            </Link>
          ))}
        </div>
      </>
    );
  };

  return (
    <div className="rightbar">
      <div className="rightbarWrapper">
        {user ? <ProfileRightbar /> : <HomeRightbar />}
      </div>
    </div>
  );
}
