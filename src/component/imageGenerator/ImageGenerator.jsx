import React, { useRef, useState } from 'react';
import default_img from "../assets/default_image.svg";
import loader from "../assets/loader.gif";
import "./imageGenerator.css";

export default function ImageGenerator() {
    const [inputValue, setInputValue] = useState('');
    const [image_url, setImage_url] = useState(default_img);
    const [buttonStyle, setButtonStyle] = useState({});
    let inputRef = useRef(null)

    const imageGeneration = () => {
        let Data = null;
        if (inputRef.current.value.trim === "") {
            return 0;
        }
        setInputValue(inputRef.current.value.trim())
        const apiUrl = "https://lexica.art/api/v1/search?q=" + inputRef.current.value.trim();
        document.querySelector(".loader").style.display = "unset";
        fetch(apiUrl)
        .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                document.querySelector(".loader").style.display = "none";
                document.getElementById("images").innerHTML = "";
                document.getElementById("images").style.display = "unset"
                document.querySelector(".first-container").style.display = "none"
                let i = 0;
                data.images.forEach(element => {
                    if (i < 25) {
                        document.getElementById("images").innerHTML += `
                    <li className="card">
                        <img src=${element.src} alt="image" />
                    </li>
                    `
                    }
                    i++;
                });
            })
            .catch(error => {
                console.error("Fetch error:", error);
            });
    }


    const handleInputChange = (event) => {
        const value = event.target.value;
        setInputValue(value);

        if (value.trim() !== "") {
            setButtonStyle({
                background: "linear-gradient(30deg, rgba(255, 166, 0, 1) 0%, rgba(255, 0, 168, 1) 100%)",
                color: "white",
            });
        } else {
            setButtonStyle({});
        }
    };

    return (
        <div className='container'>
            <div className="header">AI Image <span>Generator</span></div>

            <section className="gallery image-container">
                <div className="first-container">
                    <div className="first-display">
                        Search Image
                    </div>
                </div>
                <ul className="images" id='images'>
                    <li className="card">
                        <img src={default_img} alt="" />
                        <div className="details">
                            <div className="photograph">
                                <i className="uil uil-camera"></i>
                            </div>
                            <button type="button" className="import-btn">
                                <i className="uil uil-import"></i>
                            </button>
                        </div>
                    </li>
                </ul>
            </section>
            <div className="loader">
                <img src={loader} alt="" />
            </div>
            <div className="input-box">
                <input
                    ref={inputRef}
                    type="text"
                    id='input-box'
                    placeholder='Describe what you want to generate...'
                    value={inputValue}
                    onChange={handleInputChange}
                />
                <button type="button" onClick={imageGeneration} style={buttonStyle}>
                    Generate
                </button>
            </div>
        </div>
    );
}

