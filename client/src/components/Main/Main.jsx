import React, { useContext, useState } from 'react'
import './Main.css'
import { assets } from '../../assets/assets'
import { Context } from '../../context/Context'
import axios from 'axios';   // Making API requests

const Main = () => {

    const { onSent, recentPrompt, showResult, loading, resultData, setInput, input } = useContext(Context)
    const [isSaved, setIsSaved] = useState(false); // Track if the summary is saved
    const [selectedFile, setSelectedFile] = useState(null); // Track the selected file


    // Function to handle saving the summary
    const handleSave = async () => {
        try {
            const response = await axios.post('/api/saveSummary', {
                documentId: recentPrompt, // Assuming recentPrompt is like a document ID or title
                summaryText: resultData
            });
            setIsSaved(true);
            console.log('Summary saved successfully:', response.data);
        } catch (error) {
            console.error('Error saving summary:', error);
        }
    };


    // Function to handle file selection
    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    // Function to handle file upload
    const handleFileUpload = async () => {
        if (!selectedFile) return;

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const response = await axios.post('/api/uploadFile', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('File uploaded successfully:', response.data);
            // Handle response and update state if needed
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };


    return (
        <div className='main'>
            <div className="main-container">

                {!showResult
                    ? <>
                        <div className="greet">
                            <div><span>Hello</span></div>
                            <p>How can I help you today?</p>
                        </div>
                    </>
                    : <div className='result'>
                        <div className="result-title">
                            <img src={assets.user_icon} alt="" />
                            <p>{recentPrompt}</p>
                        </div>
                        <div className="result-data">
                            <img src={assets.gemini_icon} alt="" />
                            {!loading
                                ? <div>
                                    <p dangerouslySetInnerHTML={{ __html: resultData }} />
                                    {!isSaved && (
                                        <button onClick={handleSave} className="save-btn">
                                            Save
                                        </button>
                                    )}
                                    {isSaved && <p>Saved successfully!</p>}
                                </div>
                                : <div className='loader'>
                                    <hr />
                                    <hr />
                                    <hr />
                                </div>
                            }
                        </div>
                    </div>
                }

                <div className="main-bottom">
                    <div className="search-box">
                        <input onChange={(e) => setInput(e.target.value)} value={input} type="text" placeholder='Enter a prompt here' />
                        <div>
                            <input
                                type="file" id="fileUpload" style={{ display: 'none' }} onChange={handleFileChange}
                            />
                            <label htmlFor="fileUpload">
                                <img
                                    src={assets.gallery_icon} alt="Upload" onClick={() => document.getElementById('fileUpload').click()}
                                />
                            </label>
                            {input ? <img onClick={() => onSent()} src={assets.send_icon} alt="" /> : null}
                        </div>
                    </div>
                    <p className="bottom-info">
                        The information might not always be accurate, so double-check its responses.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Main