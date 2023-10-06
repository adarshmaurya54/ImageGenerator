import React, { useRef, useState } from 'react';
import default_img from "../assets/default_image.svg";
import loader from "../assets/loader.gif";
import "./imageGenerator.css";

export default function ImageGenerator() {
    const [inputValue, setInputValue] = useState('');
    const [images, setImages] = useState([]);
    const [buttonStyle, setButtonStyle] = useState({});
    const [loading, setLoading] = useState(true);
    const [firstDisplay, setFirstDisplay] = useState(true)
    const [currentImageUrl, setCurrentImageUrl] = useState('');
    let inputRef = useRef(null)


    const imageGeneration = () => {
        setFirstDisplay(false)
        setLoading(true)
        if (inputRef.current.value.trim === "") {
            return 0;
        }
        setInputValue(inputRef.current.value.trim())
        const apiUrl = "https://lexica.art/api/v1/search?q=" + inputRef.current.value.trim();
        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                setImages(data.images.slice(0, 25));
                setLoading(false)
            })
            .catch(error => {
                alert("Fetch error:" + error);
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
    const handleLightBox = () => {
        document.querySelector(".light-box-container").style.scale = "0";
        document.querySelector(".light-box").style.zIndex = "-1";
        document.querySelector(".light-box").style.opacity = "0";
        document.body.style.overflow = "auto";
    }
    const showSingleImage = (src) => {
        document.querySelector(".light-box-container").style.scale = "1";
        document.querySelector(".light-box").style.zIndex = "1000";
        document.querySelector(".light-box").style.opacity = "1";
        document.body.style.overflow = "hidden";
        setCurrentImageUrl(src)
    }
    const handleDownload = () => {
        let imgUrl = currentImageUrl;
        fetch(imgUrl).then(res => res.blob()).then(file => {
            const a = document.createElement("a");
            a.href = URL.createObjectURL(file);
            a.download = new Date().getTime();
            a.click();
        }).catch(() => alert("Failed to download image!"));
    }
    return (
        <div className='container'>
            <div className="light-box">
                <i className="uil uil-times" onClick={handleLightBox}></i>
                <i className="uil uil-import" onClick={handleDownload}></i>
                <div className="light-box-container">
                    <div className="container-inner">
                        <img src={currentImageUrl} alt="image" />
                    </div>
                </div>
            </div>
            <div className="header">AI Image <span>Generator</span></div>

            <section className="gallery image-container">
                {firstDisplay ? (
                    <div className="first-container">
                        <div className="first-display">
                            Search Image
                        </div>
                    </div>) : (
                    loading ? (
                        <div className="loader">
                            <img src={loader} alt="" />
                        </div>
                    ) : (
                        <ul className="images" id='images'>
                            {images.map((element, i) => (
                                <li className="card" key={i}>
                                    <img loading='lazy'
                                        src={element.src}
                                        onClick={() => showSingleImage(element.src)}
                                        alt="image"
                                    />
                                </li>
                            ))}
                        </ul>
                    ))}
            </section>

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

