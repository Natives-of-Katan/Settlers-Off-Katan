import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import Axios from "axios";

const Names = () => {

    const [names, setNames] = useState([]);

    useEffect(() => {
        Axios.get("/getNames").then((response) => {
            setNames(response.data)
        })
    }, []);

return(
    <div className="content">
        <span> <h1>List of Names</h1><Link to={"/"}>Home Page</Link> </span>
            {names.map((listItem) => {
                return (
                    <div className="nameList">
                        <ul>
                        <li>{listItem.name}</li>
                        </ul>
                    </div>
                )
            })}  
    </div>
    
    
);
}

export default Names;