import "./topbar.css";
import { Search, Person, Chat, Notifications } from "@material-ui/icons";
import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { baseUrl } from "../../utils";

export default function Topbar() {
  const { user, logout } = useContext(AuthContext);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleLogout = () => {
    logout();
    window.location.href = "/login"; // Redirect to the login page
  };

  const handleSearchKeyDown = async (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (searchTerm.trim()) {
        try {
          const res = await axios.get(
            baseUrl + `/api/users/search?q=${searchTerm}`
          );
          setSearchResults(res.data);
        } catch (err) {
          console.error(err);
        }
      } else {
        setSearchResults([]);
      }
    }
  };

  return (
    <div className="topbarContainer">
      <div className="topbarLeft">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span className="logo">Cardinal</span>
        </Link>
      </div>
      <div className="topbarCenter">
        <div className="searchbar">
          <Search className="searchIcon" />
          <input
            placeholder="Search for friend, post or video"
            className="searchInput"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleSearchKeyDown}
          />
          {searchResults.length > 0 && (
            <div className="searchResults">
              {searchResults.map((result) => (
                <Link
                  to={`/profile/${result.username}`}
                  key={result._id}
                  className="searchResultItem"
                >
                  <img
                    src={
                      result.profilePicture
                        ? PF + result.profilePicture
                        : PF + "person/noAvatar.png"
                    }
                    alt=""
                    className="searchResultImg"
                  />
                  <span className="searchResultName">{result.username}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="topbarRight">
        <div className="topbarLinks">
          <span className="topbarLink">Homepage</span>
          <span className="topbarLink">Timeline</span>
        </div>
        <div className="topbarIcons">
          <div className="topbarIconItem">
            <Person />
            <span className="topbarIconBadge"></span>
          </div>
          <div className="topbarIconItem">
            <Chat />
            <span className="topbarIconBadge"></span>
          </div>
          <div className="topbarIconItem">
            <Notifications />
            <span className="topbarIconBadge"></span>
          </div>
        </div>
        {user ? (
          <>
            <Link to={`/profile/${user.username}`}>
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
            <span
              className="topbarLink"
              onClick={handleLogout}
              style={{ cursor: "pointer", marginLeft: "10px" }}
            >
              Logout
            </span>
          </>
        ) : (
          <>
            <Link to="/login" className="topbarLink">
              Login
            </Link>
            <Link to="/register" className="topbarLink">
              Register
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
