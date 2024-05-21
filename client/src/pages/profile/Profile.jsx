import "./profile.css";
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useParams } from "react-router";
import { AuthContext } from "../../context/AuthContext";
import { baseUrl } from "../../utils";
 
export default function Profile() {
  //const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [user, setUser] = useState({});
  const username = useParams().username;
  const { user: currentUser } = useContext(AuthContext);
  

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(baseUrl+`/api/users?username=${username}`);
      setUser(res.data);
    };
    fetchUser();
  }, [username]);

  const handleFileChange = async (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const base64String = reader.result.replace("data:", "").replace(/^.+,/, "");
        const data = {
          profilePicture: type === "profile" ? base64String : undefined,
          coverPicture: type === "cover" ? base64String : undefined,
        };
        await axios.put(baseUrl+ `/api/users/${currentUser._id}/${type}Picture`, data);
        window.location.reload();
      };
    }
  };

  // const uploadImage = async (data, type) => {
  //   try {
  //     let uploadRes;
  //     if (type === "profile") {
  //       uploadRes = await axios.post("/api/upload/profile", data);
  //       const updatedUser = { ...user, profilePicture: uploadRes.data.fileData };
  //       await axios.put("/api/users/" + currentUser._id + "/profilePicture", updatedUser);
  //     } else {
  //       uploadRes = await axios.post("/api/upload/cover", data);
  //       const updatedUser = { ...user, coverPicture: uploadRes.data.fileData };
  //       await axios.put("/api/users/" + currentUser._id + "/coverPicture", updatedUser);
  //     }
  //     window.location.reload();
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  return (
    <>
      <Topbar />
      <div className="profile">
        <Sidebar />
        <div className="profileRight">
          <div className="profileRightTop">
            <div className="profileCover">
              <img
                className="profileCoverImg"
                src={
                  user.coverPicture
                    ? `data:image/png;base64,${user.coverPicture}`
                    : "client/public/assets/person/noCover.png"
                }
                alt=""
              />
              {currentUser.username === user.username && (
                <label htmlFor="coverInput" className="profileUploadLabel">
                  Upload Cover Photo
                  <input
                    type="file"
                    id="coverInput"
                    style={{ display: "none" }}
                    onChange={(e) => handleFileChange(e, "cover")}
                  />
                </label>
              )}
              <img
                className="profileUserImg"
                src={
                  user.profilePicture
                    ? `data:image/png;base64,${user.profilePicture}`
                    : "client/public/assets/person/noAvatar.png"
                }
                alt=""
              />
              {currentUser.username === user.username && (
                <label htmlFor="profileInput" className="profileUploadLabel">
                  Upload Profile Photo
                  <input
                    type="file"
                    id="profileInput"
                    style={{ display: "none" }}
                    onChange={(e) => handleFileChange(e, "profile")}
                  />
                </label>
              )}
            </div>
            <div className="profileInfo">
              <h4 className="profileInfoName">{user.username}</h4>
              <span className="profileInfoDesc">{user.desc}</span>
            </div>
          </div>
          <div className="profileRightBottom">
            <Feed username={username} />
            <Rightbar user={user} />
          </div>
        </div>
      </div>
    </>
  );
}